require('dotenv').config()
const debug = require('debug')('rubot:index')

const config = require('./config')
const { sequelize } = require('./models')
const { createBot } = require('./lib/runtime')
const { Channel } = require('./lib/channel')
const { InvalidChatlistError, validateChatList, normalizeChatList } = require('./lib/chatlist-validate')
const { elasticPing } = require('./lib/elastic')
const features = require('./features')


let chatList
/* eslint-disable unicorn/no-process-exit, no-console */

if (!config.bot.token) {
  throw new Error('No telegram bot token provided')
}

try {
  const chatlistConfig = require('../.chatlist.json') // eslint-disable-line global-require

  validateChatList(chatlistConfig)
  chatList = [...Object.values(normalizeChatList(chatlistConfig))]
}
catch (error) {
  if (error.code === 'MODULE_NOT_FOUND') {
    console.log('ERROR: Maybe you forget create .chatlist.json ?')
    process.exit(-1)
  }

  if (error instanceof InvalidChatlistError) {
    console.error(error.message)
    console.error(error.stack)
    process.exit(-1)
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

  if (process.env.ELASTIC_LOG) {
    await elasticPing()
  }

  bot.context.botInfo = await bot.telegram.getMe()
  bot.context.privateChannel = new Channel(config.bot.privateChannelId, bot)
  // TODO: hardcoded chatlist
  bot.context.ownedChats = []

  if (!await bot.context.privateChannel.canPostMessages()) {
    throw new Error('Bot should be admin and can post messages to private channel')
  }

  await Promise.all(chatList.map((options) => {
    debug(`Create chat instance for id:${options.id}`)
    const chat = bot.context.getChat(options.id)

    chat.setOptions(options)
    bot.context.ownedChats.push(chat)
    return chat.getAdmins()
  }))

  bot.startPolling()
  console.log('Start polling...') // eslint-disable-line no-console
}


main().catch((error) => {
  console.log(error) // eslint-disable-line no-console
})
