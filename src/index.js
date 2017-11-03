require('dotenv').config()
const debug = require('debug')('rubot:index')

const config = require('./config')
// const { sequelize } = require('./models')
const { createBot } = require('./lib/runtime')
const botParticipation = require('./features/bot-participation')


if (!config.bot.token) {
  throw new Error('No telegram bot token provided')
}

const features = [
  botParticipation,
]

const bot = createBot(config.bot.token, features, { username: config.bot.username })

async function main() {
  debug('main()')
  await bot.fetchBotData()

  debug('main() startPolling')
  bot.startPolling()
  console.log('Start polling...') // eslint-disable-line no-console
}


main()
