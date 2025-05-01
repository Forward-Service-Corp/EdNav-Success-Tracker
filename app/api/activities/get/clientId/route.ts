// app/api/activities/get/clientId/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';

// import { flattenActivityData } from '../lib/activities/utils';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const clientId = url.searchParams.get('clientId');

  try {
    const activitiesCollection = await getCollection('activities');
    const notesCollection = await getCollection('notes');

    const activityRes = await activitiesCollection
      .find({ clientId })
      .sort({ createdAt: -1 })
      .toArray();

    const notesRes = await notesCollection
      .aggregate([
        { $match: { clientId } },
        { $group: { _id: '$activityId', records: { $push: '$$ROOT' }, count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ])
      .toArray();

    // const flattenedData = activityRes.map(flattenActivityData);

    return NextResponse.json({
      success: true,
      data: activityRes,
      notesRes
    });
  } catch (error) {
    console.error('Error in GET /activities/clientId:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    }, { status: 500 });
  }
}