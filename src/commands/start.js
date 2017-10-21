const debug = require('debug')('rubot:commands:start')
const text = require('../text')


module.exports = ({ reply, from }) => {
  debug('/start')
  reply(text.common.greetingsUser({ user: from }))
}
