const debug = require('debug')('rubot:middlewares:admin-required')
const { Extra } = require('telegraf')


const adminRequired = async ({ message, reply, i18n, chat, getChannelClass, from }, next) => {
  if (chat && chat.type !== 'private') {
    const channel = getChannelClass(chat.id)

    if (await channel.isAdmin(from.user_id)) {
      return next()
    }

    debug('Access denied')
    return reply(i18n.t('noty.admin.access-required'), Extra.inReplyTo(message.message_id))
  }

  return reply(i18n.t('noty.chat.only'), Extra.inReplyTo(message.message_id))
}

module.exports = adminRequired
