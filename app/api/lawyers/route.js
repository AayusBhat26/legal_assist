import { NextResponse } from 'next/server'
import { getLawyersData } from '../../../lib/data/lawyersData.js'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const specialization = searchParams.get('specialization')
    const location = searchParams.get('location')
    const minRating = searchParams.get('minRating')
    const maxFee = searchParams.get('maxFee')

    // Get all lawyers data
    const allLawyers = await getLawyersData()
    let lawyers = allLawyers

    // Apply filters if provided
    if (specialization) {
      lawyers = lawyers.filter(lawyer => 
        lawyer.specialization.toLowerCase().includes(specialization.toLowerCase())
      )
    }

    if (location) {
      lawyers = lawyers.filter(lawyer => 
        lawyer.location.toLowerCase().includes(location.toLowerCase())
      )
    }

    if (minRating) {
      lawyers = lawyers.filter(lawyer => lawyer.rating >= parseFloat(minRating))
    }

    if (maxFee) {
      lawyers = lawyers.filter(lawyer => {
        const fee = parseInt(lawyer.consultationFee.replace(/[₹,]/g, ''))
        return fee <= parseInt(maxFee)
      })
    }

    return NextResponse.json({
      success: true,
      lawyers,
      total: lawyers.length,
      filters: {
        specialization,
        location,
        minRating,
        maxFee
      }
    })

  } catch (error) {
    console.error('Error fetching lawyers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch lawyers' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { name, specialization, location, experience, rating, consultationFee, bio, email, phone } = body

    // In production, this would save to a database
    const newLawyer = {
      id: Date.now(), // Simple ID generation
      name,
      specialization,
      location,
      experience,
      rating,
      consultationFee,
      bio,
      email,
      phone,
      education: '',
      languages: ['English', 'Hindi'],
      courtsPracticing: [],
      achievements: []
    }

    // Here you would save to database
    // await saveLawyerToDatabase(newLawyer)

    return NextResponse.json({
      success: true,
      message: 'Lawyer profile created successfully',
      lawyer: newLawyer
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating lawyer profile:', error)
    return NextResponse.json(
      { error: 'Failed to create lawyer profile' },
      { status: 500 }
    )
  }
}
