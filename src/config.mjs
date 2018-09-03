import dbConfig from '../config/database.json'


const {
  BOT_TOKEN,
  BOT_USERNAME = 'ru_community_bot',
  NODE_ENV = 'development',
} = process.env

export const db = dbConfig[NODE_ENV]
export const bot = {
  token: BOT_TOKEN,
  username: BOT_USERNAME,
}
