import { sequelize } from '../lib/sequelize';
import { Blocked } from './blocked';
import { Message } from './message';

const initAssociations = () => {
  Blocked.associate();
  Message.associate();
};

initAssociations();

export { Blocked, Message, sequelize };
