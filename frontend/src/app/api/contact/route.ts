import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import ContactSubmission from '@/models/ContactSubmission';
import nodemailer from 'nodemailer';
import { headers } from 'next/headers';

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    const data = await req.json();
    const { name, email, phone, service, message } = data;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Get IP and user agent for security - FIXED: await headers()
    const headersList = await headers();
    const ipAddress = headersList.get('x-forwarded-for') || 
                      headersList.get('x-real-ip') || 
                      'unknown';
    const userAgent = headersList.get('user-agent') || 'unknown';

    // Save to database
    const submission = await ContactSubmission.create({
      name,
      email,
      phone,
      service,
      message,
      ipAddress,
      userAgent,
      status: 'unread'
    });

    // Only try to send email if credentials are configured
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        // Send email notification to admin
        const adminEmail = process.env.ADMIN_EMAIL || 'alibeehzadzai@gmail.com';
        
        await transporter.sendMail({
          from: process.env.EMAIL_FROM || `"STRATERRA Website" <${process.env.EMAIL_USER}>`,
          to: adminEmail,
          replyTo: email,
          subject: `New Contact Form Message from ${name}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #2563eb;">New Contact Form Submission</h2>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
              ${service ? `<p><strong>Service Interested:</strong> ${service}</p>` : ''}
              <p><strong>Message:</strong></p>
              <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px;">
                ${message.replace(/\n/g, '<br>')}
              </div>
              <p style="margin-top: 20px; font-size: 12px; color: #6b7280;">
                <strong>IP Address:</strong> ${ipAddress}<br>
                <strong>User Agent:</strong> ${userAgent}<br>
                <strong>Submission ID:</strong> ${submission._id}
              </p>
              <hr>
              <p style="font-size: 12px; color: #6b7280;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/en/admin/dashboard/contact-submissions" 
                   style="color: #2563eb;">Click here</a> to view all submissions.
              </p>
            </div>
          `,
        });

        // Send auto-reply to user
        await transporter.sendMail({
          from: process.env.EMAIL_FROM || `"STRATERRA" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: 'Thank you for contacting STRATERRA',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #2563eb;">Thank You for Contacting STRATERRA</h2>
              <p>Dear ${name},</p>
              <p>We have received your message and will get back to you as soon as possible.</p>
              <p><strong>Your message:</strong></p>
              <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px;">
                ${message.replace(/\n/g, '<br>')}
              </div>
              <p style="margin-top: 20px;">Best regards,<br>The STRATERRA Team</p>
              <hr>
              <p style="font-size: 12px; color: #6b7280;">
                STRATERRA Industrial Group<br>
                Logar-Pul-e-Alam, Afghanistan<br>
                Tel: +93764084531
              </p>
            </div>
          `,
        });
      } catch (emailError) {
        console.error('Email sending failed but submission saved:', emailError);
        // Don't return error - submission was saved successfully
      }
    } else {
      console.log('Email credentials not configured - submission saved without email notification');
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Message sent successfully!',
      id: submission._id 
    });

  } catch (error: any) {
    console.error('Contact form error:', error);
    
    return NextResponse.json(
      { error: error.message || 'Failed to send message' },
      { status: 500 }
    );
  }
}

// GET endpoint for admin to fetch submissions
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    
    let query: any = {};
    if (status && status !== 'all') {
      query.status = status;
    }
    
    const submissions = await ContactSubmission.find(query)
      .sort({ createdAt: -1 })
      .limit(limit);
    
    return NextResponse.json(submissions);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch submissions' },
      { status: 500 }
    );
  }
}

// PATCH endpoint to update status (read/replied)
export async function PATCH(req: NextRequest) {
  try {
    await dbConnect();
    
    const { id, status } = await req.json();
    
    const submission = await ContactSubmission.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    
    if (!submission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(submission);
  } catch (error) {
    console.error('Error updating submission:', error);
    return NextResponse.json(
      { error: 'Failed to update submission' },
      { status: 500 }
    );
  }
}

// DELETE endpoint to remove submissions
export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();
    
    const { id } = await req.json();
    
    const submission = await ContactSubmission.findByIdAndDelete(id);
    
    if (!submission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Submission deleted' 
    });
  } catch (error) {
    console.error('Error deleting submission:', error);
    return NextResponse.json(
      { error: 'Failed to delete submission' },
      { status: 500 }
    );
  }
}