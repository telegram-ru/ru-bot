const debug = require('debug')('rubot:lib:elastic')
const elasticsearch = require('elasticsearch')


let client = null

function elasticPing() {
  debug('elasticPing()')

  if (!client) {
    client = new elasticsearch.Client({
      host: 'es:9200',
      log: 'trace',
    })
  }

  return client.ping({ requestTimeout: 500 })
}

function push({ index, type, id, body }) {
  debug('push(', { index, type, id }, ')')
  return client.create({ index, type, id, body })
}

module.exports = {
  client,
  push,
  elasticPing,
}
