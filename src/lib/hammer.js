const debug = require('debug')('rubot:lib:hammer')
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
   */
  async blacklistUser(user) {
    debug('blacklistUser', user.id)
    for (const chat of this.ctx.ownedChats) {
      try {
        await chat.kickMember(user)
      }
      catch (error) {
        debug('kickMember', error)
      }
    }

    await Blocked.create({
      targetId: String(user.id),
      type: 'user',
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
      return false
    }
  }

  /**
   * Delete messages of user in all owned chats
   * @see https://core.telegram.org/bots/api#user
   * @param {TelegramUser} user
   */
  async dropMessagesOf(user, limit = 10) { // eslint-disable-line no-magic-numbers
    debug('dropMessagesOf', user.id)
    const allMessages = await Message.findAll({
      where: { authorId: user.id },
      limit,
    })

    if (allMessages.length !== 0) {
      for (const { authorId, chatId, messageId } of allMessages) {
        try {
          await this.bot.telegram.deleteMessage(chatId, messageId)
        }
        catch (error) {
          debug('dropMessagesOf', { authorId, chatId, messageId }, 'failed', error)
        }
      }
    }
  }
}

module.exports = {
  Hammer,
}
