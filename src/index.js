import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import schema from './schema'
import uuidv4 from 'uuid/v4';

//Initialize express application
const app = express();

// Cors is needed to perform http requests from another domain other than the server domain.
app.use(cors());

// Map of users as data for testing gql queries, schema and resolvers
let users = {
  1: {
    id: '1',
    username: 'Timothy Stanislav',
    messageIds: [1],
  },
  2: {
    id: '2',
    username: 'Dave Davids',
    messageIds: [2, 3],
  } 
}
// Message object containing message data
let messages = {
    1: {
      id: '1',
      text: 'Hello World',
      userId: '1',
    },
    2: {
      id: '2',
      text: 'By World',
      userId: '2',
    },
    3: {
      id: '3',
      text: 'A special message for you!',
      userId: '2',
    },
}
// Resolvers are used to return data for fields from the schema
const resolvers = {
  Query: {
    users: () => {
      return Object.values(users);
    },
    user: (parent, {id}) => {
      return users[id];
    },
    // the third argument is taken from the server's context
    me: (parent, args, {me}) => {
      return me;
    },
    messages: () => {
      return Object.values(messages);
    },
    message: (parent, {id}) => {
      return messages[id];
    },
  },

  Mutation: {
    // create message creates a message object and returns it to the API
    createMessage: (parent, {text}, {me}) => {
      // create a unique id for the message using the uuid library
      const id = uuidv4();
      const message = {
        id,
        text,
        userId: me.id,
      };
      // update message list with new message and update user list with new message id
      messages[id] = message;
      users[me.id].messageIds.push(id);
      return message;
    },
    deleteMessage: (parent, {id}) => {
      // if the input id exists within messages merge it with the other messages
      const {[id]: message, ...otherMessages} = messages;
      // if the message doesn't exist in messages return false
        // This implies no message was deleted.
      if (!message) {
        return false;
      }
      //If there is a message 
      // set messages to be the other messages without the deleted message included
      messages = otherMessages;
      // return true to imply a message was deleted
      return true;
    },
    
    // Update message takes a message id and text and updates the message list
    updateMessage: (parent, {id, text}, {me}) => {
      
      const message = {
        id,
        text,
        userId: me.id,
      };
      // update message at input id location with new message
      messages[id] = message;
      return message;
    },
  },
  

  User: {
    messages: user => {
      return Object.values(messages).filter(
        message => message.userId === user.id,
      )
    },
  },

  Message: {
    user: message => {
      return users[message.userId];
    },
  },

  
};

//Initialize primary gql server passing in schema and resolvers
const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: {
    me: users[1],
  }
});

//Pass the express server, path and any other middleware into the apollo server
server.applyMiddleware({app, path: '/graphql'});

app.listen({ port: 4000 }, () => {
  console.log('Apollo Server on http://localhost:4000/graphql');
});

