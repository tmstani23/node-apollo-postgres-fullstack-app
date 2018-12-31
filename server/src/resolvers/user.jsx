
// User Resolvers
export default {
    Query: {
        // return the full list of users objects
        users: (parent, args, {models}) => {
          return Object.values(models.users);
        },
        // user resolver returns a specific user object within the users object using id property
        user: (parent, {id}, {models}) => {
          return models.users[id];
        },
        // the third argument is taken from the server's context
        // me returns user[1] object from users objects
        me: (parent, args, {me}) => {
          return me;
        },
    },

    User: {
        // Return an array of messages with matching message and user ids
        messages: (user, args, {models}) => {
            return Object.values(models.messages).filter(
                message => message.userId === user.id,
            )
        },
    },
}