const debug = require('debug')('rubot:lib:chat')
const { TelegramGroup } = require('./telegram-group')


class Chat extends TelegramGroup {
}

module.exports = { Chat }
