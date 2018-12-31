import uuidv4 from 'uuid/v4';

// Message Resolvers:
export default {
  
  Query: {
    // messages resolver returns message object values
    messages: (parent, args, { models }) => {
      return Object.values(models.messages);
    },
    // message resolver returns the message text with a given input id
    message: (parent, { id }, { models }) => {
      return models.messages[id];
    },
  },

  Mutation: {
    // create message creates a message object and returns it to the API
    createMessage: (parent, { text }, { me, models }) => {
      // create a unique id for the message using the uuid library
      const id = uuidv4();
      const message = {
        id,
        text,
        userId: me.id,
      };
      // update message list with new message and update user list with new message id
      models.messages[id] = message;
      models.users[me.id].messageIds.push(id);
      return message;
    },
    deleteMessage: (parent, { id }, { models }) => {
      // if the input id exists within messages merge it with the other messages
      const { [id]: message, ...otherMessages } = models.messages;
      // if the message doesn't exist in messages return false
      // This implies no message was deleted.
      if (!message) {
        return false;
      }
      //If there is a message 
      // set messages to be the other messages without the deleted message included
      models.messages = otherMessages;
      // return true to imply a message was deleted
      return true;
    },

    // Update message takes a message id and text and updates the message list
    updateMessage: (parent, { id, text }, { me, models }) => {

      const message = {
        id,
        text,
        userId: me.id,
      };
      // update message at input id location with new message
      models.messages[id] = message;
      return message;
    },
  },

  Message: {
    user: (message, args, { models }) => {
      return models.users[message.userId];
    },
  },
}