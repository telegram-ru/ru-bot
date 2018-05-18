require('dotenv').config()
const dbConfig = require('./database.json')


const environment = process.env
const {
  BOT_TOKEN,
  PRIVATE_CHANNEL_ID,
  BOT_USERNAME = 'ru_community_bot',
  NODE_ENV = 'development',
} = environment

module.exports = {
  environment,
  bot: {
    token: BOT_TOKEN,
    username: BOT_USERNAME,
    privateChannelId: PRIVATE_CHANNEL_ID,
  },
  db: environment.DB_URL || dbConfig[NODE_ENV],
  dev: NODE_ENV === 'development',
  prod: NODE_ENV !== 'development',
}
