import { MongoClient } from 'mongodb';
import * as Sentry from '@sentry/node';
import { environment, MONGODB_URL } from '../config';

// Create a new MongoClient
const client = new MongoClient(MONGODB_URL);

async function init() {
  try {
    // Connect the client to the server
    await client.connect();
    // Establish and verify connection
    await client.db('admin').command({ ping: 1 });
  } catch (error) {
    console.error(error);
    Sentry.captureException(error, { tags: { type: 'mongodb' } });
    process.exit(1);
  }
}

interface ElasticMessage<Message> {
  _index: string;
  _type: '_doc';
  _id: string;
  _score: 1;
  _source: Message;
}

async function push(id: string, body: unknown) {
  const date = new Date();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const index = `rubot-${environment.NODE_ENV || 'undefined'}-${year}-${month}`;
  await client
    .db('rubot')
    .collection<ElasticMessage<unknown>>('messages')
    .insertOne({
      _id: id,
      _index: index,
      _score: 1,
      _type: '_doc',
      _source: body,
    });
}

export { init, push };
