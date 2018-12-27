import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';

//Initialize express application
const app = express();

// Cors is needed to perform http requests from another domain other than the server domain.
app.use(cors());

//the GQL schema is provided to the Apollo server to provide all available data 
//for reading and writing.  The Query type is used for reading data.
const schema = gql`
  type Query {
    users: [User!]
    me: User
    user(id: ID!): User
  }

  type User {
    id: ID!
    username: String!
  }
`

// Map of users as data for testing gql queries, schema and resolvers
let users = {
  1: {
    id: '1',
    username: 'Timothy Stanislav',
  },
  2: {
    id: '2',
    username: 'Dave Davids',
  } 
}

const me = users[1]
// Resolvers are used to return data for fields from the schema
const resolvers = {
  Query: {
    users: () => {
      return Object.values(users);
    },
    user: (parent, {id}) => {
      return users[id];
    },
    me: () => {
      return me;
    },
  },
};

//Initialize primary gql server passing in schema and resolvers
const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
});

//Pass the express server, path and any other middleware into the apollo server
server.applyMiddleware({app, path: '/graphql'});

app.listen({ port: 4000 }, () => {
  console.log('Apollo Server on http://localhost:4000/graphql');
});

