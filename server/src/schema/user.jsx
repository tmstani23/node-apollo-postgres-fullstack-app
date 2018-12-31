import {gql} from 'apollo-server-express';

export default gql`
    extend type Query {
        """users query returns a list of type User"""
        users: [User!]
        me: User
        
        """the user query takes an id and returns a user"""
        user(id: ID!): User
    }

    type User {
        id: ID!
        username: String!
        messages: [Message!]
      }
`;