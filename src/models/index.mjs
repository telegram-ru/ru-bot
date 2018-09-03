import Sequelize from 'sequelize'
import DataTypes from 'sequelize/lib/data-types'

import * as config from '../config'
import { Message } from './message'


const sequelizeDefaultOptions = {
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
}

const sequelizeOptions = (typeof config.db === 'string')
  ? [config.db, sequelizeDefaultOptions]
  : [{
    ...sequelizeDefaultOptions,
    ...config.db,
    pool: {
      ...sequelizeDefaultOptions.pool,
      ...config.db.pool,
    },
  }]

export const sequelize = new Sequelize(...sequelizeOptions)

export const models = {
  Message: Message(sequelize, DataTypes),
}

Object.values(models)
  .forEach((model) => {
    if (model.associate) model.associate(models)
  })

