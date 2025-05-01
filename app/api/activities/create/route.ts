// app/api/activities/create/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { safeObjectId } from '@/lib/safeObjectId';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { id, payload } = await body;

  const collection = await getCollection('activities');
  const result = await collection
    .insertOne(
      { _id: safeObjectId(id), body: payload }
    );

  return NextResponse.json({ result }, { status: 200 });
}