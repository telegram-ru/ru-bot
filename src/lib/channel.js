const debug = require('debug')('rubot:lib:channel')
const text = require('../text')
const { TelegramGroup } = require('./telegram-group')


class Channel extends TelegramGroup {
  /**
   * User banned with message
   */
  notifyBan({ reason, chat, moder, banned }) {
    debug('notifyBan', reason, chat.id, moder.id, banned.id)
    this.sendMessage(text.spamHammer.userBannedWithReason({
      reason, chat, moder, banned,
    }))
  }
}

module.exports = { Channel }
