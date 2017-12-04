import test from 'ava'
import sinon from 'sinon'
import { Extra } from 'telegraf'
import { Context } from '../tests/telegraf'
import text from '../text'
import { adminRequired, adminRequiredSilenced } from './admin-required'

/* eslint-disable no-param-reassign */

test.beforeEach((t) => {
  t.context.create = () => {
    const ctx = Context.create()
    const res = Math.random()
    const next = sinon.stub().returns(res)

    ctx.message.$from()
    return { ctx, res, next }
  }
})

test('test adminRequired for admin and type group', async (t) => {
  const { ctx, res, next } = t.context.create()

  ctx.chat.isAdmin = sinon.stub().resolves(true)
  ctx.chat.$type('group')
  ctx.getChat = sinon.stub().returns(ctx.chat)
  const resultFn = await adminRequired(ctx, next)

  t.true(ctx.getChat.called)
  t.true(ctx.chat.isAdmin.called)
  t.true(next.called)
  t.is(resultFn, res)
})

test('test adminRequired for admin and type private', async (t) => {
  const { ctx, next } = t.context.create()

  ctx.chat.isAdmin = sinon.stub().resolves(true)
  ctx.chat.$type('private')
  ctx.getChat = sinon.stub().returns(ctx.chat)
  await adminRequired(ctx, next)

  t.false(ctx.getChat.called)
  t.false(ctx.chat.isAdmin.called)
  t.true(ctx.reply.calledWith(text.notif.groupOnly(), Extra.inReplyTo(ctx.message.message_id)))
})

test('test adminRequired for regular user and type group', async (t) => {
  const { ctx, next } = t.context.create()

  ctx.chat.isAdmin = sinon.stub().resolves(false)
  ctx.chat.$type('group')
  ctx.getChat = sinon.stub().returns(ctx.chat)
  await adminRequired(ctx, next)

  t.true(ctx.getChat.called)
  t.true(ctx.chat.isAdmin.called)
  t.true(ctx.reply.calledWith(text.notif.adminOnly(), Extra.inReplyTo(ctx.message.message_id)))
})

test('test adminRequired for regular user and type private', async (t) => {
  const { ctx, next } = t.context.create()

  ctx.chat.isAdmin = sinon.stub().resolves(false)
  ctx.chat.$type('private')
  ctx.getChat = sinon.stub().returns(ctx.chat)
  await adminRequired(ctx, next)

  t.false(ctx.getChat.called)
  t.false(ctx.chat.isAdmin.called)
  t.true(ctx.reply.calledWith(text.notif.groupOnly(), Extra.inReplyTo(ctx.message.message_id)))
})

test('test adminRequiredSilenced for admin and type group', async (t) => {
  const { ctx, res, next } = t.context.create()

  ctx.chat.isAdmin = sinon.stub().resolves(true)
  ctx.chat.$type('group')
  ctx.getChat = sinon.stub().returns(ctx.chat)
  const resultfn = await adminRequired(ctx, next)

  t.true(ctx.getChat.called)
  t.true(ctx.chat.isAdmin.called)
  t.true(next.called)
  t.is(resultfn, res)
})

test('test adminRequiredSilenced for regular user and type group', async (t) => {
  const { ctx, next } = t.context.create()

  ctx.chat.isAdmin = sinon.stub().resolves(false)
  ctx.chat.$type('private')
  ctx.getChat = sinon.stub().returns(ctx.chat)
  const resultfn = await adminRequired(ctx, next)

  t.false(ctx.getChat.called)
  t.false(ctx.chat.isAdmin.called)
  t.false(next.called)
  t.is(resultfn, undefined)
})
