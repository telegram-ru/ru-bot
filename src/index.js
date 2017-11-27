require('dotenv').config()
const debug = require('debug')('rubot:index')

const config = require('./config')
const { sequelize } = require('./models')
const { createBot } = require('./lib/runtime')
const { Channel } = require('./lib/channel')
const features = require('./features')


if (!config.bot.token) {
  throw new Error('No telegram bot token provided')
}

/* eslint-disable no-magic-numbers */
const CHAT_LIST = [
  -1001175826281, // test: RuBotGroup
  -1001095675733, // IT Holywars
]
/* eslint-enable no-magic-numbers */

const bot = createBot(
  config.bot.token,
  config.bot.botanioToken,
  features,
  { username: config.bot.username }
)

async function main() {
  debug('main()')
  await sequelize.authenticate()

  bot.context.botInfo = await bot.telegram.getMe()
  bot.context.privateChannel = new Channel(config.bot.privateChannelId, bot)
  // TODO: hardcoded chatlist
  bot.context.ownedChats = []

  if (!await bot.context.privateChannel.canPostMessages()) {
    throw new Error('Bot should be admin and can post messages to private channel')
  }

  await Promise.all(CHAT_LIST.map((id) => {
    debug(`Create chat instance for id:${id}`)
    const chat = bot.context.getChat(id)

    bot.context.ownedChats.push(chat)
    return chat.getAdmins()
  }))

  bot.startPolling()
  console.log('Start polling...') // eslint-disable-line no-console
}


main().catch((error) => {
  console.log(error) // eslint-disable-line no-console
})
