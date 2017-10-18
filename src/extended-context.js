const debug = require('debug')('rubot:context-methods')
const { Channel } = require('./lib/channel')

/* eslint-disable no-param-reassign */


function optionalCallbackQuery(...args) {
  if (this.callbackQuery) {
    return this.answerCallbackQuery(...args)
      .catch(error => debug(`Can't answer callback query #${this.callbackQuery.id}`, error))
  }

  return Promise.resolve()
}

function getChannelClass(channelId) {
  if (!this.channels.has(channelId)) {
    this.channels.set(channelId, new Channel(channelId, this.bot))
  }

  return this.channels.get(channelId)
}

module.exports = function installContext(bot) {
  // bot.context = {
  //   ...bot.context,
  //   bot,
  //   channels: new Map(),
  //   optionalCallbackQuery,
  //   getChannelClass,
  // }

  bot.context.bot = bot
  bot.context.channels = new Map()
  bot.context.optionalCallbackQuery = optionalCallbackQuery.bind(bot.context)
  bot.context.getChannelClass = getChannelClass.bind(bot.context)
}
