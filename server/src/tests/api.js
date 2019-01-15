import axios from 'axios';

const API_URL = 'http://localhost:4000/graphql';

// Make an http query and get user data from the gql server given a specific id
export const user = async variables =>
    axios.post(API_URL, {
        query: `
            query ($id: ID!) {
                user(id: $id) {
                    id
                    username
                    email
                    role
                }
            }
        `,
        variables,
    });