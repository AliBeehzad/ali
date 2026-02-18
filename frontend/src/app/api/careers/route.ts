import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Career from '@/models/Career';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(req.url);
    const department = searchParams.get('department');
    const type = searchParams.get('type');
    const location = searchParams.get('location');
    
    let query: any = { isActive: true };
    
    if (department && department !== 'All') {
      query.department = department;
    }
    
    if (type && type !== 'All') {
      query.type = type;
    }
    
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    
    const careers = await Career.find(query)
      .sort({ createdAt: -1 })
      .limit(50);
    
    return NextResponse.json(careers);
  } catch (error) {
    console.error('Error fetching careers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch careers' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const data = await req.json();
    
    // Create slug from title
    const slug = data.title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
    
    // Check if slug exists
    const existing = await Career.findOne({ slug });
    if (existing) {
      return NextResponse.json(
        { error: 'Job with this title already exists' },
        { status: 400 }
      );
    }
    
    const career = await Career.create({
      ...data,
      slug,
      isActive: true,
      views: 0,
      applications: 0
    });
    
    return NextResponse.json(career, { status: 201 });
  } catch (error) {
    console.error('Error creating career:', error);
    return NextResponse.json(
      { error: 'Failed to create career' },
      { status: 500 }
    );
  }
}