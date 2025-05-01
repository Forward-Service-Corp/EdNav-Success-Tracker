import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';

// import { postHandler } from '@/lib/api/postHandler';

// export async function POST(request) {
//   return postHandler(request, {
//     collectionName: 'activities',
//     idField: 'clientId',
//     relatedCollectionName: 'clients',
//     updateRelated: async (clientId, clients) => {
//       await clients.updateOne(
//         { _id: clientId },
//         { $set: { lastActivity: new Date().toISOString() } }
//       );
//     },
//     preprocess: (body) => ({
//       ...body,
//       timestamp: body.timestamp || new Date().toISOString(),
//     }),
//     validate: (body) => !!body.clientId && !!body.what,
//   });
// }

type PostHandlerOptions = {
  collectionName: string;
  idField: string; // e.g. "clientId"
  relatedCollectionName?: string; // e.g. "clients"
  updateRelated?: (id: string, db: any) => Promise<void>; // e.g. update client.lastActivity
  preprocess?: (payload: any) => any;
  validate?: (payload: any) => boolean;
};

export const postHandler = async (
  request: NextRequest,
  {
    collectionName,
    idField,
    relatedCollectionName,
    updateRelated,
    preprocess,
    validate
  }: PostHandlerOptions
) => {
  try {
    const body = await request.json();
    const id = body[idField];

    if (!id) {
      return NextResponse.json({ error: `Missing ${idField}` }, { status: 400 });
    }

    if (validate && !validate(body)) {
      return NextResponse.json({ error: 'Payload validation failed' }, { status: 400 });
    }

    const collection = await getCollection(collectionName);
    const payload = preprocess ? preprocess(body) : body;

    const finalPayload = {
      ...payload,
      createdAt: new Date().toISOString()
    };

    const result = await collection.insertOne(finalPayload);

    // Optionally update related records
    if (relatedCollectionName && updateRelated) {
      const relatedCollection = await getCollection(relatedCollectionName);
      await updateRelated(id, relatedCollection);
    }

    return NextResponse.json({ success: true, results: result }, { status: 201 });
  } catch (error) {
    console.error(`POST handler error in ${collectionName}:`, error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
};