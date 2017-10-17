const debug = require('debug')('rubot:commands:start')


module.exports = (bot) => {
  bot.command('start', (ctx) => {
    ctx.reply('Hello user!')
  })
}
