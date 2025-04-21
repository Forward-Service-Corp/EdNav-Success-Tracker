// app/api/comments/test/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';

/**
 * This is a test endpoint for directly creating comments
 * It can be used to diagnose issues with the regular comment API
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('TEST ENDPOINT - Request body:', body);

    const { parentId, clientId, commentText, author } = body;

    // Basic validation
    if (!parentId) {
      return NextResponse.json({ error: 'Missing parentId' }, { status: 400 });
    }

    if (!clientId) {
      return NextResponse.json({ error: 'Missing clientId' }, { status: 400 });
    }

    if (!commentText) {
      return NextResponse.json({ error: 'Missing commentText' }, { status: 400 });
    }

    // Create the comment object
    const comment = {
      parentId,
      clientId,
      commentText,
      author: author || 'Test User',
      createdAt: new Date().toISOString()
    };

    console.log('TEST ENDPOINT - Creating comment:', comment);

    // Get the comments collection
    const commentsCollection = await getCollection('comments');

    // Insert the comment
    const result = await commentsCollection.insertOne(comment);
    console.log('TEST ENDPOINT - Insert result:', result);

    // Check if the insert was successful
    if (!result.acknowledged) {
      return NextResponse.json({ error: 'Insert not acknowledged' }, { status: 500 });
    }

    // Return the created comment
    return NextResponse.json({
      success: true,
      message: 'Comment created successfully',
      comment: {
        _id: result.insertedId,
        ...comment
      }
    }, { status: 201 });
  } catch (error) {
    console.error('TEST ENDPOINT - Error:', error);
    return NextResponse.json({
      error: 'Failed to create comment',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}