// app/api/admin/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';
import { User } from '@/models/User';

// GET /api/admin/users - Get all users
export async function GET(_req: NextRequest) {
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

    // Get all users, excluding sensitive fields
    const users = await User.find({})
      .select('-password -__v')
      .lean();

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// POST /api/admin/users - Create a new user
export async function POST(req: NextRequest) {
  try {
    // Check authentication and authorization
    const session = await getServerSession(authOptions);
    if (!session || !['admin', 'IT'].includes(session.user.level as string)) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const userData = await req.json();

    // Validate required fields
    if (!userData.name || !userData.email || !userData.password) {
      return new NextResponse(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    await connectToDatabase();

    // Check if email already exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      return new NextResponse(JSON.stringify({ error: 'Email already exists' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Create new user
    const newUser = new User({
      name: userData.name,
      email: userData.email,
      password: userData.password, // Will be hashed by model pre-save hook
      level: userData.level || 'user',
      username: userData.username || null,
      emailVerified: null,
      preferences: {
        theme: '',
        lastAgeFilter: '',
        lastStatusFilter: ''
      },
      notifications: {
        unread: [],
        read: []
      },
      streak: {
        active: false,
        streak: 0,
        lastDate: '',
        longestStreak: 0,
        longestStreakDate: ''
      }
    });

    await newUser.save();

    // Return user data without sensitive fields
    const userToReturn = newUser.toObject();
    delete userToReturn.password;
    delete userToReturn.__v;

    return NextResponse.json(userToReturn, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}