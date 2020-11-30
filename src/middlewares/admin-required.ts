import { Extra } from 'telegraf';
import * as text from '../text';

async function adminRequired(ctx, next) {
  const { message, reply, chat, getChat, from } = ctx;
  if (chat && chat.type !== 'private') {
    const chatApi = getChat(chat.id);

    if (await chatApi.isAdmin(from)) {
      return next();
    }

    console.log('Access denied', message, chat, from);
    return reply(text.notif.adminOnly(), Extra.inReplyTo(message.message_id));
  }

  return reply(text.notif.groupOnly(), Extra.inReplyTo(message.message_id));
}

async function adminRequiredSilenced(ctx, next) {
  const { chat, getChat, from } = ctx;
  if (chat && chat.type !== 'private') {
    const chatApi = getChat(chat.id);

    if (await chatApi.isAdmin(from)) {
      console.log('adminRequiredSilenced', chat.id, from.id, true);
      return next();
    }
  }
  console.log('adminRequiredSilenced', chat.id, from.id, false);
  return null;
}

export { adminRequired, adminRequiredSilenced };
