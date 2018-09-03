const debug = require('debug')('rubot:lib:hammer')
const Sentry = require('@sentry/node')
const { Blocked, Message } = require('../models')

/* eslint-disable class-methods-use-this, no-restricted-syntax, no-await-in-loop */

class Hammer {
  constructor(context) {
    this.bot = context.rootInstance
    this.ctx = context
  }

  /**
   * Add user by id to blacklist
   * @see https://core.telegram.org/bots/api#user
   * @param {TelegramUser} user
   * @param {number[]} exceptChatIds
   */
  async blacklistUser(user, exceptChatIds = []) {
    debug('blacklistUser', user.id)
    const blacklistedIn = []

    for (const chat of this.ctx.ownedChats) {
      if (!exceptChatIds.includes(chat.id)) {
        try {
          await chat.kickMember(user)
          blacklistedIn.push(await this.bot.telegram.getChat(chat.id))
        }
        catch (error) {
          Sentry.captureException(error)
          debug('blacklistUser:kickMember', error)
        }
      }
    }

    await Blocked.create({
      targetId: String(user.id),
      type: 'user',
    })

    return blacklistedIn
  }

  /**
   * Remove user by id from blacklist
   * @param {TelegramUser} user
   */
  async whitelistUser(user) {
    debug('whitelistUser', user.id)

    for (const chat of this.ctx.ownedChats) {
      try {
        await chat.unbanMember(user)
      }
      catch (error) {
        Sentry.captureException(error)
        debug('whitelistUser:unbanMember', { user }, error)
      }
    }

    await Blocked.destroy({
      where: {
        targetId: String(user.id),
        type: 'user',
      },
    })
  }

  /**
   * Add entity with url to blacklist
   * @see https://core.telegram.org/bots/api#messageentity
   * @param {MessageEntity} entity
   */
  async blacklistEntity(entity) {
    if (entity.text_link) {
      return Blocked.create({
        targetId: entity.url,
        type: 'url',
      })
    }

    // TODO: return undefined?
    return undefined
  }

  /**
   *
   * @param {'user'|'url'} type
   * @param {string} target
   */
  async hasInBlacklist(type, targetId) {
    try {
      const result = await Blocked.findOne({
        where: { type, targetId: String(targetId) },
      })

      return !!result
    }
    catch (error) {
      Sentry.captureException(error)
      return false
    }
  }

  /**
   * Delete messages of user in all owned chats
   * @see https://core.telegram.org/bots/api#user
   * @param {TelegramUser} user
   * @param {{ chat: Chat, limit: number }} $param1
   */
  async dropMessagesOf(user, { chat, limit = 10 } = {}) { // eslint-disable-line no-magic-numbers
    debug('dropMessagesOf', user.id)
    const where = chat
      ? { authorId: String(user.id), chatId: String(chat.id) }
      : { authorId: String(user.id) }
    const allMessages = await Message.findAll({ where, limit })

    if (allMessages.length !== 0) {
      for (const { authorId, chatId, messageId } of allMessages) {
        try {
          await this.bot.telegram.deleteMessage(chatId, messageId)
        }
        catch (error) {
          Sentry.captureException(error)
          debug('dropMessagesOf::telegram.deleteMessage', { authorId, chatId, messageId }, 'failed', error)
        }
      }
    }

    Message.destroy({ where })
      .catch((error) => debug('dropMessagesOf::Message.destroy', where, error))
  }
}

module.exports = {
  Hammer,
}
