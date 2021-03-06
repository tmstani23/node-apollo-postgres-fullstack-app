import 'dotenv/config';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import express from 'express';
import http from 'http';
import {
  ApolloServer,
  AuthenticationError,
  } from 'apollo-server-express';

import schema from './schema';
import resolvers from './resolvers';
import models, {sequelize} from './models';
import DataLoader from 'dataloader';
import loaders from './loaders';


//Initialize express application
const app = express();

// Cors is needed to perform http requests from another domain other than the server domain.
app.use(cors());
console.log(process.env.SECRET);

// Verify the token and return verified token object
const getMe = async req => {
  // authorization token is extracted from the incoming HTTP request
  const token = req.headers['x-token'];
  // If token exists me user is defined using the encoded data
  if (token) {
    try {
      return await jwt.verify(token, process.env.SECRET);
    } catch (error) {
      // if token exists and is invalid throw an error 
      throw new AuthenticationError(
          'Your session expired.  Sign in again.',
        );
    }
  }
  // else the me user remains undefined and unauthenticated
};

//Initialize primary gql server passing in schema and resolvers
const server = new ApolloServer({
  introspection: true,
  playground: true,
  typeDefs: schema,
  resolvers,
  formatError: error => {
    // remove the internal sequelize error message
    // leave only the important validation error
    const message = error.message
      .replace('SequelizeValidationError: ', '')
      .replace('Validation error: ', '');

    return {
      ...error,
      message,
    };
  },
  context: async ({req, connection}) => {
    // if Subscription connection exists
    if (connection) {
      return {
        models,
      };
    }
    // If http requests (graphql mutations and queries)
    if (req) {
      // authenticated me user is injected into the apollo server's context with each request
    // The me user data is encoded into the token using createToken 
      //sparing additional database requests
    const me = await getMe(req);
    
      return {
        models,
        me,
        secret: process.env.SECRET,
        // The DataLoader takes a function of ordered keys and models to be passed as context to the resolvers
        loaders: {
          user: new DataLoader(keys => 
            loaders.user.batchUsers(keys, models)),
        },
      };
    } 
  },  
});



//Pass the express server, path and any other middleware into the apollo server
server.applyMiddleware({app, path: '/graphql'});

// create an http server and install subscription handlers.  Used for monitoring 
const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);


// Set database reseeding flag to depend on test database env variable
const isTest = !!process.env.TEST_DATABASE;

//Specify if production environment
const isProduction = !!process.env.DATABASE_URL;
//Set fallback port incase heroku port assignment fails
const port = process.env.PORT || 4000;

//Sync all models with the database, force will drop all other tables
sequelize.sync({ force: isTest || isProduction }).then(async () => {
  if (isTest || isProduction) {
    //Seed the test database
    createUsersWithMessages(new Date());
  }
  //set httpserver to listen on port 4000.  
  //used in subscriptions to allow real time communication between user message updates.
  httpServer.listen({ port }, () => {
    console.log(`Apollo Server on http://localhost:${port}/graphql`);
  });
});

// Create two seed users object with messages
const createUsersWithMessages = async date => {
  await models.User.create(
    {
      username: 'tmstani23',
      email: 'tmstani23@happy.com',
      password: 'tmstani23',
      // role is used to determine allowances for operations like deleteUser
      role: 'ADMIN',
      messages: [
        {
          text: 'Published the Road to learn React',
          createdAt: date.setSeconds(date.getSeconds() + 1),
        },
      ],
    },
    {
      include: [models.Message],
    },
  );
  
  await models.User.create(
    {
      username: 'ddavids',
      email: 'hello@david.com',
      password: 'ddavids',
      messages: [
        {
          text: 'Happy to release ...',
          createdAt: date.setSeconds(date.getSeconds() + 1),
        },
        {
          text: 'Published a complete ...',
          createdAt: date.setSeconds(date.getSeconds() + 1),
        },
      ],
    },
    {
      include: [models.Message],
    },
  );
};








