/* eslint quotes: ["error", "backtick"] */

function random(variants) {
  const count = variants.length

  return object => variants[Math.floor(Math.random() * count)](object)
}

function fullName({ first_name: first, last_name: last, username }) {
  return [
    first,
    last,
    username && `(${username})`,
  ]
    .filter(e => !!e)
    .join(` `)
}


module.exports = {
  notif: {
    groupOnly: () => `Только для групп`,
    adminOnly: () => `Доступ только для админов`,
  },

  common: {
    greetingsUser: random([
      ({ user }) => `Привет, ${fullName(user)}`,
      ({ user }) => `Здравствуйте, ${fullName(user)}!`,
      () => `Привет!`,
    ]),
    greetingsAdmin: random([
      ({ admin }) => `Привет, ${fullName(admin)}, ты админ!`,
      ({ admin }) => `${fullName(admin)}, ты админ, короч!`,
    ]),
  },
}

