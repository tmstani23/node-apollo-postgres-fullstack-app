import {gql} from 'apollo-server-express';


export default gql`
    extend type Query {
        """users query returns a list of type User"""
        users: [User!]
        me: User
        
        """the user query takes an id and returns a user"""
        user(id: ID!): User
    }

    extend type Mutation {
        signUp(
            username: String!
            email: String!
            password: String!
        ): Token!

        signIn(login: String!, password: String!): Token!

        deleteUser(id: ID!): Boolean!
    }

    type Token {
        token: String!
    }

    type User {
        id: ID!
        username: String!
        email: String!
        role: String
        messages: [Message!]
      }
`;