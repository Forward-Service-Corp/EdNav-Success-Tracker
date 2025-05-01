import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(
  request: NextRequest,
  { params }: { params: Record<string, string | string[]> }
) {
  const clientId = Array.isArray(params.clientId) ? params.clientId[0] : params.clientId;

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
      { _id: new ObjectId(clientId) },
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