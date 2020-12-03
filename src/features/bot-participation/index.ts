import { allowWhiteListChat } from '../../middlewares/allowed-chat';
import { keyboardUnspamUser } from '../spam-hammer/keyboards';
import { Bot, BotContext } from '../../types'; // TODO(ssova): remove outfeature import

/**
 * Executes if bot exist in joined users
 * Add group to db, fetch admins and bot rights
 */
async function onNewChatMembers(ctx: BotContext) {
  const {
    new_chat_members: newMembers,
    chat,
    // from,
  } = ctx.update.message;

  console.log('onNewChatMembers()', newMembers);

  const hammer = ctx.getHammer();
  const chatInstance = ctx.getChat(chat.id);

  newMembers.forEach(async (member) => {
    const isSpammer = await hammer.hasInBlacklist('user', member.id);

    if (isSpammer) {
      await hammer.dropMessagesOf(member);
      await ctx.privateChannel.notifySpammerAutoban(
        { chat, banned: member },
        keyboardUnspamUser(member).extra(),
      );
      console.log(
        'onNewChatMembers():kickMember',
        await chatInstance.kickMember(member),
      );
    }
  });
}

function featureBotParticipation(bot: Bot): void {
  bot.on('new_chat_members', allowWhiteListChat, onNewChatMembers);
}

export { featureBotParticipation };
