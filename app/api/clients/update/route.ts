import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET all notes
// export async function GET(request: NextRequest) {
//
// }

// POST to add a new note
export async function POST(request: NextRequest) {
  try {
    const [body] = await Promise.all([request.json()]);

    if (!body) {
      return NextResponse.json({ error: 'Update info is required' }, { status: 400 });
    }
    const id = body._id.toString();
    const collection = await getCollection('clients');
    const userToUpdate = await collection.updateOne({ _id: new ObjectId(id) }, { $set: body.data });
    if (!userToUpdate) {
      throw new Error('Client not found');
    }
    const user = await collection.findOne({ _id: new ObjectId(id) });
    return NextResponse.json({ message: 'Client added successfully', user }, { status: 201 });
  } catch (error) {
    console.error('Error adding note:', error);
    return NextResponse.json({ error: 'Failed to update client' }, { status: 500 });
  }
}
