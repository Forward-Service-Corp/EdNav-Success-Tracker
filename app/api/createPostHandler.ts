import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';

// import { createPostHandler } from '@/lib/api/createPostHandler';
//
// export const POST = createPostHandler({
//   collectionName: 'activities',
//   idField: 'clientId',
//   relatedCollectionName: 'clients',
//   updateRelated: async (clientId, clients) => {
//     await clients.updateOne(
//       { _id: clientId },
//       { $set: { lastActivity: new Date().toISOString() } }
//     );
//   },
//   preprocess: (body) => ({
//     ...body,
//     timestamp: body.timestamp || new Date().toISOString(),
//   }),
//   validate: (body) => !!body.clientId && !!body.what,
// });

type HandlerOptions = {
  collectionName: string;
  idField: string;
  relatedCollectionName?: string;
  updateRelated?: (id: string, db: any) => Promise<void>;
  preprocess?: (payload: any) => any;
  validate?: (payload: any) => boolean;
};

export const createPostHandler = ({
                                    collectionName,
                                    idField,
                                    relatedCollectionName,
                                    updateRelated,
                                    preprocess,
                                    validate
                                  }: HandlerOptions) => {
  return async function POST(request: NextRequest) {
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

      const document = {
        ...payload,
        createdAt: new Date().toISOString()
      };

      const result = await collection.insertOne(document);

      if (relatedCollectionName && updateRelated) {
        const relatedCollection = await getCollection(relatedCollectionName);
        await updateRelated(id, relatedCollection);
      }

      return NextResponse.json({ success: true, results: result }, { status: 201 });
    } catch (error) {
      console.error(`[${collectionName}] POST error:`, error);
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Unknown error' },
        { status: 500 }
      );
    }
  };
};