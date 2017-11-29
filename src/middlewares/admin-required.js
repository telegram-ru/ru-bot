const debug = require('debug')('rubot:middlewares:admin-required')
const { Extra } = require('telegraf')
const text = require('../text')


const adminRequired = async ({
  message, reply, chat, getChat, from,
}, next) => {
  if (chat && chat.type !== 'private') {
    const chatApi = getChat(chat.id)

    if (await chatApi.isAdmin(from)) {
      return next()
    }

    debug('Access denied', message, chat, from)
    return reply(text.notif.adminOnly(), Extra.inReplyTo(message.message_id))
  }

  return reply(text.notif.groupOnly(), Extra.inReplyTo(message.message_id))
}

const adminRequiredSilenced = async ({ chat, getChat, from }, next) => {
  if (chat && chat.type !== 'private') {
    const chatApi = getChat(chat.id)

    if (await chatApi.isAdmin(from)) {
      return next()
    }
  }

  return null
}

module.exports = {
  adminRequired,
  adminRequiredSilenced,
}
