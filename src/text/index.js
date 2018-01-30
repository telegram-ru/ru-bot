const {
  random, fullName, fullNameId, select, column, chatTitle,
} = require(`../lib/text`)


const text = {
  notif: {
    groupOnly: () => `Только для групп`,
    adminOnly: () => `Доступ только для админов`,
  },

  common: {
    commandShouldBeReplied: (command) => `Командой ${command} нужно отвечать на сообщение`,
    actionCancel: () => `Отмена`,
  },

  privateGreetings: {
    userStart: random([
      ({ user }) => `Привет, ${fullName(user)}`,
      ({ user }) => `Здравствуйте, ${fullName(user)}!`,
      ({ user }) => `Hi! ${user.first_name}.`,
      ({ user }) => `${user.first_name}`,
      // () => `Привет!`,
    ]),
    adminStart: random([
      ({ admin }) => `Привет, ${fullName(admin)}, ты админ!`,
      ({ admin }) => `${fullName(admin)}, ты админ, короч!`,
      ({ admin }) => `Привет, ${fullName(admin)}. Ты администратор в RU-сообществах.`,
    ]),
  },

  botParticipation: {
    botAddedToChat: ({ chat, adder }) => column(
      `Привет! Теперь ${select(chat.type, { supergroup: `супергруппа` }, `группа`)} "${chat.title}" под моей защитой.`,
      `Меня добавил к вам ${fullName(adder)}.`,
      `Администраторы уже получили права!`,
      ``,
      `Я могу:`,
      `- Забанить спамера и удалить его сообщения`,
      `- Забанить нарушителя`,
      `- Удалять стикеры`,
    ),
  },

  spamHammer: {
    userBannedWithReason: ({ banned, chats, moder, reason }) => (
      `${fullNameId(banned)} забанен ${reason && `за ${reason} `}${fullName(moder)}`
      + ` в ${chats.map(chatTitle).join(`, `)}`
    ),
    userUnspammed: ({ moder, spammer }) => (
      `${fullName(moder)} разбанил юзера ${fullNameId(spammer)}`
    ),
    shortSpamReason: () => `спам`,
    spammerAutobanned: ({ chat, banned }) => `Спамер ${fullNameId(banned)} автоматически забанен в ${chatTitle(chat)}`,
    actionUnspam: () => `Разбанить`,
  },

  readonlyMode: {
    fluderReadonlyIn: ({ fluder, moder, chat, reason = `` }) => (
      `${fullName(fluder)} #${fluder.id} получил #ReadOnly от ${fullName(moder)}`
      + ` в ${chatTitle(chat)}${reason && ` за ${reason}`}`
    ),
  },

  commands: {
    spam: () => `!спам`,
    readonly: () => `!ро`,
  },
}

module.exports = text

