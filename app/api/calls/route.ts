import { MongoClient } from 'mongodb';

const mongoUri = process.env.MONGODB_URI || '';

export async function GET() {
  try {
    if (!mongoUri) {
      return Response.json([], { status: 200 });
    }

    const client = new MongoClient(mongoUri);
    await client.connect();
    const db = client.db('sandbox');
    const calls = await db.collection('api_calls')
      .find({})
      .sort({ timestamp: -1 })
      .limit(100)
      .toArray();
    await client.close();

    return Response.json(calls);
  } catch (error) {
    console.error('API calls error:', error);
    return Response.json([], { status: 200 });
  }
}
