import test from 'ava'
import sinon from 'sinon'
import text from './text'

/* eslint-disable no-magic-numbers */


test('random(variants) should return from variant', (t) => {
  const variants = [() => 1, () => 2]
  const result = text.random(variants)()

  t.true(result === 1 || result === 2)
})

test('random(variants)() should pass arguments', (t) => {
  const variants = [sinon.spy(), sinon.spy()]

  text.random(variants)(1)
  t.true(variants[0].calledWith(1) || variants[1].calledWith(1))
})


test('fullName(user) should get correct result', (t) => {
  t.is(text.fullName({ first_name: 'Foo' }), 'Foo')
  t.is(text.fullName({ last_name: 'Bar' }), 'Bar')
  t.is(text.fullName({ username: 'foobar' }), '(@foobar)')

  t.is(text.fullName({ first_name: 'Foo', last_name: 'Bar' }), 'Foo Bar')
  t.is(text.fullName({ first_name: 'Foo', username: 'foobar' }), 'Foo (@foobar)')
  t.is(text.fullName({ last_name: 'Bar', username: 'foobar' }), 'Bar (@foobar)')
  t.is(text.fullName({ first_name: 'Foo', last_name: 'Bar', username: 'foobar' }), 'Foo Bar (@foobar)')
})

test('fullNameId(user) should get correct result', (t) => {
  t.is(text.fullNameId({ id: 1, first_name: 'Foo' }), 'Foo #1')
  t.is(text.fullNameId({ id: 1, last_name: 'Bar' }), 'Bar #1')
  t.is(text.fullNameId({ id: 1, username: 'foobar' }), '(@foobar) #1')

  t.is(text.fullNameId({ id: 2, first_name: 'Foo', last_name: 'Bar' }), 'Foo Bar #2')
  t.is(text.fullNameId({ id: 2, first_name: 'Foo', username: 'foobar' }), 'Foo (@foobar) #2')
  t.is(text.fullNameId({ id: 2, last_name: 'Bar', username: 'foobar' }), 'Bar (@foobar) #2')
  t.is(text.fullNameId({ id: 2, first_name: 'Foo', last_name: 'Bar', username: 'foobar' }), 'Foo Bar (@foobar) #2')
})

test('chatTitle(chat) should return correct name', (t) => {
  t.is(text.chatTitle({ type: 'private', id: 1 }), 'private:1')
  t.is(text.chatTitle({ type: 'private', id: 1, title: 'Chat' }), 'Chat')
  t.is(text.chatTitle({ type: 'private', id: 1, username: 'chat' }), '(@chat)')
  t.is(text.chatTitle({ type: 'private', id: 1, title: 'Chat', username: 'chat' }), 'Chat (@chat)')
})

test('select(value, cases, defaultCase) should select from map', (t) => {
  const cases = { foo: 1, bar: 2, baz: 3, 555: 4 }

  t.is(text.select('foo', cases, 5), 1)
  t.is(text.select('bar', cases, 5), 2)
  t.is(text.select('baz', cases, 5), 3)
  t.is(text.select(555, cases, 5), 4)
  t.is(text.select('NOT', cases, 5), 5)
})

test('column(1,2) should join with \n', (t) => {
  t.is(text.column('a', 'b', 'c'), 'a\nb\nc')
  t.is(text.column('a', 'b'), 'a\nb')
  t.is(text.column('a'), 'a')
})
