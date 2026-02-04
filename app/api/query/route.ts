import { MongoClient } from 'mongodb';
import { nanoid } from 'nanoid';

const mongoUri = process.env.MONGODB_URI || '';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Generate mock response (works without MongoDB)
    const response = {
      id: nanoid(),
      query: body,
      timestamp: new Date().toISOString(),
    };

    // Log API call to MongoDB if configured
    if (mongoUri) {
      try {
        const client = new MongoClient(mongoUri);
        await client.connect();
        const db = client.db('sandbox');
        
        await db.collection('api_calls').insertOne({
          endpoint: '/api/query',
          method: 'POST',
          request: body,
          response,
          timestamp: new Date().toISOString(),
        });
        
        await client.close();
      } catch (dbError) {
        console.error('MongoDB logging error:', dbError);
        // Continue - API works even if logging fails
      }
    }

    return Response.json(response);
  } catch (error) {
    return Response.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    if (!mongoUri) {
      return Response.json({ calls: [] });
    }

    const client = new MongoClient(mongoUri);
    await client.connect();
    const db = client.db('sandbox');

    const calls = await db.collection('api_calls')
      .find({ endpoint: '/api/query' })
      .sort({ timestamp: -1 })
      .toArray();

    await client.close();

    return Response.json({ calls });
  } catch (error) {
    console.error('GET calls error:', error);
    return Response.json({ calls: [] });
  }
}
