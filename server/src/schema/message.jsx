import {gql} from 'apollo-server-express';

export default gql`
    extend type Query {
        """comments can be enabled within the schema using single quotes
        double or more line comments require triple quotes
        
        messages returns a list of Message objects"""
        messages(cursor: String, limit: Int): MessageConnection!
        
        "message returns a Message object with the given id"
        message(id: ID!): Message!
    }

    extend type Mutation {
        """The createMessage mutation takes a string and returns a message"""
        createMessage(text: String!): Message!
        
        """The deleteMessage mutation takes a messageid and returns a boolean"""
        deleteMessage(id:ID!): Boolean!
        
        """updateMessage updates the message at the input id with the input string
            and returns a message"""
        updateMessage(id:ID! text: String!): Message!
    }

    type MessageConnection {
        edges: [Message!]!
        pageInfo: PageInfo!
    }

    type PageInfo {
        endCursor: Date!
    }
    
    "Message object returned containing three fields: id,text,user"
    type Message {
        id: ID!
        text: String!
        createdAt: Date!
        user: User!
    }
      
`;
