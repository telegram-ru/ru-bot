const debug = require('debug')('rubot:lib:channel');
const text = require('../text');
const { TelegramGroup } = require('./telegram-group');

class Channel extends TelegramGroup {
  notifyBanInProgress({ reason, banned }, extra) {
    debug('notifyBanInProgress', { reason, banned });
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
    debug('editBanMessage', reason, chats, originChat, moder.id, banned.id);
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
    debug('notifyBan', reason, chats, originChat, moder.id, banned.id);
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
    debug('notifyUnspam', chats, moder.id, spammer.id);
    return this.sendMessage(
      text.spamHammer.userUnspammed({ chats, moder, spammer }),
      { ...extra, parse_mode: 'Markdown' },
    );
  }

  /**
   * Spammer {banned} automatically banned in {chat}
   */
  notifySpammerAutoban({ chat, banned }, extra) {
    debug('notifySpammerAutoban', chat.id, banned.id);
    return this.sendMessage(
      text.spamHammer.spammerAutobanned({ chat, banned }),
      { ...extra, parse_mode: 'Markdown' },
    );
  }

  forwardMessage({ chat, message }) {
    debug('forwardMessage', { chat, message });
    return this.telegram.forwardMessage(this.id, chat.id, message.message_id);
  }

  notifyReadonly({ fluder, chat, moder, reason }, extra) {
    debug('notifyReadonly', fluder.id, chat.id);
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

  notifyKickBan({ fluder, chat, moder, reason }, extra) {
    debug('notifyKickBan', fluder.id, chat.id);
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

module.exports = { Channel };
