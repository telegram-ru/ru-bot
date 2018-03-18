const debug = require('debug')('rubot:features:status:index')
const text = require('../../text')
const { allowWhiteListChat } = require('../../middlewares/allowed-chat')
const { adminRequired } = require('../../middlewares/admin-required')


async function checkStatus({
  reply, options, message, deleteMessage,
}) {
  try {
    debug('status check')
    await deleteMessage(message.messge_id)
    reply(text.status.check(options.username))
  }
  catch (error) {
    debug('checkStatus ERROR', error)
  }
}

module.exports = function statusFeature(bot) {
  bot.hears(
    new RegExp(`^${text.commands.status()}( .*)?`),
    allowWhiteListChat, adminRequired, checkStatus,
  )
}
