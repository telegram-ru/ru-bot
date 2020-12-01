import * as Sentry from '@sentry/node';
import { Extra } from 'telegraf';

async function onIdCommand({ reply, chat, from, message }) {
  console.log('on !id', chat);
  try {
    return await reply(
      `Chat: ${chat.id}\nUser: ${from.id}`,
      Extra.inReplyTo(message.message_id),
    );
  } catch (error) {
    // Message dropped?
    Sentry.captureException(error);
    return undefined;
  }
}

export function featureGetId(bot) {
  bot.hears(/^!id$/, onIdCommand);
}
