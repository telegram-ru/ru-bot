/* eslint-disable class-methods-use-this, @typescript-eslint/explicit-module-boundary-types, import/no-cycle */
import { DataTypes, Model } from 'sequelize';
import { sequelize } from './index';

export class Blocked extends Model {
  id!: number;

  createdAt!: Date;

  updatedAt!: Date;

  targetId: number;

  type: string;

  static associate() {}
}

Blocked.init(
  {
    targetId: DataTypes.STRING,
    type: DataTypes.STRING,
  },
  {
    tableName: 'blockeds',
    name: { singular: 'blocked', plural: 'blockeds' },
    sequelize,
  },
);
