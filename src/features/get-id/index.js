const debug = require('debug')('rubot:features:get-id:index')
const { Extra } = require('telegraf')


async function onIdCommand({ reply, chat, from, message }) {
  debug('on !id', chat)
  try {
    return await reply(`Chat: ${chat.id}\nUser: ${from.id}`, Extra.inReplyTo(message.message_id))
  }
  catch (error) {
    // Message dropped?
    return undefined
  }
}


module.exports = function featureGetId(bot) {
  bot.hears(/^!id$/, onIdCommand)
}
