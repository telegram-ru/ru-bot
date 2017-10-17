require('dotenv').config()
const Telegraf = require('telegraf')
const debug = require('debug')('rubot:index')

const config = require('./config')
const { sequelize } = require('./models')
const { install } = require('./lib/runtime')

const contextMethods = require('./context-methods')


if (!config.bot.token) {
  console.error('No telegram bot token provided.') // eslint-disable-line no-console
  process.exit(1) // eslint-disable-line unicorn/no-process-exit
}

const bot = new Telegraf(config.bot.token, { username: config.bot.username })

if (config.dev) {
  bot.use(Telegraf.log())
}

bot.command('start', (ctx) => {
  ctx.reply('Hello!')
})

install(bot, [
  contextMethods,
])

bot.startPolling()
console.log('Start polling...') // eslint-disable-line no-console
