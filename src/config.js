const dbConfig = require('../config/database.json')


const {
  BOT_TOKEN,
  PRIVATE_CHANNEL_ID,
  BOT_USERNAME = 'ru_community_bot',
  NODE_ENV = 'development',
} = process.env

process.env.NODE_ENV = NODE_ENV

module.exports = {
  db: dbConfig[NODE_ENV],
  bot: {
    token: BOT_TOKEN,
    username: BOT_USERNAME,
    privateChannelId: PRIVATE_CHANNEL_ID,
  },
  dev: NODE_ENV === 'development',
  prod: NODE_ENV !== 'development',
}
