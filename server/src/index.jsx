import 'dotenv/config';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import uuidv4 from 'uuid/v4';
import express from 'express';
import {
  ApolloServer,
  AuthenticationError,
  } from 'apollo-server-express';

import schema from './schema';
import resolvers from './resolvers';
import models, {sequelize} from './models';

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
  context: async ({req}) => {
    // authenticated me user is injected into the apollo server's context with each request
    // The me user data is encoded into the token using createToken 
      //sparing additional database requests
    const me = await getMe(req);
    
    return {
      models,
      me,
      secret: process.env.SECRET,
    };
  },  
});



//Pass the express server, path and any other middleware into the apollo server
server.applyMiddleware({app, path: '/graphql'});

const eraseDatabaseOnSync = true;

sequelize.sync({ force: eraseDatabaseOnSync }).then(async () => {
  if (eraseDatabaseOnSync) {
    createUsersWithMessages(new Date());
  }

  app.listen({ port: 4000 }, () => {
    console.log('Apollo Server on http://localhost:4000/graphql');
  });
});

const createUsersWithMessages = async date => {
  await models.User.create(
    {
      username: 'tmstani23',
      email: 'tmstani23@gmail.com',
      password: 'tmstani23',
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





