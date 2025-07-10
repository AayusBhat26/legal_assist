import { NextResponse } from 'next/server'

// Mock consultation database - in production, this would be a real database
let consultationsDatabase = []

export async function POST(request) {
  try {
    const consultationData = await request.json()
    
    const newConsultation = {
      id: Date.now().toString(),
      ...consultationData,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      paymentStatus: 'completed', // In production, this would be set after actual payment
      meetingLink: generateMeetingLink(consultationData.type)
    }
    
    consultationsDatabase.push(newConsultation)
    
    // In production, you would:
    // 1. Process actual payment via Razorpay/Stripe
    // 2. Send confirmation emails to both user and lawyer
    // 3. Create calendar invites
    // 4. Generate secure meeting links for video/phone calls
    
    return NextResponse.json({
      success: true,
      consultationId: newConsultation.id,
      consultation: newConsultation
    })

  } catch (error) {
    console.error('Create consultation error:', error)
    return NextResponse.json(
      { error: 'Failed to create consultation' },
      { status: 500 }
    )
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const lawyerId = searchParams.get('lawyerId')
    
    let filteredConsultations = consultationsDatabase
    
    if (userId) {
      filteredConsultations = filteredConsultations.filter(c => c.userId === userId)
    }
    
    if (lawyerId) {
      filteredConsultations = filteredConsultations.filter(c => c.lawyerId === lawyerId)
    }
    
    return NextResponse.json({
      success: true,
      consultations: filteredConsultations
    })

  } catch (error) {
    console.error('Get consultations error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch consultations' },
      { status: 500 }
    )
  }
}

function generateMeetingLink(type) {
  if (type === 'video') {
    // In production, integrate with Zoom, Google Meet, or similar
    return `https://meet.legalassistant.com/room/${Date.now()}`
  } else if (type === 'phone') {
    return 'Phone number will be shared via SMS'
  } else {
    return 'Address will be shared via email'
  }
}
