import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET all notes
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const clientId = url.searchParams.get('clientId') || '';

  try {
    const collection = await getCollection('notes');

    const res = await collection.find({ clientId: clientId }).toArray();

    return NextResponse.json(res, { status: 200 });
  } catch (error) {
    console.error('Error fetching notes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notes' },
      { status: 500 }
    );
  }
}

// POST to add a new comment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Support both a nested 'comment' object and flat structure
    const noteData = body.note || body;

    if (!noteData) {
      return NextResponse.json(
        { error: 'Comment data is required' },
        { status: 400 }
      );
    }

    const collection = await getCollection('notes');
    const clientsCollection = await getCollection('clients');

    // Ensure required fields are present
    if (!noteData.noteContent) {
      return NextResponse.json(
        { error: 'Comment content is required' },
        { status: 400 }
      );
    }

    if (!noteData.clientId) {
      return NextResponse.json(
        { error: 'Client ID is required' },
        { status: 400 }
      );
    }

    // Prepare the note object for database insertion
    const noteToInsert = {
      ...noteData,
      createdAt: noteData.createdAt || new Date().toISOString(),
      isComment: true
    };

    // Make sure clientId is stored as a string for consistent querying
    if (noteData.clientId) {
      noteToInsert.clientId = noteData.clientId.toString();
    }

    const result = await collection.insertOne(noteToInsert);

    // Update client's last activity
    try {
      // Convert string ID to ObjectId
      const clientObjectId = ObjectId.createFromBase64(noteData.clientId);

      await clientsCollection.updateOne(
        { _id: clientObjectId },
        { $set: { lastActivity: new Date().toISOString() } }
      );
    } catch (error) {
      console.error('Error updating client last activity:', error);
      // Continue even if this fails - it's not critical
    }

    return NextResponse.json(
      {
        message: 'Comment added successfully',
        _id: result.insertedId,
        note: noteToInsert
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding note:', error);
    return NextResponse.json(
      { error: 'Failed to add note' },
      { status: 500 }
    );
  }
}
