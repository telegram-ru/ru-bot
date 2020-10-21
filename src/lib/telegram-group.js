const Debug = require('debug');
const Sentry = require('@sentry/node');
const { makeName } = require('./string');

const TIMEOUT_ADMIN_UPDATE = 60000;

/**
 * GroupBase is parent for Channel and Chat
 * with common methods to fetch admins and manage messages
 */
class TelegramGroup {
  /**
   * @param {number} chatId
   * @param {object} botInstance
   * @return {Promise<Array>}
   */
  constructor(chatId, botInstance) {
    this.id = chatId;
    /**
     * Options from .chatlist.json
     * @type {{ stickers: { remove: boolean, restrict: boolean } }}
     */
    this.options = {};
    this.bot = botInstance;
    this.telegram = this.bot.telegram;
    this.debug = Debug(`rubot:lib:telegram-group:id#${chatId}`);

    this.admins = {
      list: [],
      nextUpdate: Date.now() - TIMEOUT_ADMIN_UPDATE,
    };
  }

  /**
   * Options from .chatlist.json
   * @param {{ stickers: Object }} options
   */
  setOptions(options) {
    this.options = options;
  }

  /**
   * @return {Promise<boolean>}
   */
  isBotAdmin() {
    return this.isAdmin(this.bot.context.botInfo);
  }

  /**
   * Get settings of stickers in group
   * @return {{ remove: boolean, restrict: boolean }}
   */
  getStickersOptions() {
    return { remove: false, restrict: false, ...this.options.stickers };
  }

  /**
   * @return {Promise<boolean>}
   */
  async canPostMessages() {
    this.debug('canPostMessages()');
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
  async getAdmins(force = false) {
    this.debug(
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
        fullName: makeName(member.user),
        username: member.user.username,
        status: member.status,
        raw: member,
      }));
      this.admins.nextUpdate = Date.now() + TIMEOUT_ADMIN_UPDATE;

      return this.admins.list;
    } catch (error) {
      Sentry.captureException(error);
      this.debug('getAdmins() failed', error);
      return [];
    }
  }

  /**
   * @param {User} user
   * @return {Promise<{id, isBot, fullName, username, status, raw}>}
   */
  async isAdmin(user) {
    this.debug('isAdmin(', user, ')');
    // this.debug('Current admins:', this.admins.list)

    const adminList = await this.getAdmins();
    // this.debug('Fetched admins:', adminList)

    const found = adminList.find((admin) => admin.id === user.id);

    if (found) {
      // this.debug(`Found admin with id ${user.id} with status `, found.status)

      return found.status === 'creator' || found.status === 'administrator';
    }

    return false;
  }

  /**
   * Delete message from current chat by message id
   * @param {number} messageId
   */
  async deleteMessage(messageId) {
    this.debug(`deleteMessage(${messageId})`);
    try {
      this.telegram.deleteMessage(this.id, messageId);
    } catch (error) {
      Sentry.captureException(error);
      this.debug(`deleteMessage(${messageId}) failed`, error);
      // maybe already deleted or older that 48 hours
    }
  }

  /**
   * @param {string} message
   * @param {object} extra
   * @return {Promise}
   */
  sendMessage(message, extra) {
    this.debug('sendMessage(', { message, extra }, ')');
    return this.telegram.sendMessage(this.id, message, extra);
  }

  /**
   * @param {number} messageId
   * @param {string} message
   * @param {object} extra
   * @return {Promise}
   */
  editMessageText(messageId, message, extra) {
    this.debug('editMessage(', { messageId, message, extra }, ')');
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
    this.debug('restrictMember(', { user, params }, ')');
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
    this.debug('kickMember(', user, ')');
    return this.telegram.kickChatMember(this.id, user.id, {
      until_date: Date.now(),
    });
  }

  /**
   * @see https://core.telegram.org/bots/api#unbanchatmember
   * @param {TelegramUser} user
   */
  unbanMember(user) {
    this.debug('unbanMember(', user, ')');
    return this.telegram.unbanChatMember(this.id, user.id);
  }
}

module.exports = {
  TIMEOUT_ADMIN_UPDATE,
  TelegramGroup,
};
