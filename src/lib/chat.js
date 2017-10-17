const debug = require('debug')('rubot:lib:chat')
const { GroupBase } = require('./group-base')


class Chat extends GroupBase {
  /**
   * @dummy
   * @param {number} stickerId
   */
  sendSticker(stickerId) {
    debug(`sendSticker(${stickerId})`)
    this.tg.sendMessage(this.id, `Foo${stickerId}`)
  }
}

module.exports = {
  Chat,
}
