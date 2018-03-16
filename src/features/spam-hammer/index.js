const debug = require('debug')('rubot:features:spam-hammer:index')
const { Extra } = require('telegraf')
const text = require('../../text')
const { allowWhiteListChat } = require('../../middlewares/allowed-chat')
const { adminRequiredSilenced } = require('../../middlewares/admin-required')
const { Message } = require('../../models')
const { installKeyboardActions, keyboardUnspamUser } = require('./keyboards')


async function handleEachMessage({
  message, from, chat, getHammer, getChat, privateChannel,
}, next) {
  debug(`handleEachMessage(messageId: ${message.message_id}, fromId: ${from.id}, chatId: ${chat.id}`)

  if (chat.type !== 'private') {
    Message.create({
      messageId: message.message_id,
      chatId: chat.id,
      authorId: from.id,
      date: message.date,
    }).catch((error) => {
      debug('handleEachMessage:Message.create ERROR', error)
    })

    next()

    const hammer = getHammer()
    const isSpammer = await hammer.hasInBlacklist('user', from.id)

    if (isSpammer) {
      const chatInstance = getChat(chat.id)

      await hammer.dropMessagesOf(from)
      await privateChannel.notifySpammerAutoban(
        { chat, banned: from },
        keyboardUnspamUser({ banned: from }).extra(),
      )
      debug('handleEachMessage():kickMember', await chatInstance.kickMember(from))
    }
  }
  else {
    next()
  }
}

/* eslint-disable no-restricted-syntax, no-await-in-loop */
async function handleSpamCommand({
  message, from, update, chat, match, reply, privateChannel, getHammer, deleteMessage,
}) {
  debug('handleSpamCommand')
  const [, reason] = match

  if (update.message.reply_to_message) {
    const replyMessage = update.message.reply_to_message
    const spammer = replyMessage.from

    try {
      const hammer = getHammer()

      await deleteMessage()
      const blacklistedList = await hammer.blacklistUser(spammer)

      await privateChannel.forwardMessage({ chat, message: message.reply_to_message })
      await privateChannel.notifyBan({
        originChat: chat,
        banned: spammer,
        chats: blacklistedList.filter((blacklisted) => blacklisted.id !== chat.id),
        moder: from,
        reason: `${text.spamHammer.shortSpamReason()} ${reason || ''}`,
      }, keyboardUnspamUser({ banned: spammer }).extra())
      /** @see https://core.telegram.org/bots/api#forwardmessage */

      await hammer.dropMessagesOf(spammer)

      // TODO: search all entities in message (urls)
    }
    catch (error) {
      debug('handleSpamCommand ERROR', error)
    }
  }
  else {
    reply(
      text.common.commandShouldBeReplied(text.commands.spam()),
      Extra.inReplyTo(message.message_id)
    )
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

  installKeyboardActions(bot)
}
