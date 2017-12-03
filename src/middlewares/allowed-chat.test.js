import test from 'ava'
import sinon from 'sinon'
import { Context } from '../tests/telegraf'
import { allowWhiteListChat } from './allowed-chat'

/* eslint-disable no-param-reassign */

test.beforeEach((t) => {
  t.context.create = ({ inWhitelist }) => {
    const ctx = Context.create()
    const res = Math.random()
    const next = sinon.stub().returns(res)

    ctx.isChatInWhiteList = sinon.stub().returns(inWhitelist)

    return { ctx, res, next }
  }
})

test('should pass in whitelist', async (t) => {
  const { ctx, res, next } = t.context.create({ inWhitelist: true })
  const result = await allowWhiteListChat(ctx, next)

  t.true(next.called)
  t.is(result, res)
  t.true(ctx.isChatInWhiteList.calledWith(ctx.chat))
})

test('should stop not in whitelist', async (t) => {
  const { ctx, next } = t.context.create({ inWhitelist: false })
  const result = await allowWhiteListChat(ctx, next)

  t.false(next.called)
  t.is(result, null)
  t.true(ctx.isChatInWhiteList.calledWith(ctx.chat))
})

