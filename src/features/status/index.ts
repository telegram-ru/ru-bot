import * as Sentry from '@sentry/node';
import * as text from '../../text';
import { allowWhiteListChat } from '../../middlewares/allowed-chat';
import { adminRequired } from '../../middlewares/admin-required';

async function checkStatus({ reply, options, message, deleteMessage }) {
  try {
    console.log('status check');
    await deleteMessage(message.message_id);
    reply(text.status.check(options.username));
  } catch (error) {
    Sentry.captureException(error);
    console.log('checkStatus ERROR', error);
  }
}

export function status(bot) {
  bot.hears(
    new RegExp(`^(${text.commands.status()}|!status)( .*)?`),
    allowWhiteListChat,
    adminRequired,
    checkStatus,
  );
}
