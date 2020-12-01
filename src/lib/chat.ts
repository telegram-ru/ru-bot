import { Telegraf } from 'telegraf';
import { TelegramGroup } from './telegram-group';

class Chat<Bot extends Telegraf<any>, BotContext> extends TelegramGroup<
  Bot,
  BotContext
> {}

export { Chat };
