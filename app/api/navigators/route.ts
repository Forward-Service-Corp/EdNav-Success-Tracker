import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET all navigators
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const navigatorId = url.searchParams.get('navigatorId') || '';
  try {
    if (navigatorId) {
      const collection = await getCollection('users');
      const navigator = await collection.findOne({ _id: ObjectId.createFromBase64(navigatorId) });
      return NextResponse.json(navigator, { status: 200 });
    }
    const collection = await getCollection('users');
    const navigators = await collection.find({}).toArray();
    return NextResponse.json(navigators, { status: 200 });
  } catch (e) {
    console.error('Error fetching navigators:', e);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}