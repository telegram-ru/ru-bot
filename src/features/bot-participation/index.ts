import { allowWhiteListChat } from '../../middlewares/allowed-chat';
// const text = require('../../text')
import { keyboardUnspamUser } from '../spam-hammer/keyboards'; // TODO(ssova): remove outfeature import

/**
 * Executes if bot exist in joined users
 * Add group to db, fetch admins and bot rights
 */
async function onNewChatMembers(ctx) {
  const {
    new_chat_members: newMembers,
    chat,
    // from,
  } = ctx.update.message;

  console.log('onNewChatMembers()', newMembers);

  /*
  const ruBotAdded = newMembers.some(member => member.id === ctx.botInfo.id)

  if (ruBotAdded && (chat.type === 'supergroup' || chat.type === 'group')) {
    ctx.telegram.sendMessage(chat.id, text.botParticipation.botAddedToChat({ chat, adder: from }))
  }
  */

  const hammer = ctx.getHammer();
  const chatInstance = ctx.getChat(chat.id);

  for (const member of newMembers) {
    const isSpammer = await hammer.hasInBlacklist('user', member.id);

    if (isSpammer) {
      await hammer.dropMessagesOf(member);
      await ctx.privateChannel.notifySpammerAutoban(
        { chat, banned: member },
        keyboardUnspamUser({ banned: member }).extra(),
      );
      console.log(
        'onNewChatMembers():kickMember',
        await chatInstance.kickMember(member),
      );
    }
  }
}

function featureBotParticipation(bot) {
  bot.on('new_chat_members', allowWhiteListChat, onNewChatMembers);
}

export { featureBotParticipation };
