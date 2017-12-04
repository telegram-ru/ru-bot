const debug = require('debug')('rubot:lib:runtime')
const Telegraf = require('telegraf')
const Botanio = require('botanio')

const extendedContext = require('./extended-context')
const { push } = require('./elastic')

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
  const botan = Botanio(botanioToken)

  instance.use((ctx, next) => {
    ctx.botan = botan
    next()
  })

  if (process.env.NODE_ENV === 'development') {
    instance.use(Telegraf.log())
  }

  if (process.env.BOTANIO_LOG) {
    instance.use((ctx, next) => {
      if (ctx.update.message) {
        ctx.botan.track(ctx.update.message, 'update')
      }
      next()
    })
  }

  if (process.env.ELASTIC_LOG) {
    instance.use((ctx, next) => {
      if (ctx.update.message) {
        push({
          index: `rubot-${process.env.NODE_ENV || 'undefined'}`,
          type: 'message',
          id: String(ctx.update.message.message_id),
          body: ctx.update.message,
          timestamp: ctx.update.message.date,
        }).catch((error) => {
          console.error('Cant push to elastic', error) // eslint-disable-line no-console
        })
      }
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
