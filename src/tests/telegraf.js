const sinon = require('sinon')


const ID_MESSAGE_START = 1000000
const ID_CHAT_START = 1000

let ID_MESSAGE = ID_MESSAGE_START
let ID_CHAT = ID_CHAT_START

class Chat {
  constructor() {
    this.id = ++ID_CHAT
    this.type = 'private'
  }

  $type(type) {
    this.type = type
    return this
  }

  $title(title) {
    this.title = title
    return this
  }
}

class Message {
  constructor() {
    this.message_id = ++ID_MESSAGE
    this.date = Date.now()
    this.chat = new Chat()
  }
}

class Context {
  static create() {
    return new this()
  }

  constructor() {
    this.message = new Message()
    this.chat = this.message.chat

    this.reply = sinon.stub().resolves()
  }
}

module.exports = {
  Context,
  Message,
  Chat,
}
