require('dotenv').config()
const debug = require('debug')('rubot:index')

const config = require('./config')
const { sequelize } = require('./models')
const { createBot } = require('./lib/runtime')
const { Channel } = require('./lib/channel')
const features = require('./features')


let CHAT_LIST


if (!config.bot.token) {
  throw new Error('No telegram bot token provided')
}

try {
  const obj = require('../.chatlist.json') // eslint-disable-line global-require

  CHAT_LIST = [...Object.values(obj)]
}
catch (error) {
  if (error.code === 'MODULE_NOT_FOUND') {
    // eslint-disable-next-line no-console
    console.log('ERROR: Maybe you forget create .chatlist.json ?')
    process.exit(-1) // eslint-disable-line unicorn/no-process-exit
  }

  throw error
}

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
