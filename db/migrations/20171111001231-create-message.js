
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('messages', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    chatId: {
      type: Sequelize.STRING,
    },
    authorId: {
      type: Sequelize.STRING,
    },
    messageId: {
      type: Sequelize.STRING,
    },
    date: {
      type: Sequelize.INTEGER,
    },
  }).then(() => {
    queryInterface.addIndex('messages', {
      fields: ['chatId', 'authorId', 'messageId'],
      unique: true,
    })
  }),
  down: (queryInterface) => queryInterface.dropTable('messages'),
}
