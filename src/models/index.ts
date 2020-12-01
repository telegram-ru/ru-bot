/* eslint-disable no-magic-numbers */

import { readdirSync } from 'fs';
import { basename, join } from 'path';
import { DataTypes, Sequelize } from 'sequelize';
import * as config from '../config';

const db = {};
let sequelizeOptions = {
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};

if (typeof config.db === 'string') {
  // @ts-ignore
  sequelizeOptions = [config.db, sequelizeOptions];
} else {
  // @ts-ignore
  sequelizeOptions = [{ ...sequelizeOptions, ...config.db }];
}

// @ts-ignore
const sequelize = new Sequelize(...sequelizeOptions);

readdirSync(__dirname)
  .filter(
    (file) =>
      file.indexOf('.') !== 0 &&
      file !== basename(__filename) &&
      file.slice(-3) === '.js',
  )
  .forEach((file) => {
    // @ts-ignore
    const model = require(join(__dirname, file))(sequelize, DataTypes);
    const name = model.name.charAt(0).toUpperCase() + model.name.slice(1);

    db[name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// @ts-ignore
type Seq = {
  create: (...any) => any;
  destroy: Function;
  findAll: Function;
  findOne: Function;
};

// @ts-ignore
const Message = db.Message as Seq;
// @ts-ignore
const Blocked = db.Blocked as Seq;

export { Blocked, Message, sequelize };
export default db;
