const debug = require('debug')('rubot:middlewares:allowed-chat')


const allowWhiteListChat = async ({ chat, isChatInWhiteList }, next) => {
  if (chat.type !== 'private') {
    if (isChatInWhiteList(chat)) {
      return next()
    }
  }

  return next()
}

module.exports = {
  allowWhiteListChat,
}
