import { NextResponse } from 'next/server'
import { lawyersData } from '../../../../lib/data/lawyersData.js'

// Use the comprehensive lawyer database
const lawyersDatabase = lawyersData

export async function GET(request, { params }) {
  try {
    const lawyerId = parseInt(params.id)
    const lawyer = lawyersDatabase.find(l => l.id === lawyerId)

    if (!lawyer) {
      return NextResponse.json(
        { error: 'Lawyer not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      lawyer: lawyer
    })

  } catch (error) {
    console.error('Lawyer profile API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch lawyer profile' },
      { status: 500 }
    )
  }
}
