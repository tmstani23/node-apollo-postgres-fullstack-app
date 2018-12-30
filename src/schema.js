import {gql} from 'apollo-server-express';

//the GQL schema is provided to the Apollo server to provide all available data 
//for reading and writing.  The Query type is used for reading data.
const schema = gql`
  type Query {
    """comments can be enabled within the schema using single quotes
    double or more line comments require triple quotes"""
    
    users: [User!]
    me: User
    """the user query takes an id and returns a user"""
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
  
  type Mutation {
    """The createMessage mutation takes a string and returns a message"""
    createMessage(text: String!): Message!
    
    """The deleteMessage mutation takes a messageid and returns a boolean"""
    deleteMessage(id:ID!): Boolean!
    
    updateMessage(id:ID! text: String!): Message!
  }



`;

export default schema;