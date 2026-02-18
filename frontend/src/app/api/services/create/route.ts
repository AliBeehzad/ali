import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Service from '@/models/Service';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    // Parse JSON body instead of formData
    const data = await req.json();
    
    const { title, category, description, imageUrl } = data;

    // Validate required fields
    if (!title || !category || !description || !imageUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create slug from title
    const slug = title.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');

    // Check if slug exists
    const existing = await Service.findOne({ slug });
    if (existing) {
      return NextResponse.json(
        { error: 'Service with this title already exists' },
        { status: 400 }
      );
    }

    // Create new service
    const service = await Service.create({
      title,
      slug,
      category,
      description,
      image: imageUrl,
      features: [],
      isActive: true
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json(
      { error: 'Failed to create service' },
      { status: 500 }
    );
  }
}