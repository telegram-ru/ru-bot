import test from 'ava'
import faker from 'faker'
import { makeName } from './string'

/* eslint-disable no-magic-numbers */

test('testing string with last_name', (t) => {
  const user = {
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
  }
  const name = makeName(user)

  t.true(/[a-z]/ig.test(name))
})

test('testing string without last_name', (t) => {
  const user = {
    first_name: faker.name.firstName(),
  }
  const name = makeName(user)

  t.true(/[a-z]/ig.test(name))
})
