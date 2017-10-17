const debug = require('debug')('rubot:context-methods')


/* eslint-disable no-param-reassign */


function optionalCallbackQuery(...args) {
  if (this.callbackQuery) {
    return this.answerCallbackQuery(...args)
      .catch(error => debug(`Can't answer callback query #${this.callbackQuery.id}`, error))
  }

  return Promise.resolve()
}

module.exports = function installContextMethods(bot) {
  bot.context = {
    ...bot.context,

    optionalCallbackQuery,
  }
}
