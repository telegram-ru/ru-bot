
module.exports = {
  up: (queryInterface) => Promise.resolve()
    .then(() => queryInterface.addIndex('messages', { fields: ['chatId', 'authorId'] }))
    .then(() => queryInterface.addIndex('messages', { fields: ['chatId'] }))
    .then(() => queryInterface.addIndex('messages', { fields: ['authorId'] })),

  down: (queryInterface) => Promise.resolve()
    .then(() => queryInterface.removeIndex('messages', 'messages_author_id'))
    .then(() => queryInterface.removeIndex('messages', 'messages_chat_id'))
    .then(() => queryInterface.removeIndex('messages', 'messages_chat_id_author_id')),
}
