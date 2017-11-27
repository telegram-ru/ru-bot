
module.exports = (sequelize, DataTypes) => {
  const blocked = sequelize.define('blocked', {
    targetId: DataTypes.STRING,
    type: DataTypes.STRING,
  }, {
    classMethods: {
      associate(models) {
        // associations can be defined here
      },
    },
  })
  return blocked
}
