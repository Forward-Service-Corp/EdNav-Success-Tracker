// app/api/admin/settings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';
import mongoose from 'mongoose';

// Define settings schema
const SettingsSchema = new mongoose.Schema({
  siteName: { type: String, default: 'EdNav' },
  maintenanceMode: { type: Boolean, default: false },
  maintenanceMessage: {
    type: String,
    default: 'System is currently undergoing scheduled maintenance. Please check back later.'
  },
  maxUploadSize: { type: Number, default: 5 },
  allowRegistration: { type: Boolean, default: true },
  contactEmail: { type: String, default: 'support@ednavapp.com' },
  defaultUserLevel: { type: String, default: 'user' }
});

// Make sure we don't reinitialize the model if it already exists
const Settings = mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);

// GET /api/admin/settings - Get system settings
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

    // Get settings or create default if not exists
    let settings = await Settings.findOne().lean();

    if (!settings) {
      const defaultSettings = new Settings();
      await defaultSettings.save();
      settings = defaultSettings.toObject();
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// POST /api/admin/settings - Update system settings
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

    const updatedSettings = await req.json();

    await connectToDatabase();

    // Get settings or create default if not exists
    let settings = await Settings.findOne();

    if (!settings) {
      settings = new Settings(updatedSettings);
    } else {
      // Update fields
      if (updatedSettings.siteName !== undefined) settings.siteName = updatedSettings.siteName;
      if (updatedSettings.maintenanceMode !== undefined) settings.maintenanceMode = updatedSettings.maintenanceMode;
      if (updatedSettings.maintenanceMessage !== undefined) settings.maintenanceMessage = updatedSettings.maintenanceMessage;
      if (updatedSettings.maxUploadSize !== undefined) settings.maxUploadSize = updatedSettings.maxUploadSize;
      if (updatedSettings.allowRegistration !== undefined) settings.allowRegistration = updatedSettings.allowRegistration;
      if (updatedSettings.contactEmail !== undefined) settings.contactEmail = updatedSettings.contactEmail;
      // Don't allow changing the defaultUserLevel through API for security
    }

    await settings.save();

    return NextResponse.json(settings.toObject());
  } catch (error) {
    console.error('Error updating settings:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}