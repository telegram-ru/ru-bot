const Ajv = require('ajv')
const schema = require('../../chatlist.schema')


const ajv = new Ajv()
const validate = ajv.compile(schema)

class InvalidChatlistError extends TypeError {
  constructor(message, errors) {
    super(message)
    this.name = 'InvalidChatlistError'
    this.stack = errors.reverse()
      .map(error => `${error.dataPath} ${error.message}`)
      .join('\n')
  }
}


function validateChatList(list) {
  if (!validate(list)) {
    throw new InvalidChatlistError('Invalid .chatlist.json file', validate.errors)
  }
}

/**
 * Convert object of chat id and chat options to chat options
 *
 * Important! Thit function must be in sync with chatlist.schema.json
 * @param {{}} list
 * @return {{}}
 */
function normalizeChatList(list) {
  return Object.keys(list).reduce((acc, name) => {
    // Convert { "ChatName": -11111 } to { "ChatName": { id: -11111, .... } }
    if (typeof list[name] === 'number') {
      acc[name] = {
        id: list[name],
        stickers: {
          remove: false,
          restrict: false,
        },
      }
    }
    else {
      acc[name] = list[name]
    }
    return acc
  }, {})
}

module.exports = {
  validateChatList,
  normalizeChatList,
  InvalidChatlistError,
}
