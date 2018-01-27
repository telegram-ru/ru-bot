const debug = require('debug')('rubot:lib:runtime')
const Telegraf = require('telegraf')
const Botanio = require('botanio')

const extendedContext = require('./extended-context')
const { push } = require('./elastic')


const ms = 1000

/**
 * Installs the list of features to the bot instance
 *
 * @param {Telegraf} bot
 * @param {((bot: Telegraf) => void)[]} list
 */
function installFeatures(bot, list) {
  debug('installFeatures()', list)
  list.forEach((feature) => feature(bot))
}

/**
 * Creates a new Telegraf bot, extending it with features and context methods.
 *
 * @param {string} token
 * @param {string} botanioToken
 * @param {((bot: Telegraf) => void)[]} features
 * @param {{ username: string }} telegrafConfig
 * @return {Telegraf}
 */
function createBot(token, botanioToken, features, telegrafConfig = {}) {
  debug('createBot()', telegrafConfig)
  const bot = new Telegraf(token, telegrafConfig)
  const botan = Botanio(botanioToken)

  bot.use((ctx, next) => {
    ctx.botan = botan
    next()
  })

  if (process.env.NODE_ENV === 'development') {
    bot.use(Telegraf.log())
  }

  if (process.env.BOTANIO_LOG) {
    bot.use((ctx, next) => {
      if (ctx.update.message) {
        ctx.botan.track(ctx.update.message, 'update')
      }
      next()
    })
  }

  if (process.env.ELASTIC_LOG) {
    bot.use((ctx, next) => {
      if (ctx.update.message) {
        push({
          index: `rubot-${process.env.NODE_ENV || 'undefined'}`,
          type: 'message',
          id: `M${ctx.update.message.message_id}C${ctx.update.message.chat.id}F${ctx.update.message.from.id}`,
          body: Object.assign({
            timestamp: new Date(ctx.update.message.date * ms).toISOString(),
          }, ctx.update.message),
        }).catch((error) => {
          console.error('Cant push to elastic', error) // eslint-disable-line no-console
        })
      }
      next()
    })
  }

  // extend the context methods before features
  extendedContext(bot)

  installFeatures(bot, features)

  return bot
}

module.exports = {
  installFeatures,
  createBot,
}
