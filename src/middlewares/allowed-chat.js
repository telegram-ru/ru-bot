const debug = require('debug')('rubot:middlewares:allowed-chat');

const allowWhiteListChat = async ({ chat, isChatInWhiteList }, next) => {
  debug('allowWhiteListChat', chat.id, chat.type, isChatInWhiteList(chat));
  if (isChatInWhiteList(chat)) {
    return next();
  }

  return null;
};

module.exports = {
  allowWhiteListChat,
};
