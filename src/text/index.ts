const {
  random,
  fullName,
  fullNameId,
  fullNameLink,
  fullNameIdLink,
  select,
  column,
  chatLink,
  russianSpeaking,
} = require(`../lib/text`);

const notif = {
  groupOnly: () => `Только для групп`,
    adminOnly: () => `Доступ только для админов`,
};

const common = {
  commandShouldBeReplied: (command) =>
    `Командой ${command} нужно отвечать на сообщение`,
    actionCancel: () => `Отмена`,
};

const privateGreetings = {
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
    ({ admin }) =>
      `Привет, ${fullName(admin)}. Ты администратор в RU-сообществах.`,
  ]),
};

const botParticipation = {
  botAddedToChat: ({ chat, adder }) =>
    column(
      `Привет! Теперь ${select(
        chat.type,
        { supergroup: `супергруппа` },
        `группа`,
      )} "${chat.title}" под моей защитой.`,
      `Меня добавил к вам ${fullName(adder)}.`,
      `Администраторы уже получили права!`,
      ``,
      `Я могу:`,
      `- Забанить спамера и удалить его сообщения`,
      `- Забанить нарушителя`,
      `- Удалять стикеры`,
    ),
};

const spamHammer = {
  userBannedWithReason: ({ banned, chats, originChat, moder, reason }) =>
    [
      `#бан #ban`,
      `*Юзер:* ${fullNameIdLink(banned)}`,
      `*Причина:* ${reason}`,
      `*От* ${fullNameLink(moder)} *в* ${chatLink(
        russianSpeaking(originChat),
      )}`,
    ]
      .filter(Boolean)
      .join(`\n`),
    userBanInProgressWithReason: ({ reason, banned }) =>
    `*Бан юзера* ${fullNameId(banned)} ${
      reason && `за ${reason} `
    }в процессе…`,
    userUnspammed: ({ moder, spammer }) =>
    `\n#unban\n${fullNameLink(moder)} *разбанил* юзера ${fullNameIdLink(
      spammer,
    )}`,
    shortSpamReason: () => `спам`,
    spammerAutobanned: ({ chat, banned }) =>
    `Спамер ${fullNameId(banned)} автоматически забанен в ${chatLink(chat)}`,
    actionUnspam: () => `Разбанить`,
};

const readonlyMode = {
  fluderReadonlyIn: ({ fluder, moder, chat, reason = `` }) =>
    [
      `#ro #ро #readonly #ридонли`,
      `*Юзер:* ${fullNameIdLink(fluder)}`,
      `*Причина:* ${reason}`,
      `*От* ${fullNameLink(moder)} *в* ${chatLink(russianSpeaking(chat))}`,
    ]
      .filter(Boolean)
      .join(`\n`),
};

const banHammer = {
  fluderBannedIn: ({ fluder, moder, chat, reason = `` }) =>
    [
      `#ban #бан`,
      `*Юзер:* ${fullNameIdLink(fluder)}`,
      `*Причина:* ${reason}`,
      `*От* ${fullNameLink(moder)} *в* ${chatLink(russianSpeaking(chat))}`,
    ]
      .filter(Boolean)
      .join(`\n`),
};

const status = {
  check: (botName) => `Чат обслуживается ботом ${botName}`,
};

const commands = {
  spam: () => `!спам`,
    readonly: () => `!ро`,
    status: () => `!статус`,
    ban: () => `!бан`,
};


export {
  commands,
  common,
  banHammer,
  botParticipation,
  notif,
  privateGreetings,
  readonlyMode,
  spamHammer,
  status,
};
