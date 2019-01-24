import userResolvers from './user';
import messageResolvers from './message';
import { GraphQLDateTime } from 'graphql-iso-date';

// create custom scalar for easier to read date/time formatting
const customScalarResolver = {
    Date: GraphQLDateTime,
}

// Resolvers are used to return data for fields from the schema
export default [
    userResolvers, 
    messageResolvers,
    customScalarResolver,
];



