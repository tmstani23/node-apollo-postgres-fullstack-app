import {gql} from 'apollo-server-express';

import userSchema from './user';
import messageSchema from './message';

//the GQL schema is provided to the Apollo server to provide all available data 
//for reading and writing.  
// Schema specify how the data should be returned and doesn't return/query the data

// linkSchema defines all types shared within the stitched schemas
const linkSchema = gql`
  scalar Date  

  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }

  type Subscription {
    _: Boolean
  }

`;

export default [linkSchema, userSchema, messageSchema];
