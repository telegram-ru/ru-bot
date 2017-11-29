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

  /**
   * Spammer {banned} automatically banned in {chat}
   */
  notifySpammerAutoban({ chat, banned }) {
    debug('notifySpammerAutoban', chat.id, banned.id)

    this.sendMessage(text.spamHammer.spammerAutobanned({ chat, banned }))
  }
}

module.exports = { Channel }
