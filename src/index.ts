import { resolve } from 'path';
import { readFileSync } from 'fs';

import * as Sentry from '@sentry/node';

import { bot as botConfig, environment } from './config';
import { init } from './lib/mongodb';
import { createBot } from './lib/runtime';
import { sequelize } from './models';

Sentry.init({
  dsn: environment.SENTRY_URL,
});

let CHAT_LIST;

if (!environment.BOT_TOKEN) {
  throw new Error('No telegram bot token provided');
}

try {
  CHAT_LIST = JSON.parse(
    readFileSync(resolve(__dirname, '../.chatlist.json')).toString(),
  );
} catch (error) {
  if (error.code === 'MODULE_NOT_FOUND') {
    console.log('ERROR: Maybe you forget create .chatlist.json ?');
    process.exit(-1);
  }

  throw error;
}

async function main() {
  await init();
  const bot = await createBot(botConfig.token, {
    username: botConfig.username,
  });
  await sequelize.authenticate();

  if (!(await bot.context.privateChannel.canPostMessages())) {
    throw new Error(
      'Bot should be admin and can post messages to private channel',
    );
  }

  await Promise.all(
    CHAT_LIST.map((options) => {
      console.log(`Create chat instance for id:${options.id}`);
      const chat = bot.context.getChat(options.id);

      bot.context.ownedChats.push(chat);
      return chat.getAdmins();
    }),
  );

  bot.startPolling();
  console.log('Start polling...'); // eslint-disable-line no-console
}

main().catch((error) => {
  Sentry.captureException(error);
  console.log(error); // eslint-disable-line no-console
});

process.on('uncaughtException', async (error) => {
  Sentry.captureException(error, {
    tags: {
      type: 'process',
    },
  });
  await Sentry.close(2000)
  process.exit(1);
});

process.on('unhandledRejection', async (error) => {
  Sentry.captureException(error, {
    tags: {
      type: 'process',
    },
  });
  await Sentry.close(2000)
  process.exit(1);
});
