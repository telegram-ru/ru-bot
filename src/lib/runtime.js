const debug = require('debug')('rubot:lib:runtime')
const Telegraf = require('telegraf')

const extendedContext = require('./extended-context')

/**
 *
 * @param {Telegraf} bot
 * @param {((bot: Telegraf) => void)[]} featureList
 */
function installFeatures(bot, featureList) {
  debug('installFeatures()', featureList)
  featureList.forEach(feature => feature(bot))
}

async function fetchBotData() {
  debug('fetchBotData() start')
  this.context.bot = await this.telegram.getMe()
  debug('fetchBotData() finish')
}

/**
 * Create new instance of Telegraf bot
 * extends it with features and context methods
 *
 * @param {string} token
 * @param {((bot: Telegraf) => void)[]} features
 * @param {{ username: string }} telegrafConfig
 * @return {Telegraf}
 */
function createBot(token, features, telegrafConfig = {}) {
  debug('createBot()', telegrafConfig)
  const instance = new Telegraf(token, telegrafConfig)

  if (process.env.NODE_ENV === 'development') {
    instance.use(Telegraf.log())
  }

  // install context methods before features
  extendedContext(instance)
  instance.fetchBotData = fetchBotData

  installFeatures(instance, features)

  return instance
}

module.exports = {
  installFeatures,
  createBot,
}
