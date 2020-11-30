import * as Sentry from '@sentry/node';
import Telegraf from 'telegraf';

import { environment } from '../config';
import { extendedContext } from './extended-context';
import { push } from './elastic';

const SECOND = 1000;

/**
 * Create new instance of Telegraf bot
 * extends it with features and context methods
 *
 * @param {string} token
 * @param {((bot: Telegraf) => void)[]} features
 * @param {{ username: string }} telegrafConfig
 * @return {Telegraf}
 */
function createBot(token, applyBot, telegrafConfig = {}) {
  console.log('createBot()', telegrafConfig);
  const instance = new Telegraf<any>(token, telegrafConfig);

  if (environment.NODE_ENV === 'development') {
    instance.use(Telegraf.log());
  }

  if (environment.ELASTICSEARCH_URL) {
    instance.use((ctx, next) => {
      if (ctx.update.message) {
        push({
          index: `rubot-${environment.NODE_ENV || 'undefined'}`,
          type: 'message',
          id: `M${ctx.update.message.message_id}C${ctx.update.message.chat.id}F${ctx.update.message.from.id}`,
          body: {
            timestamp: new Date(ctx.update.message.date * SECOND).toISOString(),
            ...ctx.update.message,
          },
        }).catch((error) => {
          console.error('Cant push to elastic', error); // eslint-disable-line no-console
        });
      }
      next();
    });
  }

  if (environment.SENTRY_URL) {
    instance.catch((error) => {
      Sentry.captureException(error);
    });
  }

  // install context methods before features
  extendedContext(instance);

  applyBot(instance);

  return instance;
}

export { createBot };
