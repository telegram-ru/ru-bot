import { Extra, Telegraf } from 'telegraf';
import * as text from '../text';
import { TelegramGroup } from './telegram-group';

class Channel<Bot extends Telegraf<any>, BotContext> extends TelegramGroup<
  Bot,
  BotContext
> {
  notifyBanInProgress({ reason, banned }, extra?: Extra) {
    console.log('notifyBanInProgress', { reason, banned });
    return this.sendMessage(
      text.spamHammer.userBanInProgressWithReason({
        reason,
        banned,
      }),
      { ...extra, parse_mode: 'Markdown' },
    );
  }

  editBanMessage(messageId, { reason, originChat, moder, banned }, extra) {
    console.log('editBanMessage', reason, originChat, moder.id, banned.id);
    return this.editMessageText(
      messageId,
      text.spamHammer.userBannedWithReason({
        reason,
        moder,
        banned,
        originChat,
      }),
      { ...extra, parse_mode: 'Markdown' },
    );
  }

  /**
   * Spammer {banned} automatically banned in {chat}
   */
  notifySpammerAutoban({ chat, banned }, extra) {
    console.log('notifySpammerAutoban', chat.id, banned.id);
    return this.sendMessage(
      text.spamHammer.spammerAutobanned({ chat, banned }),
      { ...extra, parse_mode: 'Markdown' },
    );
  }

  forwardMessage({ chat, message }) {
    console.log('forwardMessage', { chat, message });
    return this.telegram.forwardMessage(this.id, chat.id, message.message_id);
  }

  notifyReadonly({ fluder, chat, moder, reason }, extra?: Extra) {
    console.log('notifyReadonly', fluder.id, chat.id);
    return this.sendMessage(
      text.readonlyMode.fluderReadonlyIn({
        fluder,
        chat,
        moder,
        reason,
      }),
      { ...extra, parse_mode: 'Markdown' },
    );
  }

  notifyKickBan({ fluder, chat, moder, reason }, extra?: Extra) {
    console.log('notifyKickBan', fluder.id, chat.id);
    return this.sendMessage(
      text.banHammer.fluderBannedIn({
        fluder,
        chat,
        moder,
        reason,
      }),
      { ...extra, parse_mode: 'Markdown' },
    );
  }
}

export { Channel };
