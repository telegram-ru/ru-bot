import * as Sentry from '@sentry/node';

import { Telegraf, Telegram } from 'telegraf';
import { makeName } from './string';
import { BotContext } from './extended-context';

const TIMEOUT_ADMIN_UPDATE = 60000;

export interface AdminUser {
  id: number;
  isBot: boolean;
  fullName: string;
  username: string;
  status: string;
  raw: any;
}

/**
 * GroupBase is parent for Channel and Chat
 * with common methods to fetch admins and manage messages
 */
class TelegramGroup {
  bot: Telegraf<BotContext>;

  id: string;

  telegram: Telegram;

  admins: {
    list: Array<AdminUser>;
    nextUpdate: number;
  };

  /**
   * @param {number} chatId
   * @param {object} botInstance
   * @return {Promise<Array>}
   */
  constructor(chatId, botInstance) {
    this.id = chatId;
    this.bot = botInstance;
    this.telegram = this.bot.telegram;

    this.admins = {
      list: [],
      nextUpdate: Date.now() - TIMEOUT_ADMIN_UPDATE,
    };
  }

  isBotAdmin(): Promise<boolean> {
    return this.isAdmin(this.bot.context.botInfo);
  }

  /**
   * @return {Promise<boolean>}
   */
  async canPostMessages() {
    console.log('canPostMessages()');
    const admins = await this.getAdmins();
    const found = admins.find(
      (member) => member.id === this.bot.context.botInfo.id,
    );

    if (found) {
      return found.raw.can_post_messages;
    }

    return false;
  }

  /**
   * @param {boolean} force ignore timeout if `true`
   * @return {Promise<Array>}
   */
  async getAdmins(force = false): Promise<AdminUser[]> {
    console.log(
      `getAdmins(), nextUpdate: ${this.admins.nextUpdate}, now: ${Date.now()}`,
    );

    if (!force && this.admins.nextUpdate > Date.now()) {
      return this.admins.list;
    }

    try {
      const chatAdmins = await this.telegram.getChatAdministrators(this.id);

      this.admins.list = chatAdmins.map((member) => ({
        id: member.user.id,
        isBot: member.user.is_bot,
        // @ts-ignore
        fullName: makeName(member.user),
        username: member.user.username,
        status: member.status,
        raw: member,
      }));
      this.admins.nextUpdate = Date.now() + TIMEOUT_ADMIN_UPDATE;

      return this.admins.list;
    } catch (error) {
      Sentry.captureException(error);
      console.log('getAdmins() failed', error);
      return [];
    }
  }

  /**
   * @param {User} user
   * @return {Promise<{id, isBot, fullName, username, status, raw}>}
   */
  async isAdmin(user) {
    console.log('isAdmin(', user, ')');

    const adminList = await this.getAdmins();

    const found = adminList.find((admin) => admin.id === user.id);

    if (found) {
      return found.status === 'creator' || found.status === 'administrator';
    }

    return false;
  }

  /**
   * Delete message from current chat by message id
   * @param {number} messageId
   */
  async deleteMessage(messageId: number) {
    console.log(`deleteMessage(${messageId})`);
    try {
      this.telegram.deleteMessage(this.id, messageId);
    } catch (error) {
      Sentry.captureException(error);
      console.log(`deleteMessage(${messageId}) failed`, error);
      // maybe already deleted or older that 48 hours
    }
  }

  /**
   * @param {string} message
   * @param {object} extra
   * @return {Promise}
   */
  sendMessage(message, extra) {
    console.log('sendMessage(', { message, extra }, ')');
    return this.telegram.sendMessage(this.id, message, extra);
  }

  /**
   * @param {number} messageId
   * @param {string} message
   * @param {object} extra
   * @return {Promise}
   */
  editMessageText(messageId, message, extra) {
    console.log('editMessage(', { messageId, message, extra }, ')');
    return this.telegram.editMessageText(
      this.id,
      messageId,
      undefined,
      message,
      extra,
    );
  }

  /**
   * @see https://core.telegram.org/bots/api#restrictchatmember
   * @see https://core.telegram.org/bots/api#user
   * @param {TelegramUser} user
   * @param {{}} params
   */
  restrictMember(user, params) {
    console.log('restrictMember(', { user, params }, ')');
    const extra = {
      can_send_messages: false,
      can_send_media_messages: false,
      can_send_other_messages: false,
      can_add_web_page_previews: false,
      // until_date: Date.now() + (60 * 60 * 24),
      ...params,
    };

    return this.telegram.restrictChatMember(this.id, user.id, extra);
  }

  /**
   * @see https://core.telegram.org/bots/api#kickchatmember
   * @see https://core.telegram.org/bots/api#user
   * @param {TelegramUser} user
   */
  kickMember(user) {
    console.log('kickMember(', user, ')');
    return this.telegram.kickChatMember(this.id, user.id, Date.now());
  }

  /**
   * @see https://core.telegram.org/bots/api#unbanchatmember
   * @param {TelegramUser} user
   */
  unbanMember(user) {
    console.log('unbanMember(', user, ')');
    return this.telegram.unbanChatMember(this.id, user.id);
  }
}

export { TIMEOUT_ADMIN_UPDATE, TelegramGroup };
