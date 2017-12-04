const sinon = require('sinon')
const faker = require('faker')


const ID_USER_START = 10000
const ID_MESSAGE_START = 1000000
const ID_CHAT_START = 1000

let ID_USER = ID_USER_START
let ID_MESSAGE = ID_MESSAGE_START
let ID_CHAT = ID_CHAT_START


/* eslint-disable class-methods-use-this */

class User {
  constructor() {
    this.id = ++ID_USER
    this.is_bot = false
    this.first_name = faker.name.firstName()
    this.last_name = faker.name.lastName()
    this.username = faker.internet.userName(this.first_name, this.last_name)
  }
}

class Chat {
  constructor() {
    this.id = ++ID_CHAT
    this.type = 'private'
  }

  /**
   *
   * @param {'private'|'group'|'supergroup'|'channel'} type
   */
  $type(type) {
    this.type = type
    return this
  }

  /**
   *
   * @param {string} title
   */
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

  $from() {
    this.from = new User()
  }
}

class Context {
  static create() {
    return new this()
  }

  constructor() {
    this.message = new Message()

    this.reply = sinon.stub().resolves()
  }

  get from() {
    return this.message.from
  }

  get chat() {
    return this.message.chat
  }
}

module.exports = {
  Context,
  Message,
  Chat,
}
