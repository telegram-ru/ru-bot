import Extra from 'telegraf/extra';
import * as text from '../../text';
import { allowWhiteListChat } from '../../middlewares/allowed-chat';
import { adminRequiredSilenced } from '../../middlewares/admin-required';

async function handleBanCommand({
  from,
  privateChannel,
  deleteMessage,
  message,
  match,
  reply,
  getChat,
  chat,
}) {
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

export function featureBanHammer(bot) {
  bot.hears(
    new RegExp(`^(${text.commands.ban()}|!ban)( .*)?`),
    allowWhiteListChat,
    adminRequiredSilenced,
    handleBanCommand,
  );
}
