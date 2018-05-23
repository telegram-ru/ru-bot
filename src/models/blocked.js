function blocked(sequelize, DataTypes) {
  return sequelize.define('blocked', {
    targetId: DataTypes.STRING,
    type: DataTypes.STRING,
  }, {
    classMethods: {
      associate() {
        // associations can be defined here
      },
    },
  })
}

module.exports = blocked
