import uuidv4 from 'uuid/v4';
import { triggerAsyncId } from 'async_hooks';
import { ForbiddenError } from 'apollo-server';
import { combineResolvers } from 'graphql-resolvers';
import { isAuthenticated, isMessageOwner } from './authorization';
import Sequelize from 'sequelize';
import pubsub, {EVENTS} from '../subscription';

const toCursorHash = string => Buffer.from(string).toString('base64');
const fromCursorHash = string => Buffer.from(string, 'base64').toString('ascii');

// Message Resolvers:
export default {
  Query: {
    // perform a sequelize findAll on the database to find all messages
    messages: async (
      parent,
      {cursor, limit = 100},
      { models }) => {
      // set cursor at last created at date of previous page:
      const cursorOptions = cursor    
        // Check to make sure cursor isn't needed for first page with ternary
        ? { 
            where: {
              createdAt: {
              // find messages less than value of cursor date property
                // the cursor is reverse hashed as an actual date
                [Sequelize.Op.lt]: fromCursorHash(cursor),
              },
            },
          }
        : {};
      
      const messages = await models.Message.findAll({
        
          // order list by createdAt date
          order: [['createdAt', 'DESC']],
          limit: limit + 1,
          // cursor object abstracted after ternary check above
          ...cursorOptions, 
        });
        const hasNextPage = messages.length > limit;
        
        const edges = hasNextPage ? messages.slice(0, -1) : messages;

      // return list of ordered messages return the limited messages, or
        //all messages if there is no next page.
      return {
        edges,
        pageInfo: {
          hasNextPage,
          // the end cursor value is hashed as a base64 string to hide creation dates from the client
          endCursor: toCursorHash(edges[edges.length - 1].createdAt.toString()),
        },
      }; 
    },

    // find a specific message by id in the database
    message: async (parent, { id }, { models }) => {
      return await models.Message.findById(id);
    },
  },
  
  Mutation: {
    // create a new message using sequelize create.  Includes promise error handling
    createMessage: combineResolvers(
      // isAuth resolver always runs before createmessage resolver
      isAuthenticated,
      async (parent, {text}, {models, me}) => {
        
        const message = await models.Message.create({
          text,
          userId: me.id,
        });

        pubsub.publish(EVENTS.MESSAGE.CREATED, {
          messageCreated: {message},
        })

        return message;
      },
    ),
    // delete message from the db using sequelize destroy method
    deleteMessage: combineResolvers(
      // first check if user is authenticated
      isAuthenticated,
      // next check if current user is message creater
      isMessageOwner,
      async (parent, { id }, { models }) => {
        return await models.Message.destroy({ where: { id } });
      },
    )
  },
  // find a user by id and return that user object
  Message: {
    user: async (message, args, { models }) => {
      return await models.User.findById(message.userId);
    },
  },

  //Subscription resolver listens for changes to messages on the graphQL client 
  Subscription: {
    messageCreated: {
      subscribe: () => pubsub.asyncIterator(EVENTS.MESSAGE.CREATED)
    }
  }
};