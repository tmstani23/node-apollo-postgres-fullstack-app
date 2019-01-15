import { expect } from 'chai';
import * as userApi from './api';

// Test GQL server with specific user data and check for differences
describe('users', () => {
    describe('user(id: String!): User', () => {
        // test for if user exists in database
        it('returns a user when user can be found', async () => {
            const expectedResult = {
                data: {
                    user: {
                        id: '1',
                        username: 'tmstani23',
                        email: 'tmstani23@happy.com',
                        role: 'ADMIN',
                    },
                },
            };
            // Get the result from the gql api
            const result = await userApi.user({
                id: '1'
            });
            // Verify the gql result data matches the test result data
            expect(result.data).to.eql(expectedResult);
        });
        // check if user cannot be found in database
        it('returns null when user cannot be found', async () => {
            const expectedResult = {
                data: {
                    user: null,
                },
            };
            const result = await userApi.user({
                id: '42'
            });
            expect(result.data).to.eql(expectedResult);
        });
    });
});