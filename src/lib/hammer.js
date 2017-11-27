const debug = require('debug')('rubot:lib:hammer')
const { Blocked, Message } = require('../models')

/* eslint-disable class-methods-use-this, no-restricted-syntax, no-await-in-loop */

class Hammer {
  constructor(context) {
    this.bot = context.botInstance
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
      target: user.id,
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
        target: entity.url,
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
  async hasInBlacklist(type, target) {
    try {
      const result = await Blocked.findAll({
        where: { type, target },
      })

      // TODO: check what return SequelizeModel.findAll
      return !!result
    }
    catch (error) {
      return false
    }
  }

  /**
   * @see https://core.telegram.org/bots/api#user
   * @param {TelegramUser} user
   */
  async dropMessagesOf(user) {
    debug('dropMessagesOf', user.id)
    const allMessages = await Message.findAll({
      where: { authorId: user.id },
    })

    if (allMessages.length !== 0) {
      for (const { authorId, chatId, messageId } of allMessages) {
        try {
          await this.bot.deleteMessage(chatId, messageId)
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
