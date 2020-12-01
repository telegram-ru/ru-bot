import elasticsearch from 'elasticsearch';

let client = null;

function elasticPing() {
  console.log('elasticPing()');

  if (!client) {
    client = new elasticsearch.Client({
      host: 'elasticsearchd:9200',
      log: 'trace',
    });
  }

  return client.ping({ requestTimeout: 500 });
}

function push({ index, type, id, body }) {
  console.log('push(', { index, type, id }, ')');
  return client.create({ index, type, id, body });
}

export { client, push, elasticPing };
