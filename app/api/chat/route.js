import { NextResponse } from 'next/server'
import LegalRAGSystem from '../../../lib/legal-knowledge/ragSystem.js'
import LawyerMatchingEngine from '../../../lib/legal-knowledge/lawyerMatcher.js'
import { lawyersData } from '../../../lib/data/lawyersData.js'

// Initialize AI systems
const legalRAG = new LegalRAGSystem()
const lawyerMatcher = new LawyerMatchingEngine()

// Mock legal knowledge base - in production, this would be a vector database
const legalKnowledgeBase = {
  'landlord tenant': {
    laws: [
      'Rent Control Act - Governs rental agreements and tenant rights',
      'Transfer of Property Act, 1882 - Section 106 deals with lease determination',
      'Consumer Protection Act, 2019 - Covers housing services'
    ],
    caseType: 'Property & Rental Law'
  },
  'criminal': {
    laws: [
      'Indian Penal Code (IPC) - Defines criminal offenses',
      'Criminal Procedure Code (CrPC) - Outlines criminal procedure',
      'Evidence Act, 1872 - Rules of evidence in criminal cases'
    ],
    caseType: 'Criminal Law'
  },
  'family': {
    laws: [
      'Hindu Marriage Act, 1955 - Marriage and divorce for Hindus',
      'Special Marriage Act, 1954 - Inter-faith marriages',
      'Domestic Violence Act, 2005 - Protection from domestic violence'
    ],
    caseType: 'Family Law'
  },
  'consumer': {
    laws: [
      'Consumer Protection Act, 2019 - Consumer rights and remedies',
      'Sale of Goods Act, 1930 - Rights in purchase of goods',
      'Contract Act, 1872 - Enforcement of agreements'
    ],
    caseType: 'Consumer Protection'
  }
}

// Use comprehensive lawyer database
const lawyerDatabase = lawyersData

function getSimpleLawyerMatches(category) {
  // Simple fallback matching when advanced matching fails
  const categoryMap = {
    'Property & Rental Law': ['Property Law', 'Real Estate Law', 'Landlord-Tenant Law'],
    'Criminal Law': ['Criminal Law', 'Criminal Defense'],
    'Family Law': ['Family Law', 'Divorce Law', 'Child Custody'],
    'Consumer Protection': ['Consumer Law', 'Consumer Protection'],
    'Corporate Law': ['Corporate Law', 'Business Law'],
    'Employment Law': ['Labour Law', 'Employment Law'],
    'Constitutional Law': ['Constitutional Law', 'Civil Rights'],
    'Intellectual Property': ['Intellectual Property', 'Patent Law', 'Copyright Law'],
    'Tax Law': ['Tax Law', 'Income Tax'],
    'Immigration Law': ['Immigration Law', 'Visa Law']
  }

  const searchTerms = categoryMap[category] || [category]
  const matches = lawyerDatabase.filter(lawyer => 
    searchTerms.some(term => 
      lawyer.specialization.toLowerCase().includes(term.toLowerCase()) ||
      lawyer.practiceAreas?.some(area => 
        area.toLowerCase().includes(term.toLowerCase())
      )
    )
  )

  return matches.slice(0, 5) // Return top 5 matches
}

function classifyLegalQuery(message) {
  const lowerMessage = message.toLowerCase()
  
  if (lowerMessage.includes('landlord') || lowerMessage.includes('tenant') || 
      lowerMessage.includes('rent') || lowerMessage.includes('eviction') ||
      lowerMessage.includes('property')) {
    return 'landlord tenant'
  }
  
  if (lowerMessage.includes('criminal') || lowerMessage.includes('theft') ||
      lowerMessage.includes('assault') || lowerMessage.includes('police') ||
      lowerMessage.includes('fir') || lowerMessage.includes('arrest')) {
    return 'criminal'
  }
  
  if (lowerMessage.includes('marriage') || lowerMessage.includes('divorce') ||
      lowerMessage.includes('custody') || lowerMessage.includes('domestic') ||
      lowerMessage.includes('family')) {
    return 'family'
  }
  
  if (lowerMessage.includes('consumer') || lowerMessage.includes('product') ||
      lowerMessage.includes('service') || lowerMessage.includes('refund') ||
      lowerMessage.includes('warranty')) {
    return 'consumer'
  }
  
  return 'general'
}

function getLawyersBySpecialization(caseType) {
  return lawyerDatabase.filter(lawyer => 
    lawyer.specialization.toLowerCase().includes(caseType.toLowerCase()) ||
    caseType === 'general'
  ).slice(0, 3) // Return top 3 matches
}

export async function POST(request) {
  try {
    const { message, userId, chatHistory, documentContext } = await request.json()
    
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Use advanced RAG system for legal advice
    const legalAdvice = await legalRAG.generateLegalAdvice(
      message, 
      chatHistory || [], 
      documentContext || ''
    )

    // Classify query for lawyer matching
    const queryCategory = legalRAG.classifyLegalQuery(message)
    console.log('Query category:', queryCategory)
    
    // Get lawyer recommendations based on the query
    let lawyerMatches = { matches: [] }
    try {
      lawyerMatches = await lawyerMatcher.findMatchingLawyers(
        message,
        'Delhi', // Default location, could be extracted from user profile
        queryCategory
      )
      console.log('Lawyer matches found:', lawyerMatches.matches.length)
    } catch (lawyerError) {
      console.error('Lawyer matching error:', lawyerError)
      // Fallback to simple matching
      lawyerMatches = {
        matches: getSimpleLawyerMatches(queryCategory)
      }
    }

    // Add legal disclaimer
    const finalResponse = legalAdvice.response + 
      '\n\n⚖️ Legal Disclaimer: This information is for educational purposes only and does not constitute legal advice. Please consult with a qualified lawyer for advice specific to your situation.'

    console.log('Final response data:', {
      caseType: queryCategory,
      suggestedLawyers: lawyerMatches.matches.slice(0, 3).length
    })

    return NextResponse.json({
      response: finalResponse,
      caseType: queryCategory,
      relevantLaws: legalAdvice.relevantLaws,
      suggestedLawyers: lawyerMatches.matches.slice(0, 3), // Top 3 matches
      queryCategory: queryCategory,
      confidence: legalAdvice.confidence,
      citations: legalAdvice.citations
    })

  } catch (error) {
    console.error('Chat API error:', error)
    
    // Even in error, try to provide some lawyer suggestions
    const fallbackLawyers = lawyersData.slice(0, 3).map(lawyer => ({
      id: lawyer.id,
      name: lawyer.name,
      specialization: lawyer.specialization,
      location: lawyer.location,
      experience: lawyer.experience,
      rating: lawyer.rating,
      consultationFee: lawyer.consultationFee
    }))
    
    // Fallback response
    return NextResponse.json({
      response: 'I apologize, but I encountered an error processing your request. However, I can still suggest some qualified lawyers who might be able to help you.\n\n⚖️ Legal Disclaimer: This information is for educational purposes only and does not constitute legal advice. Please consult with a qualified lawyer for advice specific to your situation.',
      caseType: 'General Legal Query',
      relevantLaws: [],
      suggestedLawyers: fallbackLawyers,
      queryCategory: 'general',
      confidence: 0.3,
      error: 'Processing error - please try again'
    })
  }
}
