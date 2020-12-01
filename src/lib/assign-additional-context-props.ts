import Telegraf from 'telegraf'; // eslint-disable-line no-unused-vars
import { Chat } from './chat';
import { Hammer } from './hammer';
import { Channel } from './channel';
import { bot as botConfig } from '../config';
import { Bot, BotContext } from '../types';

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

async function assignAdditionalContextProps(bot: Bot): Promise<void> {
  Object.assign(bot.context, {
    rootInstance: bot,
    chats: new Map(),
    botInfo: await bot.telegram.getMe(),
    privateChannel: new Channel(botConfig.privateChannelId, bot),
    ownedChats: [],
    getChat: getChat.bind(bot.context),
    getHammer: getHammer.bind(bot.context),
    isChatInWhiteList: isChatInWhiteList.bind(bot.context),
  });
}

export { assignAdditionalContextProps };
