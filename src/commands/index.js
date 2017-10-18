/* eslint-disable global-require, import/no-dynamic-require */
const adminRequired = require('../middlewares/admin-required')


module.exports = (bot) => {
  bot.command('start', require('./start'))
  bot.command('test', adminRequired, require('./test'))
}
