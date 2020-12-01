/* eslint-disable class-methods-use-this, @typescript-eslint/explicit-module-boundary-types */
import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../lib/sequelize';

export class Message extends Model {
  id!: number;

  createdAt!: Date;

  updatedAt!: Date;

  chatId!: string;

  authorId!: string;

  messageId!: string;

  date: number;

  static associate() {}
}

Message.init(
  {
    chatId: DataTypes.STRING,
    authorId: DataTypes.STRING,
    messageId: DataTypes.STRING,
    date: DataTypes.INTEGER,
  },
  {
    tableName: 'messages',
    name: { singular: 'message', plural: 'messages' },
    sequelize,
  },
);
