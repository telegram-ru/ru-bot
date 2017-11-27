
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('blockeds', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    targetId: {
      type: Sequelize.STRING,
    },
    type: {
      type: Sequelize.STRING,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  }).then(() => queryInterface.addIndex('blockeds', {
    fields: ['targetId', 'type'],
  })),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('blockeds'),
}
