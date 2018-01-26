const Telegraf = require('telegraf') // eslint-disable-line no-unused-vars
const debug = require('debug')('rubot:context-methods')
const { Chat } = require('./chat')
const { Hammer } = require('./hammer')


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
function getChat(chatId) {
  if (!this.chats.has(chatId)) {
    this.chats.set(chatId, new Chat(chatId, this.rootInstance))
  }

  return this.chats.get(chatId)
}

function newHammer() {
  return new Hammer(this)
}

/**
 * Check if chat in list
 * @param {Chat} chat
 * @return {boolean}
 */
function isChatInWhiteList(chat) {
  return this.chats.has(chat.id)
}

const bindedContextMethods = {
  getChat,
  newHammer,
  isChatInWhiteList,
  optionalCallbackQuery,
}

/**
 * Install context methods to bot
 * @param {Telegraf} bot
 */
function extendedContext(bot) {
  bot.context.rootInstance = bot
  bot.context.chats = new Map()

  Object.keys(bindedContextMethods).forEach((name) => {
    bot.context[name] = bindedContextMethods[name].bind(bot.context)
  })
}

module.exports = extendedContext
