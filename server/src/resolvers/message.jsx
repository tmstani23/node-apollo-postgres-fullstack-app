import uuidv4 from 'uuid/v4';
import { triggerAsyncId } from 'async_hooks';

// Message Resolvers:
export default {
  Query: {
    // perform a sequelize findAll on the database to find all messages
    messages: async (parent, args, { models }) => {
      return await models.Message.findAll();
    },
    // find a specific message by id in the database
    message: async (parent, { id }, { models }) => {
      return await models.Message.findById(id);
    },
  },
  Mutation: {
    // create a new message using sequelize create.  Includes promise error handling
    createMessage: async (parent, { text }, { me, models }) => {
      
      try {
        return await models.Message.create({
          text,
          userId: me.id,
        });
      } catch (error) {
        throw new Error(error);
      }
    },
    // delete message from the db using sequelize destroy method
    deleteMessage: async (parent, { id }, { models }) => {
      return await models.Message.destroy({ where: { id } });
    },
  },
  // find a user by id
  Message: {
    user: async (message, args, { models }) => {
      return await models.User.findById(message.userId);
    },
  },
};