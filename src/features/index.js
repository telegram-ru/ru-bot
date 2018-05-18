/* eslint-disable global-require */

// order is important!
module.exports = [
  require('./get-id'),
  require('./spam-hammer'),
  require('./ban-hammer'),
  require('./bot-participation'),
  require('./readonly-mode'),
  require('./private-greetings'),
  require('./status'),
]
