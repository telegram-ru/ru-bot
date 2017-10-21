const debug = require('debug')('rubot:middlewares:admin-required')
const { Extra } = require('telegraf')
const text = require('../text')


const adminRequired = async ({ message, reply, chat, getChannelClass, from }, next) => {
  if (chat && chat.type !== 'private') {
    const channel = getChannelClass(chat.id)

    if (await channel.isAdmin(from.user_id)) {
      return next()
    }

    debug('Access denied')
    return reply(text.notif.adminOnly(), Extra.inReplyTo(message.message_id))
  }

  return reply(text.notif.groupOnly(), Extra.inReplyTo(message.message_id))
}

module.exports = adminRequired
