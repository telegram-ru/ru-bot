const debug = require('debug')('rubot:features:spam-hammer:index')
const { Extra } = require('telegraf')
const text = require('../../text')
const { allowWhiteListChat } = require('../../middlewares/allowed-chat')
const { adminRequiredSilenced } = require('../../middlewares/admin-required')
const { Message, sequelize } = require('../../models')


function handleEachMessage({ message, from, chat }, next) {
  debug(`handleEachMessage(messageId: ${message.message_id}, fromId: ${from.id}, chatId: ${chat.id}`)
  if (chat.type !== 'private') {
    Message.create({
      messageId: message.message_id,
      chatId: chat.id,
      authorId: from.id,
      date: message.date,
    }).catch((error) => {
      debug('message create', error)
    })
  }

  next()
}

/* eslint-disable no-restricted-syntax, no-await-in-loop */
function handleSpamCommand({
  message, from, chat, update, match, reply, privateChannel, getChat,
}) {
  const [, reason] = match
  if (update.message.reply_to_message) {
    const replyMessage = update.message.reply_to_message
    const spammer = replyMessage.from
    const authorId = String(spammer.id)
    const chatId = String(chat.id)

    try {
      sequelize.transaction(async (transaction) => {
        const list = await Message.findAll({ transaction, where: { authorId, chatId } })

        await list.map(msg => getChat(chat.id).deleteMessage(msg.messageId).catch(debug))
        await getChat(chat.id).deleteMessage(message.message_id).catch(debug)

        await Message.destroy({
          transaction, where: { authorId, chatId },
        })

        privateChannel.notifyBan({
          banned: spammer,
          chat: replyMessage.chat,
          moder: from,
          reason: `${text.spamHammer.shortSpamReason()}${reason || ''}`,
        })
        // TODO: add user to database
        // TODO: restrict user in this chat and delete his messages
        // TODO: search all entities
      })

      // TODO: delete messages and restrict user in all chats
    }
    catch (error) {
      debug('Sequelize transaction', error)
    }
  }
  else {
    reply(text.spamHammer.spamCommandShouldBeReplied(), Extra.inReplyTo(message.message_id))
  }
}
/* eslint-enable no-restricted-syntax */


module.exports = function featureSpamHammer(bot) {
  bot.on(
    'message',
    allowWhiteListChat, handleEachMessage
  )
  bot.hears(
    new RegExp(`^${text.commands.spam()}( .*)?`),
    allowWhiteListChat, adminRequiredSilenced, handleSpamCommand
  )
}
