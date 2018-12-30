import {gql} from 'apollo-server-express';

//the GQL schema is provided to the Apollo server to provide all available data 
//for reading and writing.  The Query type is used for reading data.
const schema = gql`
  type Query {
    users: [User!]
    me: User
    user(id: ID!): User

    messages: [Message!]!
    message(id: ID!): Message!
  }
  type User {
    id: ID!
    username: String!
    messages: [Message!]
  }
  type Message {
    id: ID!
    text: String!
    user: User!
  }
`;

export default schema;