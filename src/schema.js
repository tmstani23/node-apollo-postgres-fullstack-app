const userSchema = `
    type User {
        id: ID!
        username: String!
      }
`;

export const messageSchema = `
    type Message {
        id: ID!
        text: String!
    }
`
export default userSchema;