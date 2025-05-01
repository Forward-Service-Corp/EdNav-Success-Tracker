import { ObjectId } from 'mongodb';
import { getCollection } from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';

// Change the function name to match the HTTP method you want to handle
export async function PATCH(request: NextRequest) {

  const url = new URL(request.url);
  const id = url.searchParams.get('id') || '';

  // Next.js App Router handles the body differently
  const trackable = await request.json();

  if (!trackable || !trackable.items) {
    return NextResponse.json({ message: 'Trackable items missing in body' }, { status: 400 });
  }

  try {
    const clientsCollection = await getCollection('clients');
    const result = await clientsCollection.updateOne(
      { _id: new ObjectId(id) }, // Use constructor, not createFromBase64
      { $set: { 'trackable.items': trackable.items } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: 'Client not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Trackable progress updated successfully',
      modifiedCount: result.modifiedCount,
      matchedCount: result.matchedCount,
      upsertedCount: result.upsertedCount,
      upsertedId: result.upsertedId
    }, { status: 200 });

  } catch (error) {
    console.error('Error updating trackable progress:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}