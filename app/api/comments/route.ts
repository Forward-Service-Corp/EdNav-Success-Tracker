// app/api/comments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const clientId = url.searchParams.get('clientId');

  if (!clientId) {
    return NextResponse.json({ error: 'Client ID is required' }, { status: 400 });
  }

  try {
    const commentsCollection = await getCollection('comments');
    const comments = await commentsCollection
      .find({ clientId })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { parentId, clientId, commentText, author } = body;

    if (!parentId || !clientId || !commentText) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const commentsCollection = await getCollection('comments');
    const comment = {
      parentId,
      clientId,
      commentText,
      author,
      createdAt: new Date().toISOString()
    };

    const result = await commentsCollection.insertOne(comment);

    return NextResponse.json(
      {
        message: 'Comment added successfully',
        _id: result.insertedId,
        ...comment
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding comment:', error);
    return NextResponse.json(
      { error: 'Failed to add comment' },
      { status: 500 }
    );
  }
}