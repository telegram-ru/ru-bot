/* eslint-disable no-magic-numbers, @typescript-eslint/no-explicit-any, import/no-cycle, import/first, no-console */
import { Options, Sequelize } from 'sequelize';
import { db, prod } from '../config';

(Sequelize as any).postgres.DECIMAL.parse = parseFloat;

export const sequelize = new Sequelize(db.database, db.user, db.password, {
  logging: prod ? false : console.log,
  host: db.host,
  dialect: 'postgres',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
} as Options);
