import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { safeObjectId } from '@/lib/safeObjectId';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { clientId, section } = await body;

  const clientsCollection = await getCollection('clients');

  const client = await clientsCollection.findOne({ _id: safeObjectId(clientId) });

  if (!client) {
    return NextResponse.json({ error: 'Client not found' }, { status: 404 });

  }
  const response = await clientsCollection.updateOne(
    { _id: safeObjectId(clientId) },
    {
      $set: { [`${section}.referralDate`]: body.referralDate }
    });
  return NextResponse.json({ response }, { status: 201 });
}