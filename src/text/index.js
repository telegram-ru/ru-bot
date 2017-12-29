const {
  random, fullName, fullNameId, select, column, chatTitle,
} = require(`../lib/text`)


const text = {
  notif: {
    groupOnly: () => `Только для групп`,
    adminOnly: () => `Доступ только для админов`,
  },

  common: {
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
    spamCommandShouldBeReplied: () => `Командой ${text.commands.spam()} нужно отвечать на сообщение`,
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

  commands: {
    spam: () => `!спам`,
    noSpam: () => `!не спам`,
  },
}

module.exports = text

