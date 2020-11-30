import test from 'ava';
import faker from 'faker';
import { makeName } from './string';

/* eslint-disable no-magic-numbers */

test('testing string with last_name', (t) => {
  const user = {
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
  };

  t.is(makeName(user), `${user.first_name} ${user.last_name}`);
});

test('testing string without last_name', (t) => {
  const user = {
    first_name: faker.name.firstName(),
  };

  t.is(makeName(user), `${user.first_name}`);
});
