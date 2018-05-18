require('dotenv').config()
const url = require('url')
const dbConfig = require('./database.json')


const environment = process.env
const {
  BOT_TOKEN,
  PRIVATE_CHANNEL_ID,
  BOT_USERNAME = 'ru_community_bot',
  NODE_ENV = 'development',
} = environment

let db

if (environment.DB_URL) {
  const { auth, pathname, protocol, host } = url.parse(environment.DB_URL)
  const [username, password] = auth.split(':')
  const database = pathname.slice(1)
  const dialect = protocol.slice(0, -1)

  db = {
    username,
    password,
    database,
    host,
    dialect,
  }
}
else {
  db = dbConfig[NODE_ENV]
}
module.exports = {
  db,
  environment,
  bot: {
    token: BOT_TOKEN,
    username: BOT_USERNAME,
    privateChannelId: PRIVATE_CHANNEL_ID,
  },
  dev: NODE_ENV === 'development',
  prod: NODE_ENV !== 'development',
}
