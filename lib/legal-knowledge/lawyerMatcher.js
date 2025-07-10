class LawyerMatchingEngine {
  constructor() {
    this.weightingFactors = {
      specialization: 0.4,
      location: 0.25,
      experience: 0.15,
      rating: 0.15,
      availability: 0.05
    }
  }

  async findMatchingLawyers(userQuery, userLocation = 'Delhi', caseType = 'general', budget = null) {
    try {
      // Get all available lawyers - use direct import instead of fetch for server-side
      const { getLawyersData } = await import('../data/lawyersData.js')
      const lawyers = await getLawyersData()

      // Score and rank lawyers
      const scoredLawyers = lawyers.map(lawyer => {
        const score = this.calculateLawyerScore(lawyer, {
          query: userQuery,
          location: userLocation,
          caseType: caseType,
          budget: budget
        })

        return {
          ...lawyer,
          matchScore: score.totalScore,
          matchReasons: score.reasons,
          scoreBreakdown: score.breakdown
        }
      })

      // Sort by match score and return top matches
      const topMatches = scoredLawyers
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 5)

      return {
        matches: topMatches,
        totalLawyers: lawyers.length,
        searchCriteria: {
          userQuery,
          userLocation,
          caseType,
          budget
        }
      }

    } catch (error) {
      console.error('Error in lawyer matching:', error)
      throw new Error('Failed to find matching lawyers')
    }
  }

  calculateLawyerScore(lawyer, criteria) {
    const scores = {}
    const reasons = []
    let totalScore = 0

    // Specialization match
    const specializationScore = this.calculateSpecializationScore(
      lawyer.specialization, 
      criteria.caseType, 
      criteria.query
    )
    scores.specialization = specializationScore
    totalScore += specializationScore * this.weightingFactors.specialization

    if (specializationScore > 0.8) {
      reasons.push(`Expert in ${lawyer.specialization}`)
    }

    // Location match
    const locationScore = this.calculateLocationScore(lawyer.location, criteria.location)
    scores.location = locationScore
    totalScore += locationScore * this.weightingFactors.location

    if (locationScore === 1.0) {
      reasons.push(`Available in ${criteria.location}`)
    }

    // Experience score
    const experienceScore = this.calculateExperienceScore(lawyer.experience, criteria.caseType)
    scores.experience = experienceScore
    totalScore += experienceScore * this.weightingFactors.experience

    if (experienceScore > 0.8) {
      reasons.push(`${lawyer.experience} of experience`)
    }

    // Rating score
    const ratingScore = this.calculateRatingScore(lawyer.rating)
    scores.rating = ratingScore
    totalScore += ratingScore * this.weightingFactors.rating

    if (lawyer.rating >= 4.5) {
      reasons.push(`Highly rated (${lawyer.rating}/5.0)`)
    }

    // Availability score (placeholder - would integrate with real calendar)
    const availabilityScore = this.calculateAvailabilityScore(lawyer)
    scores.availability = availabilityScore
    totalScore += availabilityScore * this.weightingFactors.availability

    // Budget consideration (if provided)
    if (criteria.budget) {
      const budgetScore = this.calculateBudgetScore(lawyer.consultationFee, criteria.budget)
      if (budgetScore < 0.5) {
        totalScore *= 0.7 // Reduce total score if over budget
        reasons.push('May exceed budget')
      } else if (budgetScore > 0.8) {
        reasons.push('Within budget')
      }
    }

    return {
      totalScore: Math.min(totalScore, 1.0),
      breakdown: scores,
      reasons: reasons
    }
  }

  calculateSpecializationScore(lawyerSpecialization, caseType, query) {
    const specializationMap = {
      'Property & Rental Law': ['property', 'rent', 'landlord', 'tenant', 'eviction', 'real estate'],
      'Criminal Law': ['criminal', 'crime', 'police', 'arrest', 'bail', 'fir', 'theft', 'murder'],
      'Family Law': ['family', 'divorce', 'marriage', 'custody', 'alimony', 'domestic violence'],
      'Consumer Protection': ['consumer', 'product', 'service', 'warranty', 'defective', 'refund'],
      'Corporate Law': ['business', 'company', 'corporate', 'contract', 'merger', 'compliance'],
      'Labour Law': ['employment', 'job', 'salary', 'termination', 'workplace', 'harassment'],
      'Cyber Law': ['cyber', 'online', 'internet', 'hacking', 'digital', 'data protection'],
      'Immigration Law': ['visa', 'immigration', 'citizenship', 'passport', 'foreign']
    }

    // Direct case type match
    const caseTypeMap = {
      'criminal': 'Criminal Law',
      'family': 'Family Law',
      'property': 'Property & Rental Law',
      'consumer': 'Consumer Protection',
      'labour': 'Labour Law',
      'cyber': 'Cyber Law',
      'corporate': 'Corporate Law'
    }

    if (caseTypeMap[caseType] === lawyerSpecialization) {
      return 1.0
    }

    // Keyword-based matching
    const keywords = specializationMap[lawyerSpecialization] || []
    const queryLower = query.toLowerCase()
    
    const matchCount = keywords.filter(keyword => 
      queryLower.includes(keyword)
    ).length

    return keywords.length > 0 ? Math.min(matchCount / keywords.length, 1.0) : 0.3
  }

  calculateLocationScore(lawyerLocation, userLocation) {
    if (lawyerLocation === userLocation) {
      return 1.0
    }

    // Same state/region partial match
    const statePairs = {
      'Delhi': ['New Delhi', 'NCR', 'Gurgaon', 'Noida'],
      'Mumbai': ['Navi Mumbai', 'Thane', 'Maharashtra'],
      'Bangalore': ['Bengaluru', 'Karnataka'],
      'Chennai': ['Tamil Nadu'],
      'Hyderabad': ['Telangana', 'Secunderabad'],
      'Kolkata': ['West Bengal']
    }

    for (const [state, cities] of Object.entries(statePairs)) {
      if ((state === lawyerLocation || cities.includes(lawyerLocation)) &&
          (state === userLocation || cities.includes(userLocation))) {
        return 0.7
      }
    }

    return 0.3 // Different state but still available online
  }

  calculateExperienceScore(experience, caseType) {
    const experienceYears = parseInt(experience.replace(/\D/g, '')) || 0
    
    // Different case types require different experience levels
    const requiredExperience = {
      'criminal': 5,
      'family': 3,
      'property': 4,
      'consumer': 2,
      'corporate': 6,
      'labour': 4,
      'cyber': 3
    }

    const required = requiredExperience[caseType] || 3
    
    if (experienceYears >= required + 5) return 1.0
    if (experienceYears >= required) return 0.8
    if (experienceYears >= required - 2) return 0.6
    return 0.4
  }

  calculateRatingScore(rating) {
    if (rating >= 4.8) return 1.0
    if (rating >= 4.5) return 0.9
    if (rating >= 4.0) return 0.7
    if (rating >= 3.5) return 0.5
    return 0.3
  }

  calculateAvailabilityScore(lawyer) {
    // Placeholder for real availability checking
    // In production, this would check calendar integration
    return Math.random() * 0.3 + 0.7 // Random between 0.7-1.0
  }

  calculateBudgetScore(consultationFee, budget) {
    const fee = parseInt(consultationFee.replace(/\D/g, '')) || 0
    const budgetAmount = parseInt(budget.replace(/\D/g, '')) || 0
    
    if (fee <= budgetAmount * 0.8) return 1.0
    if (fee <= budgetAmount) return 0.8
    if (fee <= budgetAmount * 1.2) return 0.6
    if (fee <= budgetAmount * 1.5) return 0.4
    return 0.2
  }

  async getRecommendationsBasedOnCase(caseDetails) {
    // Analyze case details to suggest lawyers
    const caseAnalysis = this.analyzeCaseComplexity(caseDetails)
    
    const criteria = {
      query: caseDetails.description || '',
      location: caseDetails.location || 'Delhi',
      caseType: caseDetails.type || 'general',
      budget: caseDetails.budget,
      urgency: caseDetails.urgency || 'normal'
    }

    const matches = await this.findMatchingLawyers(
      criteria.query,
      criteria.location,
      criteria.caseType,
      criteria.budget
    )

    // Add case-specific recommendations
    matches.matches = matches.matches.map(lawyer => ({
      ...lawyer,
      recommendation: this.generateRecommendationText(lawyer, caseAnalysis),
      estimatedCost: this.estimateConsultationCost(lawyer, caseAnalysis),
      nextSteps: this.suggestNextSteps(lawyer, caseAnalysis)
    }))

    return matches
  }

  analyzeCaseComplexity(caseDetails) {
    const complexityIndicators = {
      high: ['supreme court', 'high court', 'multiple parties', 'criminal charges', 'property dispute over', 'corporate fraud'],
      medium: ['district court', 'family court', 'employment termination', 'consumer complaint'],
      low: ['simple contract', 'rent agreement', 'traffic violation', 'documentation']
    }

    const description = (caseDetails.description || '').toLowerCase()
    
    for (const [level, indicators] of Object.entries(complexityIndicators)) {
      if (indicators.some(indicator => description.includes(indicator))) {
        return { complexity: level, indicators: indicators.filter(i => description.includes(i)) }
      }
    }

    return { complexity: 'medium', indicators: [] }
  }

  generateRecommendationText(lawyer, caseAnalysis) {
    const templates = {
      high: `${lawyer.name} is highly recommended for complex cases requiring ${lawyer.experience} of expertise in ${lawyer.specialization}.`,
      medium: `${lawyer.name} has solid experience handling cases like yours with a strong track record in ${lawyer.specialization}.`,
      low: `${lawyer.name} can efficiently handle your matter with their practical approach to ${lawyer.specialization}.`
    }

    return templates[caseAnalysis.complexity] || templates.medium
  }

  estimateConsultationCost(lawyer, caseAnalysis) {
    const baseFee = parseInt(lawyer.consultationFee.replace(/\D/g, '')) || 2000
    
    const multipliers = {
      high: 1.5,
      medium: 1.2,
      low: 1.0
    }

    const estimatedFee = baseFee * (multipliers[caseAnalysis.complexity] || 1.2)
    
    return {
      consultation: `₹${baseFee}`,
      estimated_case: `₹${Math.round(estimatedFee * 3)} - ₹${Math.round(estimatedFee * 8)}`,
      billing_type: 'Per consultation + case fees'
    }
  }

  suggestNextSteps(lawyer, caseAnalysis) {
    const commonSteps = [
      'Book initial consultation',
      'Prepare case documents',
      'Discuss legal strategy'
    ]

    const complexitySteps = {
      high: [...commonSteps, 'Consider retainer agreement', 'Plan for multiple court hearings'],
      medium: [...commonSteps, 'Explore settlement options'],
      low: [...commonSteps, 'Quick resolution possible']
    }

    return complexitySteps[caseAnalysis.complexity] || commonSteps
  }
}

export default LawyerMatchingEngine
