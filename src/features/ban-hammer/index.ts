import Extra from 'telegraf/extra';
import * as text from '../../text';
import { allowWhiteListChat } from '../../middlewares/allowed-chat';
import { adminRequiredSilenced } from '../../middlewares/admin-required';
import { Bot, BotContext } from '../../types';

async function handleBanCommand(ctx: BotContext) {
  const {
    from,
    privateChannel,
    deleteMessage,
    message,
    match,
    reply,
    getChat,
    chat,
  } = ctx;
  console.log('handleBanCommand', message, match);
  const [, , reason] = match;
  const replyMessage = message.reply_to_message;

  if (replyMessage) {
    const fluder = replyMessage.from;
    const chatInstance = getChat(chat.id);

    await chatInstance.kickMember(fluder);
    await privateChannel.notifyKickBan({
      fluder,
      chat: reason && reason.trim(),
      moder: from,
    });
    await deleteMessage();
  } else {
    reply(
      text.common.commandShouldBeReplied(text.commands.ban()),
      Extra.inReplyTo(message.message_id),
    );
  }
}

export function featureBanHammer(bot: Bot) {
  bot.hears(
    new RegExp(`^(${text.commands.ban()}|!ban)( .*)?`),
    allowWhiteListChat,
    adminRequiredSilenced,
    handleBanCommand,
  );
}
