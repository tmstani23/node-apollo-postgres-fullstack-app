import 'dotenv/config';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';

const app = express();

const schema;
const resolvers;

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
})

server.applyMiddleware({app, path: '/graphql'});


console.log(process.env.SOME_ENV_VARIABLE);
