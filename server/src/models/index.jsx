

// Map of users as data for testing gql queries, schema and resolvers
let users = {
    1: {
      id: '1',
      username: 'Timothy Stanislav',
      messageIds: [1],
    },
    2: {
      id: '2',
      username: 'Dave Davids',
      messageIds: [2, 3],
    } 
}
  // Message object containing message data
  let messages = {
      1: {
        id: '1',
        text: 'Hello World',
        userId: '1',
      },
      2: {
        id: '2',
        text: 'By World',
        userId: '2',
      },
      3: {
        id: '3',
        text: 'A special message for you!',
        userId: '2',
      },
  }

  export default {
      users,
      messages,
  }
  