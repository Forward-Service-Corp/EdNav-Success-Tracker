// app/api/clients/update/route.js

import { getCollection } from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const url = await new URL(request.url);
  const clientId = url.searchParams.get('clientId');
  const trackable = url.searchParams.get('trackable');
  try {
    const body = await request.json(); // Correctly parse request body
    const collection = await getCollection('clients');
    const activities = await getCollection('actions');
    if (clientId) {
      if (trackable) {
        const { completed, name } = body;
        if (name === 'transcripts' || name === 'tabe' || name === 'orientation') {
          await collection.updateOne(
            { _id: new ObjectId(clientId) },
            // {
            //   $set: {
            //     [name]: {
            //       completed: completed,
            //       createdAt: new Date().toISOString(),
            //       name
            //     }
            //   }
            // },
            {
              $set: {
                [`trackable.items.${trackable}`]: {
                  completed: completed,
                  createdAt: new Date().toISOString(),
                  name
                }
              }
            });
        }


        await collection.updateOne(
          { _id: new ObjectId(clientId) },
          {
            $set: {
              [`trackable.items.${trackable}`]: {
                completed: completed,
                createdAt: new Date().toISOString(),
                name
              }
            }
          });
      }
      const { _id, ...updateData } = body;
      const activity = await activities.insertOne({ body });
      const result = await collection.updateOne(
        { _id: new ObjectId(_id ?? clientId) },
        { $set: updateData }
      );

      if (result.matchedCount === 0) {
        return NextResponse.json({ error: 'Client not found' }, { status: 404 });
      }
      const client = await collection.findOne({ _id: new ObjectId(_id ?? clientId) });
      return NextResponse.json({ client }, { status: 200 });
    }

  } catch (error) {
    console.error('Error adding/updating client:', error);
    return NextResponse.json({ error: 'Failed to add/update client' }, { status: 500 });
  }
}