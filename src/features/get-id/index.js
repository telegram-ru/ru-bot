const debug = require('debug')('rubot:features:get-id:index')
const { Extra } = require('telegraf')


/**
 * Send greetings only in private chat
 */
function onIdCommand({ reply, chat, message }) {
  debug('on !id', chat)
  reply(chat.id, Extra.inReplyTo(message.message_id))
}


module.exports = function featureGetId(bot) {
  bot.hears(/^!id$/, onIdCommand)
}
