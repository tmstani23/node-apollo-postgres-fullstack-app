import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { ApolloServer} from 'apollo-server-express';

import schema from './schema';
import resolvers from './resolvers';
import models from './models';

//Initialize express application
const app = express();

// Cors is needed to perform http requests from another domain other than the server domain.
app.use(cors());


//Initialize primary gql server passing in schema and resolvers
const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: {
    models,
    me: models.users[1],
  }
});

//Pass the express server, path and any other middleware into the apollo server
server.applyMiddleware({app, path: '/graphql'});

app.listen({ port: 4000 }, () => {
  console.log('Apollo Server on http://localhost:4000/graphql');
});

