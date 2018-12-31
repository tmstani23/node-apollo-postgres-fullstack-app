import {gql} from 'apollo-server-express';

import userSchema from './user';
import messageSchema from './message';

//the GQL schema is provided to the Apollo server to provide all available data 
//for reading and writing.  The Query type is used for reading data.

// linkSchema defines all types shared within the stitched schemas
const linkSchema = gql`
  
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
