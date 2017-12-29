const debug = require('debug')('rubot:lib:channel')
const text = require('../text')
const { TelegramGroup } = require('./telegram-group')


class Channel extends TelegramGroup {
  /**
   * User banned with message
   */
  notifyBan({ reason, chats, moder, banned }, extra) {
    debug('notifyBan', reason, chats, moder.id, banned.id)
    return this.sendMessage(
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
    return this.sendMessage(text.spamHammer.userUnspammed({
      chats, moder, spammer,
    }))
  }

  /**
   * Spammer {banned} automatically banned in {chat}
   */
  notifySpammerAutoban({ chat, banned }, extra) {
    debug('notifySpammerAutoban', chat.id, banned.id)
    return this.sendMessage(
      text.spamHammer.spammerAutobanned({ chat, banned }),
      extra,
    )
  }

  forwardMessage({ chat, message }) {
    debug('forwardMessage', { chat, message })
    return this.telegram.forwardMessage(this.id, chat.id, message.message_id)
  }

  notifyReadonly({ fluder, chat, moder, reason }, extra) {
    debug('notifyReadonly', fluder.id, chat.id)
    return this.sendMessage(text.readonlyMode.fluderReadonlyIn({
      fluder, chat, moder, reason,
    }), extra)
  }
}

module.exports = { Channel }
