import { getCollection } from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';


export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const clientId = url.searchParams.get('id');
  const collection = await (await getCollection('activities')).find({}).toArray();

  return NextResponse.json({ collection }, { status: 200 });
}