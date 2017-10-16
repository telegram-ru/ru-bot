require('dotenv').config()
const Telegraf = require('telegraf')
const debug = require('debug')('rubot:index')

const config = require('./config')
const { sequelize } = require('./models')


if (!config.bot.token) {
  console.error('No telegram bot token provided.') // eslint-disable-line no-console
  process.exit(1) // eslint-disable-line unicorn/no-process-exit
}

const bot = new Telegraf(config.bot.token)

bot.command('start', (ctx) => {
  ctx.reply('Hello!')
})

bot.startPolling()
