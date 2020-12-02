import Telegraf, { Context } from 'telegraf';
import { Chat } from './lib/chat';
import { Channel } from './lib/channel';
import { Hammer } from './lib/hammer';

export type Bot = Telegraf<BotContext>;

export interface IBotContext {
  rootInstance: Bot;
  chats: Map<string, Chat<Bot, BotContext>>;
  privateChannel: Channel<Bot, BotContext>;
  ownedChats: Chat<Bot, BotContext>[];
  getChat: (string) => Chat<Bot, BotContext>;
  getHammer: () => Hammer<Bot, BotContext>;
  isChatInWhiteList: (Chat) => boolean;
}

export type BotContext = Context & IBotContext;
