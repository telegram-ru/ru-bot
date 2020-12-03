import * as Sentry from '@sentry/node';

import { Telegraf } from 'telegraf';
import { Blocked, Message } from '../models';

class Hammer<
  Bot extends Telegraf<any>,
  BotContext extends { ownedChats: any }
> {
  bot: Bot;

  ctx: BotContext;

  constructor(context) {
    this.bot = context.rootInstance;
    this.ctx = context;
  }

  /**
   * Add user by id to blacklist
   * @see https://core.telegram.org/bots/api#user
   * @param {TelegramUser} user
   * @param {number[]} exceptChatIds
   */
  async blacklistUser(user, exceptChatIds = []) {
    console.log('blacklistUser', user.id);
    for (const chat of this.ctx.ownedChats) {
      if (!exceptChatIds.includes(chat.id)) {
        try {
          await chat.kickMember(user);
        } catch (error) {
          Sentry.captureException(error);
          console.log('blacklistUser:kickMember', error);
        }
      }
    }

    await Blocked.create({ targetId: String(user.id), type: 'user' });
  }

  /**
   * Remove user by id from blacklist
   * @param {TelegramUser} user
   */
  async whitelistUser(user) {
    console.log('whitelistUser', user.id);

    for (const chat of this.ctx.ownedChats) {
      try {
        await chat.unbanMember(user);
      } catch (error) {
        Sentry.captureException(error);
        console.log('whitelistUser:unbanMember', { user }, error);
      }
    }

    await Blocked.destroy({
      where: { targetId: String(user.id), type: 'user' },
    });
  }

  /**
   *
   * @param {'user'|'url'} type
   * @param {string} target
   */
  async hasInBlacklist(type, targetId) {
    try {
      const result = await Blocked.findOne({
        where: { type, targetId: String(targetId) },
      });

      return !!result;
    } catch (error) {
      Sentry.captureException(error);
      return false;
    }
  }

  /**
   * Delete messages of user in all owned chats
   * @see https://core.telegram.org/bots/api#user
   * @param {TelegramUser} user
   * @param {{ chat: Chat, limit: number }} $param1
   */
  async dropMessagesOf(
    user,
    { chat, limit = 10 }: { chat?: any; limit?: number } = {},
  ) {
    // eslint-disable-line no-magic-numbers
    console.log('dropMessagesOf', user.id);
    const where = chat
      ? { authorId: String(user.id), chatId: String(chat.id) }
      : { authorId: String(user.id) };
    const allMessages = await Message.findAll({ where, limit });

    if (allMessages.length !== 0) {
      for (const { authorId, chatId, messageId } of allMessages) {
        try {
          await this.bot.telegram.deleteMessage(chatId, messageId);
        } catch (error) {
          Sentry.captureException(error);
          console.log(
            'dropMessagesOf::telegram.deleteMessage',
            { authorId, chatId, messageId },
            'failed',
            error,
          );
        }
      }
    }

    Message.destroy({ where }).catch((error) =>
      console.log('dropMessagesOf::Message.destroy', where, error),
    );
  }
}

export { Hammer };
