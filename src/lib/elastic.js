const debug = require('debug')('rubot:lib:elastic')
const elasticsearch = require('elasticsearch')


let client = null

function elasticPing() {
  debug('elasticPing()')

  if (!client) {
    client = new elasticsearch.Client({
      host: 'localhost:9200',
      log: 'trace',
    })
  }

  return new Promise((resolve, reject) => {
    client.ping({ requestTimeout: 500 }, (error) => {
      if (error) {
        return reject(error)
      }
      return resolve()
    })
  })
}


function push({ index, type, id, body }) {
  debug('push(', { index, type, id }, ')')
  return new Promise((resolve, reject) => {
    client.create({ index, type, id, body }, (error, response) => {
      if (error) reject(error)
      else resolve(response)
    })
  })
}

module.exports = {
  client,
  push,
  elasticPing,
}
