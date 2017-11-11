const debug = require('debug')('rubot:lib:channel')
const { TelegramGroup } = require('./telegram-group')


class Channel extends TelegramGroup {
}

module.exports = { Channel }
