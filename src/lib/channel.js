const debug = require('debug')('rubot:lib:channel')
const text = require('../text')
const { TelegramGroup } = require('./telegram-group')


class Channel extends TelegramGroup {
  /**
   * User banned with message
   */
  notifyBan({ reason, chats, moder, banned }) {
    debug('notifyBan', reason, chats.id, moder.id, banned.id)
    this.sendMessage(text.spamHammer.userBannedWithReason({
      reason, chats, moder, banned,
    }))
  }

  /**
   * Spammer {banned} automatically banned in {chat}
   */
  notifySpammerAutoban({ chat, banned }) {
    debug('notifySpammerAutoban', chat.id, banned.id)

    this.sendMessage(text.spamHammer.spammerAutobanned({ chat, banned }))
  }
}

module.exports = { Channel }
