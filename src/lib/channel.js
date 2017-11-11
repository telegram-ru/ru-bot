const debug = require('debug')('rubot:lib:channel')
const text = require('../text')
const { TelegramGroup } = require('./telegram-group')


class Channel extends TelegramGroup {
  notifyBan({ reason, chat, moder, banned }) {
    this.sendMessage(text.spamHammer.userBannedWithReason({
      reason, chat, moder, banned,
    }))
  }
}

module.exports = { Channel }
