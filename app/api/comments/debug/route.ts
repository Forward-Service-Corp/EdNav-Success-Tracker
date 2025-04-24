// app/api/comments/debug/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

/**
 * GET handler for comment debugging
 * This endpoint provides detailed information about the comments system state
 * and is intended for debugging purposes only.
 */
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const clientId = url.searchParams.get('clientId');
    const action = url.searchParams.get('action') || 'status';

    // Initialize response data
    const result: any = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      version: '1.0.0',
      action
    };

    // Connect to MongoDB
    const commentsCollection = await getCollection('comments');

    // Perform the requested action
    switch (action) {
      case 'status':
        // Return basic status about the comments system
        const totalCount = await commentsCollection.countDocuments();
        result.totalComments = totalCount;

        // Get counts by clientId if provided
        if (clientId) {
          result.clientId = clientId;

          // Check in a string format
          const stringFormatCount = await commentsCollection.countDocuments({ clientId });
          result.clientComments = {
            stringFormat: stringFormatCount
          };

          // Check in ObjectId format if valid
          if (ObjectId.isValid(clientId)) {
            try {
              result.clientComments.objectIdFormat = await commentsCollection.countDocuments({
                clientId: ObjectId.createFromBase64(clientId)
              });
            } catch (error) {
              result.clientComments.objectIdFormat = 'error';
            }
          } else {
            result.clientComments.objectIdFormat = 'invalid format';
          }

          // Get a sample of recent comments
          const recentComments = await commentsCollection
            .find({ clientId })
            .sort({ createdAt: -1 })
            .limit(5)
            .toArray();

          result.recentComments = recentComments.map(c => ({
            _id: c._id.toString(),
            parentId: c.parentId,
            createdAt: c.createdAt,
            author: c.author,
            textPreview: c.commentText?.substring(0, 30) + '...'
          }));
        }
        break;

      case 'sample':
        // Return a sample of recent comments across all clients
        const sampleComments = await commentsCollection
          .find()
          .sort({ createdAt: -1 })
          .limit(10)
          .toArray();

        result.sampleComments = sampleComments.map(c => ({
          _id: c._id.toString(),
          parentId: c.parentId,
          clientId: c.clientId,
          createdAt: c.createdAt,
          author: c.author,
          textPreview: c.commentText?.substring(0, 30) + '...'
        }));
        break;

      case 'orphans':
        // Find comments without matching parents
        // This requires separate fetching of activities and notes
        const activitiesCollection = await getCollection('activities');
        const notesCollection = await getCollection('notes');

        // Get all comments
        const allComments = await commentsCollection.find().toArray();

        // Get unique parent IDs
        const parentIds = [...new Set(allComments.map(c => c.parentId))];

        // Check each parent ID
        const orphanedComments = [];

        for (const pid of parentIds) {
          let parentFound = false;

          try {
            // Try as a string
            const activityMatch = await activitiesCollection.findOne({ _id: pid });
            const noteMatch = await notesCollection.findOne({ _id: pid });

            if (activityMatch || noteMatch) {
              parentFound = true;
            }

            // Try as ObjectId if valid
            if (!parentFound && ObjectId.isValid(pid)) {
              const objId = ObjectId.createFromBase64(pid);
              const activityMatchObj = await activitiesCollection.findOne({ _id: objId });
              const noteMatchObj = await notesCollection.findOne({ _id: objId });

              if (activityMatchObj || noteMatchObj) {
                parentFound = true;
              }
            }
          } catch (error) {
            // Skip errors
          }

          if (!parentFound) {
            // Find comments with this parent ID
            const orphans = allComments.filter(c => c.parentId === pid);
            orphanedComments.push(...orphans);
          }
        }

        result.orphanedComments = orphanedComments.map(c => ({
          _id: c._id.toString(),
          parentId: c.parentId,
          clientId: c.clientId,
          createdAt: c.createdAt,
          author: c.author,
          textPreview: c.commentText?.substring(0, 30) + '...'
        }));
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action specified' },
          { status: 400 }
        );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in comments debug endpoint:', error);
    return NextResponse.json(
      { error: 'Debug operation failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}