import * as Sentry from '@sentry/node';
import Telegraf from 'telegraf';

import { TelegrafOptions } from 'telegraf/typings/telegraf';
import { environment } from '../config';
import { assignAdditionalContextProps } from './assign-additional-context-props';
import { push } from './elastic';
import { featureGetId } from '../features/get-id';
import { featureSpamHammer } from '../features/spam-hammer';
import { featureBanHammer } from '../features/ban-hammer';
import { featureBotParticipation } from '../features/bot-participation';
import { featureReadonlyMode } from '../features/readonly-mode';
import { featurePrivateGreetings } from '../features/private-greetings';
import { Bot, BotContext } from '../types';

const SECOND = 1000;

async function createBot(
  token: string,
  telegrafConfig: TelegrafOptions = {},
): Promise<Bot> {
  console.log('createBot()', telegrafConfig);
  const bot = new Telegraf<BotContext>(token, telegrafConfig);

  if (environment.NODE_ENV === 'development') {
    bot.use(Telegraf.log());
  }

  if (environment.ELASTICSEARCH_URL) {
    bot.use((ctx, next) => {
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
    bot.catch((error) => {
      Sentry.captureException(error);
    });
  }

  // install context methods before features
  await assignAdditionalContextProps(bot);
  featureGetId(bot);
  featureSpamHammer(bot);
  featureBanHammer(bot);
  featureBotParticipation(bot);
  featureReadonlyMode(bot);
  featurePrivateGreetings(bot);

  return bot;
}

export { createBot };
