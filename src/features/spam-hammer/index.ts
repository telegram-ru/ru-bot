import * as Sentry from '@sentry/node';
import { Extra } from 'telegraf';
import * as text from '../../text';
import { allowWhiteListChat } from '../../middlewares/allowed-chat';
import { adminRequiredSilenced } from '../../middlewares/admin-required';
import { Message } from '../../models';
import { installKeyboardActions, keyboardUnspamUser } from './keyboards';
import { Bot, BotContext } from '../../types';

async function handleEachMessage(ctx: BotContext, next) {
  const {
    message,
    from: userFrom,
    chat,
    getHammer,
    getChat,
    privateChannel,
  } = ctx;
  console.log(
    `handleEachMessage(messageId: ${message.message_id}, fromId: ${userFrom.id}, chatId: ${chat.id}`,
  );

  if (chat.type !== 'private') {
    Message.create({
      messageId: message.message_id,
      chatId: chat.id,
      authorId: userFrom.id,
      date: message.date,
    }).catch((error) => {
      console.log('handleEachMessage:Message.create ERROR', error);
    });

    next();

    const hammer = getHammer();
    const isSpammer = await hammer.hasInBlacklist('user', userFrom.id);

    if (isSpammer) {
      const chatInstance = getChat(chat.id);

      await hammer.dropMessagesOf(userFrom);
      await privateChannel.notifySpammerAutoban(
        { chat, banned: userFrom },
        keyboardUnspamUser(userFrom).extra(),
      );
      console.log(
        'handleEachMessage():kickMember',
        await chatInstance.kickMember(userFrom),
      );
    }
  } else {
    next();
  }
}

/* eslint-disable no-restricted-syntax, no-await-in-loop */
async function handleSpamCommand(ctx: BotContext) {
  const {
    message,
    from,
    update,
    chat,
    match,
    reply,
    privateChannel,
    getHammer,
    deleteMessage,
    getChat,
  } = ctx;
  console.log('handleSpamCommand');
  const [, rawReason] = match;
  const reason = `${text.spamHammer.shortSpamReason()} ${rawReason || ''}`;

  if (update.message.reply_to_message) {
    const replyMessage = update.message.reply_to_message;
    const spammer = replyMessage.from;

    try {
      const hammer = getHammer();
      const currentChat = getChat(chat.id);

      // Ban in current chat #66.2
      await currentChat.kickMember(spammer);
      try {
        // Forward spam message #66.3
        await privateChannel.forwardMessage({
          chat,
          message: message.reply_to_message,
        });
      } catch (error) {
        Sentry.captureException(error);
        console.log(
          'handleSpamCommand: cant forward message',
          message.reply_to_message,
        );
      }
      // Delete spam message from current chat #66.4
      await hammer.dropMessagesOf(spammer, { chat });

      // Send "progress" to log channel #66.5
      const logMessage = await privateChannel.notifyBanInProgress({
        reason,
        banned: spammer,
      });

      // Delete !spam message #66.6
      await deleteMessage();

      // Ban user in another controlled chats #66.7
      await hammer.blacklistUser(spammer, [chat.id]);

      try {
        // Delete messages in all another chats #66.8
        await hammer.dropMessagesOf(spammer, { limit: 100 });
      } catch (error) {
        Sentry.captureException(error);
        console.log('handleSpamCommand dropMessagesOfSpammer failed', error);
      }

      await privateChannel.editBanMessage(
        logMessage.message_id,
        {
          originChat: chat,
          banned: spammer,
          moder: from,
          reason,
        },
        keyboardUnspamUser(spammer).extra(),
      );
      /** @see https://core.telegram.org/bots/api#forwardmessage */

      // TODO: search all entities in message (urls)
    } catch (error) {
      Sentry.captureException(error);
      console.log('handleSpamCommand ERROR', error);
    }
  } else {
    reply(
      text.common.commandShouldBeReplied(text.commands.spam()),
      // @ts-ignore
      Extra.inReplyTo(message.message_id),
    );
  }
}
/* eslint-enable no-restricted-syntax */

export function featureSpamHammer(bot: Bot) {
  bot.on('message', allowWhiteListChat, handleEachMessage);
  bot.hears(
    new RegExp(`^${text.commands.spam()}( .*)?`),
    allowWhiteListChat,
    adminRequiredSilenced,
    handleSpamCommand,
  );

  installKeyboardActions(bot);
}
