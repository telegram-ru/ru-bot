const dbConfig = require('../config/database.json')


const {
  BOT_TOKEN,
  BOT_USERNAME = 'ru_community_bot',
  NODE_ENV = 'development',
} = process.env

module.exports = {
  db: dbConfig[NODE_ENV],
  bot: {
    token: BOT_TOKEN,
    username: BOT_USERNAME,
  },
  dev: NODE_ENV === 'development',
  prod: NODE_ENV !== 'development',
}
