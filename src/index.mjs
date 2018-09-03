import process from 'process'
import Telegraf from 'telegraf'
import Debug from 'debug'
import Sentry from '@sentry/node'

import * as config from './config'
import { sequelize } from './models'


Sentry.init({ dsn: process.env.SENTRY_URL })

const debug = Debug('rubot:index')

async function main() {
  await sequelize.authenticate()

  const bot = new Telegraf(config.bot.token)
  const botInfo = await bot.telegram.getMe()

  bot.options.username = botInfo.username
  bot.context.botInfo = botInfo

  bot.startPolling()
  debug('Polling started')

  bot.catch((error) => {
    Sentry.captureException(error)
    console.error('Exception in bot reported', error) // eslint-disable-line no-console
  })
}

// Report errors

main().catch((error) => {
  Sentry.captureException(error)
  console.error('Exception in main() reported', error) // eslint-disable-line no-console
})

process.on('uncaughtException', (error) => {
  Sentry.captureException(error, {
    tags: {
      type: 'process',
    },
  })
  process.exit(1)
})

process.on('unhandledRejection', (error) => {
  Sentry.captureException(error, {
    tags: {
      type: 'process',
    },
  })
  process.exit(1)
})
