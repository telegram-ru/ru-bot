const debug = require('debug')('rubot:features:ban-hammer:index')
const Extra = require('telegraf/extra')
const text = require('../../text')
const { allowWhiteListChat } = require('../../middlewares/allowed-chat')
const { adminRequiredSilenced } = require('../../middlewares/admin-required')


async function handleBanCommand({
  from, privateChannel, deleteMessage, message, match, reply, getChat, chat,
}) {
  debug('handleBanCommand', message, match)
  const [,, reason] = match
  const replyMessage = message.reply_to_message

  if (replyMessage) {
    const fluder = replyMessage.from
    const chatInstance = getChat(chat.id)

    await chatInstance.kickMember(fluder)
    await privateChannel.notifyKickBan({
      fluder,
      chat: reason && reason.trim(),
      moder: from,
    })
    await deleteMessage()
  }
  else {
    reply(
      text.common.commandShouldBeReplied(text.commands.ban()),
      Extra.inReplyTo(message.message_id)
    )
  }
}

module.exports = function featureBanHammer(bot) {
  bot.hears(
    new RegExp(`^(${text.commands.ban()}|!ban)( .*)?`),
    allowWhiteListChat, adminRequiredSilenced, handleBanCommand,
  )
}
