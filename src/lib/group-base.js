const debug = require('debug')('rubot:lib:group-base')
const { makeName } = require('./string')


const TIMEOUT_ADMIN_UPDATE = 60000


/**
 * GroupBase is parent for Channel and Chat
 * with common methods to fetch admins and manage messages
 */
class GroupBase {
  /**
   * @param {number} chatId
   * @param {object} botInstance
   * @return {Promise<Array>}
   */
  constructor(chatId, botInstance) {
    this.id = chatId
    this.bot = botInstance
    this.tg = this.bot.telegram

    this.admins = {
      list: [],
      nextUpdate: Date.now() - TIMEOUT_ADMIN_UPDATE,
    }
  }

  /**
   * @param {boolean} force ignore timeout if `true`
   * @return {Promise<Array>}
   */
  async getAdmins(force = false) {
    debug(`getAdmins(force: ${force}`)
    debug(`nextUpdate: ${this.admins.nextUpdate}, now: ${Date.now()}`)

    if (!force && this.admins.nextUpdate > Date.now()) {
      return this.admins.list
    }

    try {
      const chatAdmins = await this.tg.getChatAdministrators(this.id)

      this.admins.list = chatAdmins.map(member => ({
        id: member.user.id,
        isBot: member.user.is_bot,
        fullName: makeName(member.user),
        username: member.user.username,
        status: member.status,
      }))
      this.admins.nextUpdate = Date.now() + TIMEOUT_ADMIN_UPDATE

      return this.admins.list
    }
    catch (error) {
      debug('getAdmins() failed', error)
      return []
    }
  }

  /**
   * @param {User} user
   * @return {Promise<boolean>}
   */
  async isAdmin(user) {
    debug('isAdmin(', user, ')')
    debug('Current admins:', this.admins.list)

    const adminList = await this.getAdmins()
    debug('Fetched admins:', adminList)

    const found = adminList.find(admin => admin.id === user.id)

    if (found) {
      return found.status === 'creator' || found.status === 'administrator'
    }

    return false
  }

  async deleteMessage(messageId) {
    try {
      this.tg.deleteMessage(this.id, messageId)
    }
    catch (error) {
      debug(`deleteMessage(${messageId}) failed`, error)
      // maybe already deleted or older that 48 hours
    }
  }
}

module.exports = {
  TIMEOUT_ADMIN_UPDATE,
  GroupBase,
}
