const debug = require('debug')('rubot:features:bot-participation:index')
const text = require('../../text')

/**
 * Executes if bot exist in joined users
 * Add group to db, fetch admins and bot rights
 */
function onNewChatMembers(ctx) {
  const { new_chat_members: newMembers, chat, from } = ctx.update.message
  debug('onNewChatMembers()', newMembers)

  const ruBotAdded = newMembers.some(member => member.id === ctx.bot.id)

  if (ruBotAdded && (chat.type === 'supergroup' || chat.type === 'group')) {
    ctx.telegram.sendMessage(chat.id, text.botParticipation.botAddedToChat({ chat, adder: from }))
  }
}


function featureBotParticipation(bot) {
  bot.on('new_chat_members', onNewChatMembers)
}

module.exports = featureBotParticipation
