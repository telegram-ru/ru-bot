const Telegraf = require('telegraf') // eslint-disable-line no-unused-vars
const debug = require('debug')('rubot:context-methods')
const { Chat } = require('./chat')

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
 * Find chat class by its id
 * If not found create class for chat and add it
 * @param {string|number} chatId
 * @return {Chat}
 */
function getChatClass(chatId) {
  if (!this.chats.has(chatId)) {
    this.chats.set(chatId, new Chat(chatId, this.rootInstance))
  }

  return this.chats.get(chatId)
}

/**
 * Install context methods to bot
 * @param {Telegraf} bot
 */
function extendedContext(bot) {
  bot.context.rootInstance = bot
  bot.context.chats = new Map()
  bot.context.optionalCallbackQuery = optionalCallbackQuery.bind(bot.context)
  bot.context.getChatClass = getChatClass.bind(bot.context)
}

module.exports = extendedContext
