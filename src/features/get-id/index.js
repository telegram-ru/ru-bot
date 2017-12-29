const debug = require('debug')('rubot:features:get-id:index')
const { Extra } = require('telegraf')


function onIdCommand({ reply, chat, from, message }) {
  debug('on !id', chat)
  reply(`Chat: ${chat.id}\nUser: ${from.id}`, Extra.inReplyTo(message.message_id))
}


module.exports = function featureGetId(bot) {
  bot.hears(/^!id$/, onIdCommand)
}
