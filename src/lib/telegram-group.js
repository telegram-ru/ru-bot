const debug = require('debug')
const { makeName } = require('./string')


const { ADMIN_TIMEOUT } = process.env


/**
 * TelegramGroup is a parent for the Channel and the Chat with a
 * common methods to fetch admins and to manage messages.
 */
class TelegramGroup {
  /**
   * Create an instance of the TelegramGroup class.
   *
   * @param {number} chatId The working group ID
   * @param {Telegraf} bot The bot instance
   */
  constructor(chatId, bot) {
    this.id = chatId
    this.options = {}
    this.bot = bot
    this.telegram = bot.telegram
    this.debug = debug(`rubot:lib:telegram-group:id#${chatId}`)
    this.admins = { list: [], nextUpdate: Date.now() - ADMIN_TIMEOUT }
  }

  /**
   * Sets options from the chatlist.json
   * @param {{ remove: boolean, restrict: boolean, allowed: Array<number> }} options
   */
  setOptions(options) {
    this.options = options
  }

  /**
   * Determines if the bot is admin
   * @return {boolean}
   */
  isBotAdmin() {
    return this.isAdmin(this.bot.context.botInfo)
  }

  /**
   * Get settings of stickers in group
   * @return {{ remove: boolean, restrict: boolean, allowed: Array<number> }}
   */
  getStickersOptions() {
    return Object.assign(
      { remove: false, restrict: false, allowed: [] },
      this.options.stickers
    )
  }

  /**
   * Determines if can post messages
   * @return {boolean}
   */
  async canPostMessages() {
    this.debug('canPostMessages()')

    const admins = await this.getAdmins()
    const found = admins.find(({ id }) => id === this.bot.context.botInfo.id)

    return found ? found.raw.can_post_messages : false
  }

  /**
   * Gets all admins
   * @param {boolean} force ignore timeout if `true`
   * @return {Array}
   */
  async getAdmins(force = false) {
    this.debug(`getAdmins(${force}), nextUpdate: ${this.admins.nextUpdate}, now: ${Date.now()}`)

    if (!force && this.admins.nextUpdate > Date.now()) {
      return this.admins.list
    }

    try {
      const chatAdmins = await this.telegram.getChatAdministrators(this.id)

      this.admins.list = chatAdmins.map((member) => ({
        id: member.user.id,
        isBot: member.user.is_bot,
        fullName: makeName(member.user),
        username: member.user.username,
        status: member.status,
        raw: member,
      }))
      this.admins.nextUpdate = Date.now() + ADMIN_TIMEOUT

      return this.admins.list
    }
    catch (error) {
      this.debug('getAdmins() failed', error)

      return []
    }
  }

  /**
   * Determines if the user is admin
   * @param {TelegramUser} user
   * @return {boolean}
   */
  async isAdmin(user) {
    this.debug(`isAdmin(${user})`)
    // this.debug('Current admins:', this.admins.list)
    // this.debug('Fetched admins:', adminList)
    // this.debug(`Found admin with id ${user.id} with status `, found.status)

    const adminList = await this.getAdmins()
    const found = adminList.find(({ id }) => id === user.id)

    return found
      ? ['creator', 'administrator'].includes(found.status)
      : false
  }

  /**
   * Deletes a message from the current chat by its id
   * @param {number} id
   */
  async deleteMessage(id) {
    this.debug(`deleteMessage(${id})`)

    try {
      this.telegram.deleteMessage(this.id, id)
    }
    catch (error) {
      this.debug(`deleteMessage(${id}) failed`, error)
    }
  }

  /**
   * Sends the message
   * @see https://core.telegram.org/bots/api#sendmessage
   * @param {string} message
   * @param {Object|Extra} extra
   * @return {Promise}
   */
  sendMessage(message, extra) {
    this.debug(`sendMessage(${{ message, extra }})`)

    return this.telegram.sendMessage(this.id, message, extra)
  }

  /**
   * Restricts member rights
   * @see https://core.telegram.org/bots/api#restrictchatmember
   * @see https://core.telegram.org/bots/api#user
   * @param {TelegramUser} user
   * @param {Object} params
   */
  restrictMember(user, extra) {
    this.debug(`restrictMember(${{ user, extra }})`)

    extra = Object.assign({ // eslint-disable-line no-param-reassign
      can_send_messages: false,
      can_send_media_messages: false,
      can_send_other_messages: false,
      can_add_web_page_previews: false,
      // until_date: Date.now() + (60 * 60 * 24),
    }, extra)

    return this.telegram.restrictChatMember(this.id, user.id, extra)
  }

  /**
   * Kicks the member from a group
   * @see https://core.telegram.org/bots/api#kickchatmember
   * @see https://core.telegram.org/bots/api#user
   * @param {TelegramUser} user
   */
  kickMember(user) {
    this.debug(`kickMember(${user})`)

    return this.telegram.kickChatMember(this.id, user.id, {
      until_date: Date.now(),
    })
  }

  /**
   * Unban the member for a group
   * @see https://core.telegram.org/bots/api#unbanchatmember
   * @see https://core.telegram.org/bots/api#user
   * @param {TelegramUser} user
   */
  unbanMember(user) {
    this.debug(`unbanMember(${user})`)

    return this.telegram.unbanChatMember(this.id, user.id)
  }
}

module.exports = { TelegramGroup }
