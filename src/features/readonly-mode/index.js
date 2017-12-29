const debug = require('debug')('rubot:features:readonly-mode:index')
const Extra = require('telegraf/extra')
const text = require('../../text')
const { allowWhiteListChat } = require('../../middlewares/allowed-chat')
const { adminRequiredSilenced } = require('../../middlewares/admin-required')


/** 1 day in seconds */
const RO_TIME = 86400
const SECOND = 1000

async function handleReadonlyCommand({
  from, privateChannel, deleteMessage, message, match, reply, getChat, chat,
}) {
  debug('handleReadonlyCommand', message, match)
  const [,, reason] = match

  if (message.reply_to_message) {
    const replyMessage = message.reply_to_message
    const fluder = replyMessage.from
    const chatInstance = getChat(chat.id)

    await chatInstance.restrictMember(fluder, {
      until_date: Math.floor((Date.now() / SECOND) + RO_TIME),
    })
    await privateChannel.notifyReadonly({
      fluder,
      chat,
      reason: reason && reason.trim(),
      moder: from,
    })
    await deleteMessage()
  }
  else {
    reply(
      text.common.commandShouldBeReplied(text.commands.readonly()),
      Extra.inReplyTo(message.message_id)
    )
  }
}

module.exports = function featureReadonlyMode(bot) {
  bot.hears(
    new RegExp(`^(${text.commands.readonly()}|!ro)( .*)?`),
    allowWhiteListChat, adminRequiredSilenced, handleReadonlyCommand,
  )
}
