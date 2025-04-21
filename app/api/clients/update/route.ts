import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET all notes
export async function GET(request: NextRequest) {

}

// POST to add a new note
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body) {
      return NextResponse.json({ error: 'Update is required' }, { status: 400 });
    }

    const collection = await getCollection('clients');
    const userToUpdate = await collection.updateOne({ _id: new ObjectId(body._id) }, { $set: body.data });

    return NextResponse.json({ message: 'Note added successfully', userToUpdate }, { status: 201 });
  } catch (error) {
    console.error('Error adding note:', error);
    return NextResponse.json({ error: 'Failed to add note' }, { status: 500 });
  }
}
