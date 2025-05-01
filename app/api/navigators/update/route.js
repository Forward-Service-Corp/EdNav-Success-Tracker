// app/api/clients/update/route.js

import { getCollection } from '../../../../lib/mongodb';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const url = await new URL(request.url);
  const clientId = url.searchParams.get('clientId');
  const navigatorId = url.searchParams.get('navigatorId');
  try {

    const collection = await getCollection('users');
    const navigatorRecord = await collection.findOne({ name: navigatorId });

    if (!navigatorRecord) {
      return NextResponse.json({ error: 'Navigator not found' }, { status: 404 });
    }

    const pinnedArray = navigatorRecord.pinned || [];
    const alreadyPinned = pinnedArray.includes(clientId);

    const updateAction = alreadyPinned
      ? { $pull: { pinned: clientId } }
      : { $push: { pinned: clientId } };

    const result = await collection.updateOne({ name: navigatorId }, updateAction);
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }
    const navigator = await collection.findOne({ name: navigatorId });
    return NextResponse.json({ navigator }, { status: 200 });

  } catch (error) {
    console.error('Error adding/updating client:', error);
    return NextResponse.json({ error: 'Failed to add/update client' }, { status: 500 });
  }
}