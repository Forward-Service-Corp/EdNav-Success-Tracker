import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';

// GET all notes
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const clientId = url.searchParams.get('clientId') || '';
  const activityId = url.searchParams.get('activityId') || '';

  let notes: any[] = [];
  try {
    const collection = await getCollection('notes');

    // Filter by clientId if provided
    if (clientId && !activityId) {
      console.log('Fetching notes for clientId:', clientId);
      try {
        // Try to convert to ObjectId if it's a valid format
        const query = { clientId: clientId };
        notes = await collection
          .find(query)
          .sort({ createdAt: -1 })
          .toArray();

        console.log(`Found ${notes.length} notes for client ${clientId}`);
      } catch (err) {
        console.error('Error processing clientId:', err);
        // Fallback to string comparison if ObjectId conversion fails
        notes = await collection
          .find({ clientId: clientId })
          .sort({ createdAt: -1 })
          .toArray();
      }
    }
    // Filter by activityId if provided
    else if (activityId) {
      notes = await collection
        .find({ activityId })
        .sort({ createdAt: -1 })
        .toArray();
    }
    // No filters, return all notes
    else {
      notes = await collection
        .find()
        .sort({ createdAt: -1 })
        .toArray();
    }

    return NextResponse.json(notes, { status: 200 });
  } catch (error) {
    console.error('Error fetching notes:', error);
    return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 });
  }
}

// POST to add a new note
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Received note data:', body);

    // Support both nested 'note' object and flat structure
    const noteData = body.note || body;

    if (!noteData) {
      return NextResponse.json({ error: 'Note data is required' }, { status: 400 });
    }

    const collection = await getCollection('notes');

    // Ensure required fields are present
    if (!noteData.noteContent) {
      return NextResponse.json({ error: 'Note content is required' }, { status: 400 });
    }

    // Prepare the note object for database insertion
    const noteToInsert = {
      ...noteData,
      createdAt: noteData.createdAt || new Date().toISOString()
    };

    // Make sure clientId is stored as a string for consistent querying
    if (noteData.clientId) {
      noteToInsert.clientId = noteData.clientId.toString();
    }

    console.log('Inserting note:', noteToInsert);
    const result = await collection.insertOne(noteToInsert);
    console.log('Note inserted with ID:', result.insertedId);

    return NextResponse.json({
      message: 'Note added successfully',
      _id: result.insertedId,
      note: noteToInsert
    }, { status: 201 });
  } catch (error) {
    console.error('Error adding note:', error);
    return NextResponse.json({ error: 'Failed to add note' }, { status: 500 });
  }
}
