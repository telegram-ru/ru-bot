import * as text from '../../text';

/**
 * Send greetings only in private chat
 */
function onStart({ reply, from, chat }) {
  console.log('on /start', from, chat);
  if (chat.type === 'private') {
    reply(text.privateGreetings.userStart({ user: from }));
  }
}

export function featurePrivateGreetings(bot) {
  bot.command('start', onStart);
}
