const debug = require('debug')('rubot:features:private-greetings:index');
const text = require('../../text');

/**
 * Send greetings only in private chat
 */
function onStart({ reply, from, chat }) {
  debug('on /start', from, chat);
  if (chat.type === 'private') {
    reply(text.privateGreetings.userStart({ user: from }));
  }
}

module.exports = function featurePrivateGreetings(bot) {
  bot.command('start', onStart);
};
