require('dotenv').config()
const { resolve } = require('path')
const Telegraf = require('telegraf')
const I18n = require('telegraf-i18n')
const debug = require('debug')('rubot:index')

const config = require('./config')
const { sequelize } = require('./models')

const installExtendedContext = require('./extended-context')
const installCommands = require('./commands')


if (!config.bot.token) {
  console.error('No telegram bot token provided.') // eslint-disable-line no-console
  process.exit(1) // eslint-disable-line unicorn/no-process-exit
}

const bot = new Telegraf(config.bot.token, { username: config.bot.username })
const i18n = new I18n({
  defaultLanguage: 'ru',
  allowMissing: true,
  directory: resolve(__dirname, '..', 'locales'),
})

if (config.dev) {
  bot.use(Telegraf.log())
}

bot.use(i18n.middleware())

installExtendedContext(bot)
installCommands(bot)

bot.startPolling()
console.log('Start polling...') // eslint-disable-line no-console
