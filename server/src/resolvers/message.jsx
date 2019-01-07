import uuidv4 from 'uuid/v4';
import { triggerAsyncId } from 'async_hooks';
import { ForbiddenError } from 'apollo-server';
import { combineResolvers } from 'graphql-resolvers';
import { isAuthenticated, isMessageOwner } from './authorization';
import Sequelize from 'sequelize';

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
                [Sequelize.Op.lt]: cursor,
              },
            },
          }
        : {};
      // return list of ordered messages ending at limit number beginning at cursor
      return await models.Message.findAll({
        // order list by createdAt date
        order: [['createdAt', 'DESC']],
        limit,
        // cursor object abstracted after ternary check above
        ...cursorOptions,
       
      });
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
        return await models.Message.create({
          text,
          userId: me.id,
        });
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
};