import { parse } from 'url';
import { config } from 'dotenv';

// eslint-disable-next-line @typescript-eslint/no-var-requires
import dbConfig from './database.json';

config();

export const environment = process.env;
const {
  BOT_TOKEN,
  PRIVATE_CHANNEL_ID,
  BOT_USERNAME = 'ru_community_bot',
  NODE_ENV = 'development',
} = environment;

function setupDbVar(): Record<string, string> {
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

export const db = setupDbVar();

export const bot = {
  token: BOT_TOKEN,
  username: BOT_USERNAME,
  privateChannelId: PRIVATE_CHANNEL_ID,
};

export const dev = NODE_ENV === 'development';
export const prod = NODE_ENV === 'production';
