const debug = require('debug')('rubot:middlewares:admin-required')
const { Extra } = require('telegraf')
const text = require('../text')


const adminRequired = async ({ message, reply, chat, getChatClass, from }, next) => {
  if (chat && chat.type !== 'private') {
    const chatApi = getChatClass(chat.id)

    if (await chatApi.isAdmin(from.user_id)) {
      return next()
    }

    debug('Access denied')
    return reply(text.notif.adminOnly(), Extra.inReplyTo(message.message_id))
  }

  return reply(text.notif.groupOnly(), Extra.inReplyTo(message.message_id))
}

module.exports = adminRequired
