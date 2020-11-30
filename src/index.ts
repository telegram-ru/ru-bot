import * as Sentry from '@sentry/node';

import { bot as botConfig, environment } from './config';

import { applyBot } from './features';
import { createBot } from './lib/runtime';
import { Channel } from './lib/channel';
import {
  InvalidChatlistError,
  normalizeChatList,
  validateChatList,
} from './lib/chatlist-validate';
import { elasticPing } from './lib/elastic';
import { sequelize } from './models';

Sentry.init({
  dsn: environment.SENTRY_URL,
});

let CHAT_LIST;

if (!environment.BOT_TOKEN) {
  throw new Error('No telegram bot token provided');
}

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const chatlistConfig = require('./.chatlist.json'); // eslint-disable-line global-require

  validateChatList(chatlistConfig);
  CHAT_LIST = [...Object.values(normalizeChatList(chatlistConfig))];
} catch (error) {
  if (error.code === 'MODULE_NOT_FOUND') {
    console.log('ERROR: Maybe you forget create .chatlist.json ?');
    process.exit(-1);
  }

  if (error instanceof InvalidChatlistError) {
    console.error(error.message);
    console.error(error.stack);
    process.exit(-1);
  }

  throw error;
}

const bot = createBot(botConfig.token, applyBot, {
  username: botConfig.username,
});

async function main() {
  console.log('main()');
  await sequelize.authenticate();

  if (environment.ELASTICSEARCH_URL) {
    await elasticPing();
  }

  bot.context.botInfo = await bot.telegram.getMe();
  bot.context.privateChannel = new Channel(botConfig.privateChannelId, bot);
  // TODO: hardcoded chatlist
  bot.context.ownedChats = [];

  if (!(await bot.context.privateChannel.canPostMessages())) {
    throw new Error(
      'Bot should be admin and can post messages to private channel',
    );
  }

  await Promise.all(
    CHAT_LIST.map((options) => {
      console.log(`Create chat instance for id:${options.id}`);
      const chat = bot.context.getChat(options.id);

      chat.setOptions(options);
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

process.on('uncaughtException', (error) => {
  Sentry.captureException(error, {
    tags: {
      type: 'process',
    },
  });
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  Sentry.captureException(error, {
    tags: {
      type: 'process',
    },
  });
  process.exit(1);
});
