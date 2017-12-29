const debug = require('debug')('rubot:features:botparticipation:index')
const { allowWhiteListChat } = require('../../middlewares/allowed-chat')
// const text = require('../../text')

/**
 * Executes if bot exist in joined users
 * Add group to db, fetch admins and bot rights
 */
async function onNewChatMembers(ctx) {
  const {
    new_chat_members: newMembers,
    chat,
    // from,
  } = ctx.update.message

  debug('onNewChatMembers()', newMembers)

  /*
  const ruBotAdded = newMembers.some(member => member.id === ctx.botInfo.id)

  if (ruBotAdded && (chat.type === 'supergroup' || chat.type === 'group')) {
    ctx.telegram.sendMessage(chat.id, text.botParticipation.botAddedToChat({ chat, adder: from }))
  }
  */

  const hammer = ctx.getHammer()

  for (const member of newMembers) {
    const isSpammer = await hammer.hasInBlacklist('user', member.id)

    if (isSpammer) {
      const chatInstance = ctx.getChat(chat.id)

      await chatInstance.kickMember(member)
      await hammer.dropMessagesOf(member)
      ctx.privateChannel.notifySpammerAutoban({ chat, banned: member })
    }
  }
}


function featureBotParticipation(bot) {
  bot.on('new_chat_members', allowWhiteListChat, onNewChatMembers)
}

module.exports = featureBotParticipation
