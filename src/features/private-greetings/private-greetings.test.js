import test from 'ava';

import { Context } from '../../tests/telegraf';
import installFeature from './index';

/* eslint-disable no-magic-numbers */

test('/start reply with greet in private', async (t) => {
  let testFn = null;
  const bot = {
    command(cmd, fn) {
      t.is(cmd, 'start', 'command is start');
      t.true(typeof fn === 'function', 'callback is function');
      testFn = fn;
    },
  };
  const context = Context.create();

  context.message.$from();

  installFeature(bot);

  testFn(context);
  t.regex(
    context.reply.getCall(0).args[0],
    new RegExp(`${context.message.from.first_name}`),
  );
});

test('/start not reply in supergroup', async (t) => {
  let testFn = null;
  const bot = {
    command(cmd, fn) {
      t.is(cmd, 'start', 'command is start');
      t.true(typeof fn === 'function', 'callback is function');
      testFn = fn;
    },
  };
  const context = Context.create();

  context.message.$from();
  context.chat.$type('supergroup');

  installFeature(bot);

  testFn(context);
  t.true(context.reply.notCalled);
});

test('/start not reply in group', async (t) => {
  let testFn = null;
  const bot = {
    command(cmd, fn) {
      t.is(cmd, 'start', 'command is start');
      t.true(typeof fn === 'function', 'callback is function');
      testFn = fn;
    },
  };
  const context = Context.create();

  context.message.$from();
  context.chat.$type('group');

  installFeature(bot);

  testFn(context);
  t.true(context.reply.notCalled);
});

test('/start not reply in channel', async (t) => {
  let testFn = null;
  const bot = {
    command(cmd, fn) {
      t.is(cmd, 'start', 'command is start');
      t.true(typeof fn === 'function', 'callback is function');
      testFn = fn;
    },
  };
  const context = Context.create();

  context.message.$from();
  context.chat.$type('channel');

  installFeature(bot);

  testFn(context);
  t.true(context.reply.notCalled);
});
