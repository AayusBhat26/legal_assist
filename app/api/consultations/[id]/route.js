import { NextResponse } from 'next/server'

// Mock consultation database - in production, this would be a real database
const consultationsDatabase = [
  // This would be populated from the consultations API
]

export async function GET(request, { params }) {
  try {
    const consultationId = params.id
    
    // In production, this would query a real database
    // For now, we'll create a mock consultation if it doesn't exist
    let consultation = consultationsDatabase.find(c => c.id === consultationId)
    
    if (!consultation) {
      // Create a mock consultation for demonstration
      consultation = {
        id: consultationId,
        userId: 'demo-user',
        lawyerId: '1',
        lawyerName: 'Adv. Demo Lawyer',
        date: new Date().toISOString().split('T')[0],
        time: '10:00',
        type: 'video',
        caseDescription: 'Sample legal consultation case',
        status: 'confirmed',
        paymentStatus: 'completed',
        meetingLink: 'https://meet.legalassistant.com/room/' + consultationId,
        amount: '₹2,000',
        createdAt: new Date().toISOString()
      }
    }

    return NextResponse.json({
      success: true,
      consultation: consultation
    })

  } catch (error) {
    console.error('Get consultation error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch consultation details' },
      { status: 500 }
    )
  }
}

export async function PATCH(request, { params }) {
  try {
    const consultationId = params.id
    const updateData = await request.json()
    
    // In production, this would update the database
    const consultationIndex = consultationsDatabase.findIndex(c => c.id === consultationId)
    
    if (consultationIndex === -1) {
      return NextResponse.json(
        { error: 'Consultation not found' },
        { status: 404 }
      )
    }
    
    consultationsDatabase[consultationIndex] = {
      ...consultationsDatabase[consultationIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    }
    
    return NextResponse.json({
      success: true,
      consultation: consultationsDatabase[consultationIndex]
    })

  } catch (error) {
    console.error('Update consultation error:', error)
    return NextResponse.json(
      { error: 'Failed to update consultation' },
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
  try {
    const consultationId = params.id
    
    // In production, this would soft-delete from the database
    const consultationIndex = consultationsDatabase.findIndex(c => c.id === consultationId)
    
    if (consultationIndex === -1) {
      return NextResponse.json(
        { error: 'Consultation not found' },
        { status: 404 }
      )
    }
    
    // Mark as cancelled instead of deleting
    consultationsDatabase[consultationIndex].status = 'cancelled'
    consultationsDatabase[consultationIndex].cancelledAt = new Date().toISOString()
    
    return NextResponse.json({
      success: true,
      message: 'Consultation cancelled successfully'
    })

  } catch (error) {
    console.error('Cancel consultation error:', error)
    return NextResponse.json(
      { error: 'Failed to cancel consultation' },
      { status: 500 }
    )
  }
}
