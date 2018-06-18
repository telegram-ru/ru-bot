import test from 'ava'
import { reconstructMarkdown } from './entities'


const example = {
  update_id: 405765932,
  callback_query: {
    id: '139719094262048174',
    from: {
      id: 32530886,
      is_bot: false,
      first_name: 'pub fn🦉() {',
      username: 'sergeysova',
      language_code: 'en-RU',
    },
    message: {
      message_id: 69,
      chat: {
        id: -1001362214788,
        title: '[dev] RuBot Logs Channel',
        type: 'channel',
      },
      date: 1529349458,
      edit_date: 1529349458,
      text: '#бан #ban\nЮзер:     🐊 #359667015\nПричина:  спам_\nАдмин:    pub fn🦉() {\nЧат:      private dev RuBotGroup\nЧаты:',
      entities: [
        {
          offset: 0,
          length: 4,
          type: 'hashtag',
        },
        {
          offset: 5,
          length: 4,
          type: 'hashtag',
        },
        {
          offset: 10,
          length: 10,
          type: 'code',
        },
        {
          offset: 20,
          length: 13,
          type: 'text_mention',
          user: {
            id: 359667015,
            is_bot: false,
            first_name: '🐊',
            username: 'scroco',
          },
        },
        {
          offset: 34,
          length: 10,
          type: 'code',
        },
        {
          offset: 50,
          length: 10,
          type: 'code',
        },
        {
          offset: 60,
          length: 12,
          type: 'text_mention',
          user: {
            id: 32530886,
            is_bot: false,
            first_name: 'pub fn🦉() {',
            username: 'sergeysova',
            language_code: 'en-RU',
          },
        },
        {
          offset: 73,
          length: 10,
          type: 'code',
        },
        {
          offset: 83,
          length: 7,
          type: 'italic',
        },
        {
          offset: 106,
          length: 5,
          type: 'code',
        },
      ],
    },
    chat_instance: '-2641442072145092576',
    data: 'unspam_user 359667015',
  },
}

const raw = `#бан #ban
\`Юзер:     \`[🐊 #359667015](tg://user?id=359667015)
\`Причина:  \`спам_
\`Админ:    \`[pub fn🦉() {](tg://user?id=32530886)
\`Чат:      \`_private_ dev RuBotGroup
\`Чаты:\``

test('simple test', (t) => {
  t.is(reconstructMarkdown(example.callback_query.message), raw)
})
