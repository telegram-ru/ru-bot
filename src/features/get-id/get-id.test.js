import test from 'ava'
import { Extra } from 'telegraf'

import { Context } from '../../tests/telegraf'
import installFeature from './index'

/* eslint-disable no-magic-numbers */

test('!id command reply with chat id', async (t) => {
  t.plan(3)

  let testFn = null
  const bot = {
    hears(re, fn) {
      t.is(re.toString(), /^!id$/.toString())
      t.true(typeof fn === 'function')
      testFn = fn
    },
  }
  const context = Context.create()

  installFeature(bot)
  testFn(context)
  t.true(context.reply.calledWith(context.chat.id, Extra.inReplyTo(context.message.message_id)))
})
