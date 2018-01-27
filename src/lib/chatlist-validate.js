const Ajv = require('ajv')
const schema = require('../../chatlist.schema')


const ajv = new Ajv()
const validate = ajv.compile(schema)

class InvalidChatlistError extends TypeError {
  constructor(message, errors) {
    super(message)
    this.name = 'InvalidChatlistError'
    this.stack = errors.reverse()
      .map((error) => `${error.dataPath} ${error.message}`)
      .join('\n')
  }
}

/**
 * Validates the chatlist
 *
 * @param {Object} list
 * @throws {InvalidChatlistError}
 * @return {bool|void}
 */
function validateChatList(list) {
  if (!validate(list)) {
    throw new InvalidChatlistError('Invalid .chatlist.json file', validate.errors)
  }
  return true
}

/**
 * Converts { "ChatName": -11111 } to { "ChatName": { id: -11111, .... } }
 * Important! Thit function must be in sync with chatlist.schema.json
 *
 * @param {Object} list
 * @return {Object}
 */
function normalizeChatList(list) {
  return Object.keys(list).reduce((acc, name) => {
    if (typeof list[name] === 'number') {
      acc[name] = {
        id: list[name],
        stickers: {
          remove: false,
          restrict: false,
          allowedStickerPacks: [],
        },
      }
      return acc
    }
    acc[name] = list[name]
    return acc
  }, {})
}

module.exports = {
  validateChatList,
  normalizeChatList,
  InvalidChatlistError,
}
