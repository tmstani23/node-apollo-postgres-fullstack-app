// This model is used to map messages between the model and sql table
const message = (sequelize, DataTypes) => {
    // define text as a string
    const Message = sequelize.define('message', {
        text: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: {
                    args: true,
                    msg: "message failed validation.  empty text input.",
                },
            },
        },
    });
    // associate message model with user model
    Message.associate = models => {
        Message.belongsTo(models.User);
    };
    return Message;
};

export default message;