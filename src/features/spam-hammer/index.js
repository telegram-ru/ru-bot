const debug = require('debug')('rubot:features:spam-hammer:index')
const text = require('../../text')
const { allowWhiteListChat } = require('../../middlewares/allowed-chat')
const { message } = require('../../models')


function handleEachMessage({ message: msg, from, chat }) {
  debug(`handleEachMessage(messageId: ${msg.id}, fromId: ${from.id}, chatId: ${chat.id}`)
  if (chat.type !== 'private') {
    message.create({
      messageId: msg.message_id,
      chatId: chat.id,
      authorId: from.id,
    })
  }
}


module.exports = function featureSpamHammer(bot) {
  bot.on('message', allowWhiteListChat, handleEachMessage)
}
