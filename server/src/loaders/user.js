// Find all the users based on input keys in the db.  Return an array of keys matching users in the db
export const batchUsers = async (keys, models) => {
    const users = await models.User.findAll({
      where: {
        id: {
          $in: keys,
        },
      },
    });
    // Return an array of keys with matching user ids from user array
    return keys.map(key => users.find(user => user.id === key));
  }

