const debug = require('debug')('rubot:lib:channel')
const text = require('../text')
const { TelegramGroup } = require('./telegram-group')


class Channel extends TelegramGroup {
  /**
   * User banned with message
   */
  notifyBan({ reason, chats, moder, banned }, extra) {
    debug('notifyBan', reason, chats, moder.id, banned.id)
    this.sendMessage(
      text.spamHammer.userBannedWithReason({
        reason, chats, moder, banned,
      }),
      extra,
    )
  }

  /**
   * User unspammed
   */
  notifyUnspam({ chats, moder, spammer }) {
    debug('notifyUnspam', chats, moder.id, spammer.id)
    this.sendMessage(text.spamHammer.userUnspammed({
      chats, moder, spammer,
    }))
  }

  /**
   * Spammer {banned} automatically banned in {chat}
   */
  notifySpammerAutoban({ chat, banned }, extra) {
    debug('notifySpammerAutoban', chat.id, banned.id)
    this.sendMessage(
      text.spamHammer.spammerAutobanned({ chat, banned }),
      extra,
    )
  }
}

module.exports = { Channel }
