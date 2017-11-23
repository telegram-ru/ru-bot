const debug = require('debug')('rubot:lib:runtime')
const Telegraf = require('telegraf')
const Botanio = require('telegraf-botanio')

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


/**
 * Create new instance of Telegraf bot
 * extends it with features and context methods
 *
 * @param {string} token
 * @param {((bot: Telegraf) => void)[]} features
 * @param {{ username: string }} telegrafConfig
 * @return {Telegraf}
 */
function createBot(token, botanioToken, features, telegrafConfig = {}) {
  debug('createBot()', telegrafConfig)
  const instance = new Telegraf(token, telegrafConfig)
  const botanio = new Botanio(botanioToken)

  instance.use(botanio.middleware())

  if (process.env.NODE_ENV === 'development') {
    instance.use(Telegraf.log())
  }
  else {
    instance.use((ctx, next) => {
      ctx.botanio.track('update')
      next()
    })
  }

  // install context methods before features
  extendedContext(instance)

  installFeatures(instance, features)

  return instance
}

module.exports = {
  installFeatures,
  createBot,
}
