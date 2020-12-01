import Telegraf, { Context } from 'telegraf'; // eslint-disable-line no-unused-vars
import { Chat } from './chat';
import { Hammer } from './hammer';
import { Channel } from './channel';
import { bot as botConfig } from '../config';

/* eslint-disable no-param-reassign */

/**
 * Call answerCallbackQuery with console.log() error handler
 * @param {any[]} args
 * @return {Promise<void>}
 */
function optionalCallbackQuery(...args) {
  if (this.callbackQuery) {
    return this.answerCallbackQuery(...args).catch((error) =>
      console.log(
        `Can't answer callback query #${this.callbackQuery.id}`,
        error,
      ),
    );
  }

  return Promise.resolve();
}

/**
 * Find chat class by its id
 * If not found create class for chat and add it
 * @param {string|number} chatId
 * @return {Chat}
 */
function getChat(chatId: string): Chat {
  if (!this.chats.has(chatId)) {
    this.chats.set(chatId, new Chat(chatId, this.rootInstance));
  }

  return this.chats.get(chatId);
}

function getHammer() {
  return new Hammer(this);
}

/**
 * Check if chat in list
 * @param {Chat} chat
 * @return {boolean}
 */
function isChatInWhiteList(chat: Chat): boolean {
  return this.chats.has(chat.id);
}

interface IBotContext {
  rootInstance: Telegraf<any>;
  chats: Map<string, Chat>;
  privateChannel: Channel;
  ownedChats: string[];
  getChat;
  getHammer;
  isChatInWhiteList;
  optionalCallbackQuery;
}

export type BotContext = Context & IBotContext;

async function extendedContext(
  bot: Telegraf<BotContext>,
): Promise<IBotContext> {
  const context = {
    rootInstance: bot,
    chats: new Map(),
    botInfo: await bot.telegram.getMe(),
    privateChannel: new Channel(botConfig.privateChannelId, bot),
    ownedChats: [],
    getChat: getChat.bind(bot.context),
    getHammer: getHammer.bind(bot.context),
    isChatInWhiteList: isChatInWhiteList.bind(bot.context),
    optionalCallbackQuery: optionalCallbackQuery.bind(bot.context),
  };

  return context;
}

export { extendedContext };
