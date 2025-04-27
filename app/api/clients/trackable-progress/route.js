import { ObjectId } from 'mongodb';
import { getCollection } from '../../../../lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';
// import { NextResponse } from 'next/server';

export default async function POST(request: NextRequest) {
  if (request.method !== 'PATCH') {
    return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
  }

  const url = new URL(request.url);
  const id = url.searchParams.get('id') || '';
  const { trackable } = await request.body;

  if (!trackable || !trackable.items) {
    return NextResponse.json({ message: 'Trackable items missing in body' }, { status: 400 });
  }

  try {
    const clientsCollection = await getCollection('clients');
    const result = await clientsCollection.updateOne({ _id: ObjectId.createFromBase64(id) }, { $set: { 'trackable.items': trackable.items } });

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: 'Client not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Trackable progress updated successfully',
      modifiedCount: result.modifiedCount,
      matchedCount: result.matchedCount,
      upsertedCount: result.upsertedCount,
      upsertedId: result.upsertedId,
      result
    }, { status: 200 });

  } catch (error) {
    console.error('Error updating trackable progress:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}