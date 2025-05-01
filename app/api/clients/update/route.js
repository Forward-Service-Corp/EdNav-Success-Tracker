// app/api/clients/update/route.js

import { getCollection } from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const url = await new URL(request.url);
  const clientId = await url.searchParams;
  try {
    const body = await request.json(); // Correctly parse request body
    const collection = await getCollection('clients');

    if (clientId) {
      const { _id, ...updateData } = body;
      const result = await collection.updateOne(
        { _id: new ObjectId(_id.toString() || clientId.toString() || '') },
        { $set: updateData }
      );

      if (result.matchedCount === 0) {
        return NextResponse.json({ error: 'Client not found' }, { status: 404 });
      }

      return NextResponse.json({ message: 'Client updated successfully', _id: clientId, result }, { status: 200 });
    }

  } catch (error) {
    console.error('Error adding/updating client:', error);
    return NextResponse.json({ error: 'Failed to add/update client' }, { status: 500 });
  }
}