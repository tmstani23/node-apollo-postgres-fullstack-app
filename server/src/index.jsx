import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { ApolloServer} from 'apollo-server-express';

import schema from './schema';
import resolvers from './resolvers';
import models, {sequelize} from './models';

//Initialize express application
const app = express();

// Cors is needed to perform http requests from another domain other than the server domain.
app.use(cors());
console.log(process.env.DATABASE);

//Initialize primary gql server passing in schema and resolvers
const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: async() => ({
    models,
    me: await models.User.findByLogin('tmstani23'),
    secret: process.env.SECRET,
  }),
});

//Pass the express server, path and any other middleware into the apollo server
server.applyMiddleware({app, path: '/graphql'});

const eraseDatabaseOnSync = true;
sequelize.sync({ force: eraseDatabaseOnSync }).then(async () => {
  if (eraseDatabaseOnSync) {
    createUsersWithMessages();
  }
  app.listen({ port: 4000 }, () => {
    console.log('Apollo Server on http://localhost:4000/graphql');
  });
});

const createUsersWithMessages = async () => {
  await models.User.create(
    {
      username: 'tmstani23',
      email: 'tmstani23@gmail.com',
      password: 'tmstani23',
      messages: [
        {
          text: 'Published the Road to learn React',
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
        },
        {
          text: 'Published a complete ...',
        },
      ],
    },
    {
      include: [models.Message],
    },
  );
};

