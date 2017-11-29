const debug = require('debug')('rubot:features:spam-hammer:index')
const { Extra } = require('telegraf')
const text = require('../../text')
const { allowWhiteListChat } = require('../../middlewares/allowed-chat')
const { adminRequiredSilenced } = require('../../middlewares/admin-required')
const { Message } = require('../../models')


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
async function handleSpamCommand({
  message, from, update, match, reply, privateChannel, getHammer,
}) {
  debug('handleSpamCommand')
  const [, reason] = match

  if (update.message.reply_to_message) {
    const replyMessage = update.message.reply_to_message
    const spammer = replyMessage.from

    try {
      const hammer = getHammer()

      await hammer.blacklistUser(spammer)
      await hammer.dropMessagesOf(spammer)

      await privateChannel.notifyBan({
        banned: spammer,
        chat: replyMessage.chat,
        moder: from,
        reason: `${text.spamHammer.shortSpamReason()} ${reason || ''}`,
      })

      // TODO: search all entities
    }
    catch (error) {
      debug('handleSpamCommand failed', error)
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
