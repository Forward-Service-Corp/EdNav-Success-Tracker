import { type NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const clientId = url.searchParams.get('clientId');
  try {
    const actionsCollection = await getCollection("actions")
    const notesCollection = await getCollection("notes")
    const actionRes = await actionsCollection.aggregate([
      { $match: { clientId } },
      {
        $sort: { count: -1 }
      }
    ]).toArray();
    const notesRes = await notesCollection.aggregate([
      { $match: { clientId } },
      {
        $group: {
          _id: '$activityId',
          records: { $push: '$$ROOT' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]).toArray()

    return NextResponse.json({ success: true, data: actionRes, notesRes }, { status: 200 });
  } catch (error) {
    console.error('Aggregation error:', error);
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'An unknown error occurred' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const actionsCollection = await getCollection("actions")
    const clientsCollection = await getCollection("clients")
    const notesCollection = await getCollection("notes")
    const commentsCollection = await getCollection('comments');

    if (!body.createdAt) {
      body.createdAt = new Date().toISOString()
    }
    // Handle direct note submissions (where isNote is true at the top level)
    if (body.isNote) {

      try {
        const clientId = body.clientId;
        if (!clientId) {
          return NextResponse.json({ error: 'Missing clientId for note' }, { status: 400 });
        }

        // Convert string ID to ObjectId if needed
        const clientObjectId = typeof clientId === 'string' ? new ObjectId(clientId) : clientId;

        // Find the client
        const client = await clientsCollection.findOne({ _id: clientObjectId });
        if (!client) {
          return NextResponse.json({ error: 'Client not found' }, { status: 404 });
        }

        // Create the note document
        const noteDoc = {
          noteContent: body.noteContent,
          noteAuthor: body.noteAuthor,
          createdAt: body.createdAt || new Date().toISOString(),
          clientId: clientId,
          isNote: true
        };

        // Insert the note
        const insertResult = await notesCollection.insertOne(noteDoc);

        // Update client's last activity
        await clientsCollection.updateOne(
          { _id: clientObjectId },
          { $set: { lastActivity: new Date().toISOString() } }
        );

        // Get an updated notes list
        const notes = await notesCollection.find({ clientId }).sort({ createdAt: -1 }).toArray();

        return NextResponse.json({
          message: 'Note added successfully',
          insertedId: insertResult.insertedId,
          client,
          notes
        }, { status: 201 });
      } catch (error) {
        console.error('Error saving note:', error);
        return NextResponse.json({ error: 'Failed to save note' }, { status: 500 });
      }
    }

    // Handle nested note object (legacy format)
    if (body.note && body.note.isNote) {
      try {
        const clientId = body.note.clientId;
        const client = await clientsCollection.findOne({ _id: new ObjectId(clientId) });

        if (client) {
          await notesCollection.insertOne(body.note);
          await clientsCollection.updateOne(
            { _id: new ObjectId(clientId) },
            { $set: { lastActivity: new Date().toISOString() } }
          );

          // Get an updated notes list
          const notes = await notesCollection.find({ clientId }).sort({ createdAt: -1 }).toArray();

          return NextResponse.json({
            message: 'Note added successfully',
            client,
            notes
          }, { status: 201 });
        } else {
          return NextResponse.json({ error: 'Client not found' }, { status: 404 });
        }
      } catch (error) {
        console.error('Error saving note with nested format:', error);
        return NextResponse.json({ error: 'Failed to save note' }, { status: 500 });
      }
    }

    // COMMENT SECTION
    if (body.comment && body.comment.isComment) {
      try {
        const clientId = body.clientId;
        if (!clientId) {
          return NextResponse.json({ error: 'Missing clientId for comment' }, { status: 400 });
        }

        // Convert string ID to ObjectId if needed
        const clientObjectId = typeof clientId === 'string' ? new ObjectId(clientId) : clientId;

        // Find the client
        const client = await clientsCollection.findOne({ _id: clientObjectId });
        if (!client) {
          return NextResponse.json({ error: 'Client not found' }, { status: 404 });
        }

        // Create the comment document
        const commentDoc = {
          commentContent: body.commentContent,
          commentAuthor: body.commentAuthor,
          createdAt: body.createdAt || new Date().toISOString(),
          clientId: clientId,
          isComment: true
        };

        // Insert the comment
        const insertResult = await commentsCollection.insertOne(commentDoc);

        // Update client's last activity
        await clientsCollection.updateOne(
          { _id: clientObjectId },
          { $set: { lastActivity: new Date().toISOString() } }
        );

        // Get an updated comments list
        const comments = await commentsCollection.find({ clientId }).sort({ createdAt: -1 }).toArray();

        return NextResponse.json({
          message: 'Note added successfully',
          insertedId: insertResult.insertedId,
          client,
          comments
        }, { status: 201 });
      } catch (error) {
        console.error('Error saving comment:', error);
        return NextResponse.json({ error: 'Failed to save comment' }, { status: 500 });
      }
    }

    if (body.path && body.path.length && body.path?.includes('graduated') && body.path?.includes('inactive')) {
      const [client] = await Promise.all([clientsCollection.findOne({ _id: new ObjectId(body.clientId) })]);
      if (client && client.group.toString().toLocaleLowerCase() === 'youth') {
        await clientsCollection.updateOne({ _id: new ObjectId(body.clientId) }, {
          $set: {
            clientStatus: 'graduated',
            lastActivity: new Date().toISOString()
          }
        });
        return NextResponse.json({ message: 'Action added successfully', client }, { status: 201 });
      }
      if (client && client.group.toString().toLocaleLowerCase() === 'adult') {
        await clientsCollection.updateOne({ _id: new ObjectId(body.clientId) }, {
          $set: {
            clientStatus: 'inactive',
            lastActivity: new Date().toISOString()
          }
        });
        return NextResponse.json({ message: 'Action added successfully', client }, { status: 201 });
      }
    }
    if (body.path?.includes('enrolled in')) {
      const client = await clientsCollection.findOne({ _id: new ObjectId(body.clientId) });
      if (client) {
        await clientsCollection.updateOne({ _id: new ObjectId(body.clientId) }, {
          $set: {
            clientStatus: 'active',
            lastActivity: new Date().toISOString()
          }
        });
        return NextResponse.json({ message: 'Action added successfully', client }, { status: 201 });
      }
    }
    if (body.path?.includes('graduated') || body.path?.includes('inactive')) {
      const client = await clientsCollection.findOne({_id: new ObjectId(body.clientId)})
      if (client) {
        await clientsCollection.updateOne({ _id: new ObjectId(body.clientId) }, {
          $set: {
            clientStatus: 'inactive',
            lastActivity: new Date().toISOString()
          }
        });
        return NextResponse.json({ message: 'Action added successfully', client }, { status: 201 });
      }
    }
    const query = { _id: new ObjectId(body.clientId) }
    let user
    user = await clientsCollection.updateOne(query, { $set: { lastActivity: new Date().toISOString() } })
    if (body.trackable) {
       user = await clientsCollection.updateOne(
         query,
         {
           $set:
             {
               trackable: body.trackable,
             }
         }
       )
    }
    if (body.trackable?.items?.some((item: { name: string; completed: boolean }) => item.name.toLowerCase() === "orientation" && item.completed)) {
      user = await clientsCollection.updateOne(
        query,
        {
          $set:
            {
              orientation: { referralDate: new Date().toISOString(), completionDate: null }
            }
        }
      )
    }
    if (body.trackable?.items?.some((item: { name: string; completed: boolean }) => item.name.toLowerCase() === "tabe" && item.completed)) {
      user = await clientsCollection.updateOne(
        query,
        {
          $set:
            {
              tabe: { referralDate: new Date().toISOString(), completionDate: null }
            }
        }
      )
    }
    if (body.trackable?.items?.some((item: {
      name: string;
      completed: boolean
    }) => item.name.toLowerCase() === 'hs transcript' && item.completed)) {
      user = await clientsCollection.updateOne(
        query,
        {
          $set:
            {
              transcripts: { referralDate: new Date().toISOString(), completionDate: null }
            }
        }
      );
    }

    const result = await actionsCollection.insertOne(body)
    const userActions = await actionsCollection.find({ clientId: body.clientId }).sort({ createdAt: -1 }).toArray()
    const comments = await notesCollection.find({ clientId: body.clientId }).sort({ createdAt: -1 }).toArray();
    const wholeUser = await clientsCollection.findOne({_id: new ObjectId(body.clientId)})

    return NextResponse.json({
      message: 'Action added successfully',
      wholeUser,
      userActions,
      comments,
      _id: result,
      user
    }, { status: 201 });
  } catch (error) {
    console.error("Error adding action:", error)
    return NextResponse.json({ error: "Failed to add action" }, { status: 500 })
  }
}
