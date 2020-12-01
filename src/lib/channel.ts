import { Extra } from 'telegraf';
import * as text from '../text';
import { TelegramGroup } from './telegram-group';

class Channel extends TelegramGroup {
  notifyBanInProgress({ reason, banned }, extra) {
    console.log('notifyBanInProgress', { reason, banned });
    return this.sendMessage(
      text.spamHammer.userBanInProgressWithReason({
        reason,
        banned,
      }),
      { ...extra, parse_mode: 'Markdown' },
    );
  }

  editBanMessage(
    messageId,
    { reason, originChat, chats, moder, banned },
    extra,
  ) {
    console.log(
      'editBanMessage',
      reason,
      chats,
      originChat,
      moder.id,
      banned.id,
    );
    return this.editMessageText(
      messageId,
      text.spamHammer.userBannedWithReason({
        reason,
        chats,
        moder,
        banned,
        originChat,
      }),
      { ...extra, parse_mode: 'Markdown' },
    );
  }

  /**
   * User banned with message
   */
  notifyBan({ reason, originChat, chats, moder, banned }, extra) {
    console.log('notifyBan', reason, chats, originChat, moder.id, banned.id);
    return this.sendMessage(
      text.spamHammer.userBannedWithReason({
        reason,
        chats,
        moder,
        banned,
        originChat,
      }),
      { ...extra, parse_mode: 'Markdown' },
    );
  }

  /**
   * User unspammed
   */
  notifyUnspam({ chats, moder, spammer }, extra) {
    console.log('notifyUnspam', chats, moder.id, spammer.id);
    return this.sendMessage(text.spamHammer.userUnspammed({ moder, spammer }), {
      ...extra,
      parse_mode: 'Markdown',
    });
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

  notifyReadonly({ fluder, chat, moder, reason }, extra) {
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
