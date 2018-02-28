const debug = require('debug')('rubot:features:botparticipation:index')
const { allowWhiteListChat } = require('../../middlewares/allowed-chat')
// const text = require('../../text')
const { keyboardUnspamUser } = require('../spam-hammer/keyboards') // TODO(ssova): remove outfeature import

/**
 * Executes if the bot exists in joined users
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

  const hammer = ctx.newHammer()
  const chatInstance = ctx.getChat(chat.id)

  for (const member of newMembers) {
    const isSpammer = await hammer.hasInBlacklist('user', member.id)

    if (isSpammer) {
      await hammer.dropMessagesOf(member)
      await ctx.privateChannel.notifySpammerAutoban(
        { chat, banned: member },
        keyboardUnspamUser({ banned: member }).extra(),
      )
      debug('onNewChatMembers():kickMember', await chatInstance.kickMember(member))
    }
  }
}

/**
 * Check each sticker and check options
 * - Remove sticker
 * - Restrict user to send stickers
 */
async function handleStickerSend({ message, chat, from, getChat, deleteMessage }) {
  debug('handleStickerSend', message)
  const chatInstance = getChat(chat.id)
  const stickersOptions = chatInstance.getStickersOptions()

  if (stickersOptions.remove && !stickersOptions.allowed.includes(message.sticker.set_name)) {
    debug('handleStickerSend:removeSticker', await deleteMessage())
  }

  if (stickersOptions.restrict) {
    debug('handleStickerSend:restrictUser')
    await chatInstance.restrictMember(from, {
      // TODO(ssova): get member settings and merge it
      can_send_messages: true,
      can_send_media_messages: true,
      can_add_web_page_previews: true,
      can_send_other_messages: false,
    })
  }
}


function featureBotParticipation(bot) {
  bot.on('new_chat_members', allowWhiteListChat, onNewChatMembers)
  bot.on('sticker', allowWhiteListChat, handleStickerSend)
}

module.exports = featureBotParticipation
