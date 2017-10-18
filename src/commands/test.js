const debug = require('debug')('rubot:commands:test')


module.exports = ({ reply, i18n, from }) => {
  debug('/test')
  reply(i18n.t('common.greetings', { user: from }))
}
