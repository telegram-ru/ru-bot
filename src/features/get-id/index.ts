import * as Sentry from '@sentry/node';
import { Extra } from 'telegraf';
import { Bot, BotContext } from '../../types';

async function onIdCommand(ctx: BotContext) {
  const { reply, chat, from, message } = ctx;
  console.log('on !id', chat);
  try {
    return await reply(
      `Chat: ${chat.id}\nUser: ${from.id}`,
      // @ts-ignore
      Extra.inReplyTo(message.message_id),
    );
  } catch (error) {
    // Message dropped?
    Sentry.captureException(error);
    return undefined;
  }
}

export function featureGetId(bot: Bot) {
  bot.hears(/^!id$/, onIdCommand);
}
