const debug = require('debug')('rubot:lib:runtime')
const Telegraf = require('telegraf')

const { environment } = require('../config')
const extendedContext = require('./extended-context')
const { push } = require('./elastic')


const SECOND = 1000

/**
 *
 * @param {Telegraf} bot
 * @param {((bot: Telegraf) => void)[]} featureList
 */
function installFeatures(bot, featureList) {
  debug('installFeatures()', featureList)
  featureList.forEach((feature) => feature(bot))
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

  if (environment.NODE_ENV === 'development') {
    instance.use(Telegraf.log())
  }

  if (environment.ELASTICSEARCH_URL) {
    instance.use((ctx, next) => {
      if (ctx.update.message) {
        push({
          index: `rubot-${environment.NODE_ENV || 'undefined'}`,
          type: 'message',
          id: `M${ctx.update.message.message_id}C${ctx.update.message.chat.id}F${ctx.update.message.from.id}`,
          body: Object.assign({
            timestamp: new Date(ctx.update.message.date * SECOND).toISOString(),
          }, ctx.update.message),
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
