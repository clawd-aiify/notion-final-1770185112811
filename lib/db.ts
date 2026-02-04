import { MongoClient } from 'mongodb';

const mongoUri = process.env.MONGODB_URI || '';

if (!mongoUri) {
  throw new Error('MONGODB_URI environment variable is required');
}

export async function getDb() {
  const client = new MongoClient(mongoUri);
  await client.connect();
  return {
    client,
    db: client.db('sandbox'),
  };
}
