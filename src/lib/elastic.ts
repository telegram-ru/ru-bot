import { Client } from '@elastic/elasticsearch';
import { environment } from '../config';

let client: Client;

function elasticPing() {
  if (!client) {
    client = new Client({ node: environment.ELASTICSEARCH_URL });
  }

  return client.ping({}, { requestTimeout: 500 });
}

async function push(id: string, body: unknown): Promise<void> {
  const date = new Date();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const index = `rubot-${environment.NODE_ENV || 'undefined'}-${year}-${month}`;
  console.log('push(', { id }, ')');
  await client.create({ index, id, body });
}

export { client, push, elasticPing };
