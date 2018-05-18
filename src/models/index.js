/* eslint-disable no-magic-numbers */

const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const config = require('../config')


const basename = path.basename(__filename)

const db = {}
let sequelizeOptions = {
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
}

if (typeof config.db === 'string') {
  sequelizeOptions = [config.db, sequelizeOptions]
}
else {
  sequelizeOptions = [Object.assign({}, sequelizeOptions, config.db)]
}

const sequelize = new Sequelize(...sequelizeOptions)

fs
  .readdirSync(__dirname)
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file))
    const name = model.name.charAt(0).toUpperCase() + model.name.slice(1)

    db[name] = model
  })

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
