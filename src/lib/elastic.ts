import { Client } from '@elastic/elasticsearch';

let client: Client;

function elasticPing() {
  if (!client) {
    client = new Client({ node: 'elasticsearch:9200' });
  }

  return client.ping({}, { requestTimeout: 500 });
}

function push({ index, type, id, body }) {
  console.log('push(', { index, type, id }, ')');
  return client.create({ index, type, id, body });
}

export { client, push, elasticPing };
