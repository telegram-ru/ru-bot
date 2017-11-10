require('dotenv').config()
const debug = require('debug')('rubot:index')

const config = require('./config')
// const { sequelize } = require('./models')
const { createBot } = require('./lib/runtime')
const features = require('./features')


if (!config.bot.token) {
  throw new Error('No telegram bot token provided')
}

/* eslint-disable no-magic-numbers */
const CHAT_LIST = [
  -1001175826281, // test: RuBotGroup
]
/* eslint-enable no-magic-numbers */

const bot = createBot(config.bot.token, features, { username: config.bot.username })

async function main() {
  debug('main()')
  bot.context.botInfo = await bot.telegram.getMe()

  await Promise.all(CHAT_LIST.map((id) => {
    debug(`Create chat instance for id:${id}`)
    const chat = bot.context.getChatClass(id)
    return chat.getAdmins()
  }))
  debug('main()')

  debug('main() startPolling')
  bot.startPolling()
  console.log('Start polling...') // eslint-disable-line no-console
}


main().catch((error) => {
  console.log(error) // eslint-disable-line no-console
})
