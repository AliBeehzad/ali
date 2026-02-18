import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Application from '@/models/Application';
import Career from '@/models/Career';

// GET all applications (with optional filtering)
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(req.url);
    const careerId = searchParams.get('careerId');
    const status = searchParams.get('status');
    const limit = searchParams.get('limit');
    
    let query: any = {};
    
    if (careerId) {
      query.careerId = careerId;
    }
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    let applicationsQuery = Application.find(query)
      .populate('careerId', 'title department location')
      .sort({ appliedAt: -1 });
    
    if (limit) {
      applicationsQuery = applicationsQuery.limit(parseInt(limit));
    }
    
    const applications = await applicationsQuery;
    
    return NextResponse.json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}

// POST new application
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    const data = await req.json();
    
    const { careerId, firstName, lastName, email, phone, experience, coverLetter, resume } = data;

    // Validate required fields
    if (!careerId) {
      return NextResponse.json(
        { error: 'Career ID is required' },
        { status: 400 }
      );
    }

    if (!firstName?.trim()) {
      return NextResponse.json(
        { error: 'First name is required' },
        { status: 400 }
      );
    }

    if (!lastName?.trim()) {
      return NextResponse.json(
        { error: 'Last name is required' },
        { status: 400 }
      );
    }

    if (!email?.trim()) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    if (!phone?.trim()) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }

    if (!resume?.url || !resume?.filename) {
      return NextResponse.json(
        { error: 'Resume is required' },
        { status: 400 }
      );
    }

    // Check if job exists and is active
    const career = await Career.findById(careerId);
    if (!career) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    if (!career.isActive) {
      return NextResponse.json(
        { error: 'This job position is no longer active' },
        { status: 400 }
      );
    }

    // Check deadline
    if (career.deadline && new Date(career.deadline) < new Date()) {
      return NextResponse.json(
        { error: 'Application deadline has passed' },
        { status: 400 }
      );
    }

    // Check for duplicate application (same email for same job)
    const existingApplication = await Application.findOne({
      careerId,
      email: email.toLowerCase()
    });

    if (existingApplication) {
      return NextResponse.json(
        { error: 'You have already applied for this position' },
        { status: 400 }
      );
    }

    // Create application
    const application = await Application.create({
      careerId,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      experience: parseInt(experience) || 0,
      coverLetter: coverLetter?.trim() || '',
      resume: {
        url: resume.url,
        public_id: resume.url.split('/').pop()?.split('.')[0] || `resume_${Date.now()}`,
        filename: resume.filename
      },
      status: 'pending',
      appliedAt: new Date()
    });

    // Increment applications count on career
    career.applications = (career.applications || 0) + 1;
    await career.save();

    // Return populated application
    const populatedApplication = await Application.findById(application._id)
      .populate('careerId', 'title department location');

    return NextResponse.json(populatedApplication, { status: 201 });
  } catch (error: any) {
    console.error('Error creating application:', error);
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: messages.join(', ') },
        { status: 400 }
      );
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'An application with this email already exists for this position' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to submit application. Please try again.' },
      { status: 500 }
    );
  }
}

// OPTIONS method for CORS if needed
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}