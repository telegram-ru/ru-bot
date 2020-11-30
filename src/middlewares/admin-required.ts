import { Extra } from 'telegraf';
import * as text from '../text';

const adminRequired = async ({ message, reply, chat, getChat, from }, next) => {
  if (chat && chat.type !== 'private') {
    const chatApi = getChat(chat.id);

    if (await chatApi.isAdmin(from)) {
      return next();
    }

    console.log('Access denied', message, chat, from);
    return reply(text.notif.adminOnly(), Extra.inReplyTo(message.message_id));
  }

  return reply(text.notif.groupOnly(), Extra.inReplyTo(message.message_id));
};

const adminRequiredSilenced = async ({ chat, getChat, from }, next) => {
  if (chat && chat.type !== 'private') {
    const chatApi = getChat(chat.id);

    if (await chatApi.isAdmin(from)) {
      console.log('adminRequiredSilenced', chat.id, from.id, true);
      return next();
    }
  }
  console.log('adminRequiredSilenced', chat.id, from.id, false);
  return null;
};

export { adminRequired, adminRequiredSilenced };
