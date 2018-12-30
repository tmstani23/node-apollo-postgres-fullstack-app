import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import schema from './schema'

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

