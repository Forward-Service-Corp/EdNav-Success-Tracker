// app/api/admin/logs/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';
import mongoose from 'mongoose';

// Define activity log schema
const LogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userName: { type: String, required: true },
  action: { type: String, required: true },
  details: { type: String, default: '' },
  ip: { type: String, default: '' },
  timestamp: { type: Date, default: Date.now },
  level: { type: String, enum: ['info', 'warning', 'error'], default: 'info' }
});

// Make sure we don't reinitialize the model if it already exists
const ActivityLog = mongoose.models.ActivityLog || mongoose.model('ActivityLog', LogSchema);

// GET /api/admin/logs - Get activity logs
export async function GET(req: NextRequest) {
  try {
    // Check authentication and authorization
    const session = await getServerSession(authOptions);
    if (!session || !['admin', 'IT'].includes(session.user.level as string)) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    await connectToDatabase();

    // Parse query parameters
    const { searchParams } = new URL(req.url);
    const level = searchParams.get('level');
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    // Build query
    const query: any = {};

    if (level && level !== 'all') {
      query.level = level;
    }

    if (from || to) {
      query.timestamp = {};
      if (from) query.timestamp.$gte = new Date(from);
      if (to) query.timestamp.$lte = new Date(to);
    }

    // Get logs
    const logs = await ActivityLog.find(query)
      .sort({ timestamp: -1 })
      .limit(100)  // Limit to latest 100 logs
      .lean();

    return NextResponse.json(logs);
  } catch (error) {
    console.error('Error fetching logs:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// POST /api/admin/logs - Create a new log entry
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const logData = await req.json();

    // Validate required fields
    if (!logData.action) {
      return new NextResponse(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    await connectToDatabase();

    // Create log entry
    const newLog = new ActivityLog({
      userId: session.user.id,
      userName: session.user.name,
      action: logData.action,
      details: logData.details || '',
      ip: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '',
      level: logData.level || 'info'
    });

    await newLog.save();

    return NextResponse.json(newLog.toObject(), { status: 201 });
  } catch (error) {
    console.error('Error creating log:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}