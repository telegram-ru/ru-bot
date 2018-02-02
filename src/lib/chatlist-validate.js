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
 * @return {boolean}
 */
function validateChatList(list) {
  if (!validate(list)) {
    throw new InvalidChatlistError('Invalid .chatlist.json file', validate.errors)
  }

  return true
}

/**
 * Important! Thit function must be in sync with chatlist.schema.json
 *
 * @param {{ [string]: number }} list
 * @return {{ [string]: { id: number } }}
 */
function normalizeChatList(list) {
  return Object.keys(list).reduce((acc, name) => {
    acc[name] = typeof list[name] === 'number' ? {
      id: list[name],
      stickers: { remove: false, restrict: false, allowed: [] },
    } : list[name]

    return acc
  }, {})
}

module.exports = { validateChatList, normalizeChatList, InvalidChatlistError }
