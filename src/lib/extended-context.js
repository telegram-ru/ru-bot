const Telegraf = require('telegraf') // eslint-disable-line no-unused-vars
const debug = require('debug')('rubot:context-methods')
const { Channel } = require('./channel')

/* eslint-disable no-param-reassign */

/**
 * Call answerCallbackQuery with debug() error handler
 * @param {any[]} args
 * @return {Promise<void>}
 */
function optionalCallbackQuery(...args) {
  if (this.callbackQuery) {
    return this.answerCallbackQuery(...args)
      .catch(error => debug(`Can't answer callback query #${this.callbackQuery.id}`, error))
  }

  return Promise.resolve()
}

/**
 * Find channel class by its id
 * If not found create class for channel and add it
 * @param {string|number} channelId
 * @return {Channel}
 */
function getChannelClass(channelId) {
  if (!this.channels.has(channelId)) {
    this.channels.set(channelId, new Channel(channelId, this.bot))
  }

  return this.channels.get(channelId)
}

/**
 * Install context methods to bot
 * @param {Telegraf} bot
 */
function extendedContext(bot) {
  bot.context.rootInstance = bot
  bot.context.channels = new Map()
  bot.context.optionalCallbackQuery = optionalCallbackQuery.bind(bot.context)
  bot.context.getChannelClass = getChannelClass.bind(bot.context)
}

module.exports = extendedContext
