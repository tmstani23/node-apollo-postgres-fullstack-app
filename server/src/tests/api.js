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

// Perform axios mutation request to signin a user
export const signIn = async variables => 
    await axios.post(API_URL, {
        query: `
            mutation ($login: String!, $password: String!) {
                signIn(login: $login, password: $password) {
                    token
                }
            }
        `,
        variables,
    })
// Perform delete user mutation passing in the variables and token for use in the header.
// The token is provided by the result of the signIn mutation above.
export const deleteUser = async (variables, token) => 
    axios.post(
        API_URL,
        {
            query: `
                mutation ($id: ID!) {
                    deleteUser(id: $id)
                }
            `,
            variables,
        },
        {
            headers: {
                'x-token': token,
            } 
        },
    );