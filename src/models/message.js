
const Message = (sequelize, DataTypes) => {
  const message = sequelize.define('message', {
    chatId: DataTypes.STRING,
    authorId: DataTypes.STRING,
    messageId: DataTypes.STRING,
    date: DataTypes.INTEGER,
  }, {
    timestamps: false,
    classMethods: {
      // associate(models) {
      //   // associations can be defined here
      // },
    },
  })
  return message
}

module.exports = Message
