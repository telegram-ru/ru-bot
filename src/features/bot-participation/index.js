const debug = require('debug')('rubot:features:botparticipation:index')
const { allowWhiteListChat } = require('../../middlewares/allowed-chat')
const { adminRequiredSilenced } = require('../../middlewares/admin-required')

/**
* Executes if bot exist in joined users
* Add group to db, fetch admins and bot rights
*/

async function checkMember(member, hammer, ownedChats) {
  const isSpammer = await hammer.hasInBlacklist('user', String(member.id))

  if (isSpammer) {
    try {
      await hammer.dropMessagesOf(member)
      ownedChats.forEach(async (chat) => {
        await chat.kickMember(member)
      })
    }
    catch (error) {
      debug('onNewChatMembers test failed', error)
    }
  }
}

function onNewChatMembers({
  getHammer, update, ownedChats,
}) {
  const {
    new_chat_members: newMembers,
  } = update.message
  debug('onNewChatMembers()', newMembers)

  // TODO: check if user in our spam list

  const hammer = getHammer()
  newMembers.forEach(async (member) => {
    await checkMember(member, hammer, ownedChats)
  })
}

function featureBotParticipation(bot) {
  bot.on(
    'new_chat_members',
    allowWhiteListChat, adminRequiredSilenced, onNewChatMembers
  )
}

module.exports = featureBotParticipation
