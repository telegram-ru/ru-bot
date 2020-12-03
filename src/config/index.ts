import { parse } from 'url';
import { config } from 'dotenv';

import dbConfig from './database.json';

config();

const environment = process.env;
const {
  BOT_TOKEN,
  MONGODB_URL,
  PRIVATE_CHANNEL_ID,
  BOT_USERNAME = 'ru_community_bot',
  NODE_ENV = 'development',
} = environment;

function setupDbVar(): Record<string, unknown> {
  if (environment.DATABASE_URL) {
    const { auth, pathname, protocol, host } = parse(environment.DATABASE_URL);

    const [username, password] = (auth || '').split(':');
    const database = pathname.slice(1);
    const dialect = protocol.slice(0, -1);

    return {
      username,
      password,
      database,
      host,
      dialect,
    };
  }
  return dbConfig[NODE_ENV];
}

const db = setupDbVar();

const bot = {
  token: BOT_TOKEN,
  username: BOT_USERNAME,
  privateChannelId: PRIVATE_CHANNEL_ID,
};

const dev = NODE_ENV === 'development';
const prod = NODE_ENV !== 'development';

export { db, environment, bot, dev, prod, MONGODB_URL };
