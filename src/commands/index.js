/* eslint-disable global-require */
const adminRequired = require('../middlewares/admin-required')


module.exports = (bot) => {
  bot.command('start', require('./start'))
}
