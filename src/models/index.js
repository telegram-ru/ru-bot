/* eslint-disable no-magic-numbers */
const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const config = require('../config').db


const basename = path.basename(__filename)
const { DB_PASSWORD } = process.env
const db = {}

let sequelize = null

if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable])
}
else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password || DB_PASSWORD,
    config,
  )
}

fs
  .readdirSync(__dirname)
  .filter((file) => (!file.startsWith('.')) && (file !== basename) && (file.endsWith('.js')))
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
