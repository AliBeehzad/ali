import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Setting from '@/models/Setting';

// GET all settings
export async function GET() {
  try {
    await dbConnect();
    const settings = await Setting.find().sort({ group: 1, key: 1 });
    
    // Convert to key-value object for easier use - FIXED VERSION
    const settingsObject = settings.reduce<Record<string, any>>((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {});
    
    return NextResponse.json(settingsObject);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

// UPDATE multiple settings
export async function PUT(req: NextRequest) {
  try {
    await dbConnect();
    const updates = await req.json();
    
    const operations = Object.entries(updates).map(([key, value]) => ({
      updateOne: {
        filter: { key },
        update: { $set: { value } },
        upsert: true
      }
    }));
    
    await Setting.bulkWrite(operations);
    
    return NextResponse.json({ message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}