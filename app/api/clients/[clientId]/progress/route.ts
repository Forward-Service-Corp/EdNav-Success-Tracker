import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { safeObjectId } from '@/lib/activities/utils';

export async function POST(request: NextRequest, response
: NextResponse, context: any) {
  const clientId = await context.params.get('clientId') || '';
  const { completedItems } = await request.json();

  if (!Array.isArray(completedItems)) {
    return NextResponse.json({ error: 'Invalid format for completedItems' }, { status: 400 });
  }

  try {
    const clients = await getCollection('clients');
    const updates: Record<string, boolean> = {};
    completedItems.forEach((item) => {
      updates[`progress.${item}`] = true;
    });

    await clients.updateOne(
      // @ts-expect-error: _id is a string, not ObjectId
      { _id: safeObjectId(clientId) },
      {
        $set: {
          ...updates,
          lastActivity: new Date().toISOString()
        },
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving client progress:', error);
    return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 });
  }
}