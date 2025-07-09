import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET all feps
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const fepId = url.searchParams.get('fepId') || '';
  try {
    if (fepId) {
      const collection = await getCollection('feps');
      const fep = await collection.findOne({ _id: ObjectId.createFromBase64(fepId) });
      return NextResponse.json(fep, { status: 200 });
    }
    const collection = await getCollection('feps');
    const feps = await collection.find({}).toArray();
    return NextResponse.json(feps, { status: 200 });
  } catch (e) {
    console.error('Error fetching feps:', e);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}