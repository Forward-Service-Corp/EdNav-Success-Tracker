// app/api/comments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  console.log('==== COMMENTS GET REQUEST STARTED ====');
  const url = new URL(request.url);
  const clientId = url.searchParams.get('clientId');

  if (!clientId) {
    console.error('Missing clientId parameter in GET request');
    return NextResponse.json({ error: 'Client ID is required' }, { status: 400 });
  }

  console.log('Fetching comments for client:', clientId);

  try {
    const commentsCollection = await getCollection('comments');

    // Try both as string and as ObjectId if possible
    let query: any = { clientId };

    // If clientId looks like an ObjectId, create a query that matches either format
    if (ObjectId.isValid(clientId)) {
      console.log('clientId is a valid ObjectId format, checking both formats');
      query = {
        $or: [
          { clientId },
          { clientId: new ObjectId(clientId) }
        ]
      };
    } else {
      console.log('clientId is not a valid ObjectId format, using as string');
    }

    console.log('Using query:', JSON.stringify(query));

    // Execute the query
    const comments = await commentsCollection
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    console.log(`Found ${comments.length} comments for client ${clientId}`);

    // Debug output for first few comments
    if (comments.length > 0) {
      console.log('First comment example:', {
        _id: comments[0]._id,
        parentId: comments[0].parentId,
        commentText: comments[0].commentText?.substring(0, 20) + '...'
      });
    }

    console.log('==== COMMENTS GET REQUEST COMPLETED SUCCESSFULLY ====');
    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    console.log('==== COMMENTS GET REQUEST FAILED ====');
    return NextResponse.json(
      { error: 'Failed to fetch comments', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}


export async function POST(request: NextRequest) {
  console.log('==== COMMENT POST REQUEST STARTED ====');
  try {
    // Get request body and log it
    let body;
    try {
      body = await request.json();
      console.log('Comment POST raw request body:', JSON.stringify(body, null, 2));
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    // Extract and validate fields
    const { parentId, clientId, commentText, author } = body;
    console.log('Extracted fields:', {
      parentId,
      clientId,
      commentText: commentText?.substring(0, 20) + (commentText?.length > 20 ? '...' : ''),
      commentTextLength: commentText?.length || 0,
      author
    });

    if (!parentId) {
      console.error('Missing parentId field');
      return NextResponse.json(
        { error: 'Missing parentId field' },
        { status: 400 }
      );
    }

    if (!clientId) {
      console.error('Missing clientId field');
      return NextResponse.json(
        { error: 'Missing clientId field' },
        { status: 400 }
      );
    }

    if (!commentText) {
      console.error('Missing commentText field');
      return NextResponse.json(
        { error: 'Missing commentText field' },
        { status: 400 }
      );
    }

    // Connect to database and get collection
    console.log('Getting comments collection...');
    let commentsCollection;
    try {
      commentsCollection = await getCollection('comments');
      console.log('Successfully connected to comments collection');
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return NextResponse.json(
        { error: 'Database connection failed', details: dbError instanceof Error ? dbError.message : 'Unknown error' },
        { status: 500 }
      );
    }

    // Prepare comment object - ensure IDs are handled correctly
    let formattedParentId = parentId;
    let formattedClientId = clientId;

    // Try to validate the parent ID
    try {
      if (ObjectId.isValid(parentId)) {
        console.log('parentId is a valid ObjectId format');
        formattedParentId = parentId;
      } else {
        console.log('parentId is not a valid ObjectId, using as string');
      }
    } catch (error) {
      console.warn('Error checking parentId format:', error);
      // Keep as string if error
    }

    // Try to validate the client ID
    try {
      if (ObjectId.isValid(clientId)) {
        console.log('clientId is a valid ObjectId format');
        formattedClientId = clientId;
      } else {
        console.log('clientId is not a valid ObjectId, using as string');
      }
    } catch (error) {
      console.warn('Error checking clientId format:', error);
      // Keep as string if error
    }
    
    const comment = {
      parentId: formattedParentId,
      clientId: formattedClientId,
      commentText,
      author: author || 'Current User',
      createdAt: new Date().toISOString()
    };

    console.log('Prepared comment object:', JSON.stringify(comment, null, 2));

    // Insert comment
    let result;
    try {
      console.log('Inserting comment into database...');
      result = await commentsCollection.insertOne(comment);
      console.log('Insert operation result:', JSON.stringify(result, null, 2));
    } catch (insertError) {
      console.error('Database insert error:', insertError);
      return NextResponse.json(
        {
          error: 'Failed to insert comment',
          details: insertError instanceof Error ? insertError.message : 'Unknown error'
        },
        { status: 500 }
      );
    }

    if (!result.acknowledged) {
      console.error('Insert not acknowledged by database');
      throw new Error('Database did not acknowledge the insert operation');
    }

    // Prepare response
    const insertedComment = {
      _id: result.insertedId,
      ...comment
    };

    console.log('Comment added successfully:', JSON.stringify(insertedComment, null, 2));
    console.log('==== COMMENT POST REQUEST COMPLETED SUCCESSFULLY ====');

    return NextResponse.json(
      {
        message: 'Comment added successfully',
        comment: insertedComment
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Unhandled error in comments POST handler:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace available');
    console.log('==== COMMENT POST REQUEST FAILED ====');

    // Send detailed error information
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      {
        error: 'Failed to add comment',
        details: errorMessage
      },
      { status: 500 }
    );
  }
}