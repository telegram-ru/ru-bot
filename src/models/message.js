function message(sequelize, DataTypes) {
  return sequelize.define('message', {
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
}

module.exports = message
