import { NextResponse } from 'next/server'

// Advanced Case Management System
class CaseManager {
  constructor() {
    this.cases = new Map()
    this.caseMetrics = new Map()
    this.notifications = new Map()
  }

  async createCase(caseData) {
    const caseId = `CASE_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const newCase = {
      id: caseId,
      clientId: caseData.clientId,
      lawyerId: caseData.lawyerId,
      caseType: caseData.caseType,
      title: caseData.title,
      description: caseData.description,
      status: 'created',
      priority: caseData.priority || 'medium',
      confidentialityLevel: caseData.confidentialityLevel || 'standard',
      
      // Case timeline
      timeline: [
        {
          id: 1,
          timestamp: new Date().toISOString(),
          event: 'case_created',
          description: 'Case created and assigned to lawyer',
          actor: 'system'
        }
      ],
      
      // Documents
      documents: caseData.documents || [],
      
      // Financial details
      billing: {
        consultationFee: caseData.consultationFee || 0,
        totalCost: 0,
        paymentStatus: 'pending',
        paymentHistory: []
      },
      
      // Communication
      communications: [],
      
      // Deadlines and reminders
      deadlines: [],
      reminders: [],
      
      // Legal research
      legalResearch: {
        relevantLaws: [],
        precedents: [],
        strategies: []
      },
      
      // Collaboration
      team: [caseData.lawyerId],
      permissions: {
        [caseData.clientId]: ['view', 'comment'],
        [caseData.lawyerId]: ['view', 'edit', 'manage']
      },
      
      // Metadata
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: caseData.clientId,
      
      // AI insights
      aiInsights: {
        caseComplexity: 'medium',
        estimatedDuration: '2-4 weeks',
        successProbability: 0.7,
        recommendedActions: []
      }
    }

    this.cases.set(caseId, newCase)
    this.initializeCaseMetrics(caseId)
    
    return newCase
  }

  async updateCase(caseId, updates, actorId) {
    const existingCase = this.cases.get(caseId)
    if (!existingCase) {
      throw new Error('Case not found')
    }

    const updatedCase = {
      ...existingCase,
      ...updates,
      updatedAt: new Date().toISOString()
    }

    // Add timeline event
    const timelineEvent = {
      id: existingCase.timeline.length + 1,
      timestamp: new Date().toISOString(),
      event: 'case_updated',
      description: `Case updated by ${actorId}`,
      actor: actorId,
      changes: Object.keys(updates)
    }

    updatedCase.timeline.push(timelineEvent)
    this.cases.set(caseId, updatedCase)
    
    // Update metrics
    this.updateCaseMetrics(caseId, updates)
    
    return updatedCase
  }

  async addDocument(caseId, document, uploadedBy) {
    const case_ = this.cases.get(caseId)
    if (!case_) {
      throw new Error('Case not found')
    }

    const documentRecord = {
      id: `DOC_${Date.now()}`,
      name: document.name,
      type: document.type,
      size: document.size,
      uploadedBy: uploadedBy,
      uploadedAt: new Date().toISOString(),
      confidentialityLevel: document.confidentialityLevel || 'standard',
      tags: document.tags || [],
      extractedText: document.extractedText || '',
      aiAnalysis: document.aiAnalysis || null
    }

    case_.documents.push(documentRecord)
    case_.timeline.push({
      id: case_.timeline.length + 1,
      timestamp: new Date().toISOString(),
      event: 'document_added',
      description: `Document "${document.name}" added by ${uploadedBy}`,
      actor: uploadedBy
    })

    this.cases.set(caseId, case_)
    return documentRecord
  }

  async addCommunication(caseId, communication, senderId) {
    const case_ = this.cases.get(caseId)
    if (!case_) {
      throw new Error('Case not found')
    }

    const commRecord = {
      id: `COMM_${Date.now()}`,
      type: communication.type, // 'message', 'email', 'call', 'meeting'
      content: communication.content,
      senderId: senderId,
      recipientIds: communication.recipientIds || [],
      timestamp: new Date().toISOString(),
      isConfidential: communication.isConfidential || false,
      attachments: communication.attachments || []
    }

    case_.communications.push(commRecord)
    case_.timeline.push({
      id: case_.timeline.length + 1,
      timestamp: new Date().toISOString(),
      event: 'communication_added',
      description: `${communication.type} sent by ${senderId}`,
      actor: senderId
    })

    this.cases.set(caseId, case_)
    return commRecord
  }

  async setDeadline(caseId, deadline, setBy) {
    const case_ = this.cases.get(caseId)
    if (!case_) {
      throw new Error('Case not found')
    }

    const deadlineRecord = {
      id: `DEADLINE_${Date.now()}`,
      title: deadline.title,
      description: deadline.description,
      dueDate: deadline.dueDate,
      priority: deadline.priority || 'medium',
      setBy: setBy,
      setAt: new Date().toISOString(),
      status: 'active',
      reminders: deadline.reminders || []
    }

    case_.deadlines.push(deadlineRecord)
    case_.timeline.push({
      id: case_.timeline.length + 1,
      timestamp: new Date().toISOString(),
      event: 'deadline_set',
      description: `Deadline "${deadline.title}" set for ${deadline.dueDate}`,
      actor: setBy
    })

    this.cases.set(caseId, case_)
    return deadlineRecord
  }

  async generateCaseReport(caseId) {
    const case_ = this.cases.get(caseId)
    if (!case_) {
      throw new Error('Case not found')
    }

    const metrics = this.caseMetrics.get(caseId) || {}
    
    return {
      caseId: caseId,
      title: case_.title,
      status: case_.status,
      summary: {
        totalDocuments: case_.documents.length,
        totalCommunications: case_.communications.length,
        activeDeadlines: case_.deadlines.filter(d => d.status === 'active').length,
        daysActive: Math.ceil((new Date() - new Date(case_.createdAt)) / (1000 * 60 * 60 * 24))
      },
      timeline: case_.timeline,
      metrics: metrics,
      billing: case_.billing,
      nextActions: this.getNextActions(case_),
      riskFactors: this.assessRiskFactors(case_),
      recommendations: this.generateRecommendations(case_)
    }
  }

  initializeCaseMetrics(caseId) {
    const metrics = {
      responseTime: [],
      documentProcessingTime: [],
      clientSatisfaction: null,
      lawyerEfficiency: null,
      caseProgress: 0,
      billableHours: 0
    }
    
    this.caseMetrics.set(caseId, metrics)
  }

  updateCaseMetrics(caseId, updates) {
    const metrics = this.caseMetrics.get(caseId) || {}
    
    if (updates.status) {
      metrics.caseProgress = this.calculateProgress(updates.status)
    }
    
    this.caseMetrics.set(caseId, metrics)
  }

  calculateProgress(status) {
    const progressMap = {
      'created': 10,
      'assigned': 20,
      'in_progress': 40,
      'review': 70,
      'awaiting_client': 80,
      'completed': 100
    }
    
    return progressMap[status] || 0
  }

  getNextActions(case_) {
    const actions = []
    
    // Check for overdue deadlines
    const overdueDeadlines = case_.deadlines.filter(d => 
      d.status === 'active' && new Date(d.dueDate) < new Date()
    )
    
    if (overdueDeadlines.length > 0) {
      actions.push({
        type: 'urgent',
        title: 'Address Overdue Deadlines',
        description: `${overdueDeadlines.length} deadline(s) are overdue`,
        priority: 'high'
      })
    }
    
    // Check for pending documents
    if (case_.documents.length === 0) {
      actions.push({
        type: 'documentation',
        title: 'Upload Case Documents',
        description: 'No documents have been uploaded for this case',
        priority: 'medium'
      })
    }
    
    return actions
  }

  assessRiskFactors(case_) {
    const risks = []
    
    // Time-based risks
    const daysSinceCreation = Math.ceil((new Date() - new Date(case_.createdAt)) / (1000 * 60 * 60 * 24))
    
    if (daysSinceCreation > 30 && case_.status === 'created') {
      risks.push({
        type: 'delay',
        severity: 'high',
        description: 'Case has been inactive for over 30 days'
      })
    }
    
    // Communication risks
    if (case_.communications.length === 0) {
      risks.push({
        type: 'communication',
        severity: 'medium',
        description: 'No communication recorded between client and lawyer'
      })
    }
    
    return risks
  }

  generateRecommendations(case_) {
    const recommendations = []
    
    // Based on case type and complexity
    if (case_.caseType === 'criminal' && case_.priority === 'high') {
      recommendations.push({
        type: 'strategy',
        title: 'Expedite Evidence Collection',
        description: 'Given the high priority criminal case, focus on gathering evidence quickly'
      })
    }
    
    // Based on AI insights
    if (case_.aiInsights.successProbability < 0.5) {
      recommendations.push({
        type: 'strategy',
        title: 'Consider Settlement',
        description: 'Low success probability suggests exploring settlement options'
      })
    }
    
    return recommendations
  }
}

const caseManager = new CaseManager()

// API endpoints
export async function POST(request) {
  try {
    const { action, ...data } = await request.json()
    
    switch (action) {
      case 'create':
        const newCase = await caseManager.createCase(data)
        return NextResponse.json({
          success: true,
          case: newCase
        })
      
      case 'update':
        const updatedCase = await caseManager.updateCase(data.caseId, data.updates, data.actorId)
        return NextResponse.json({
          success: true,
          case: updatedCase
        })
      
      case 'addDocument':
        const document = await caseManager.addDocument(data.caseId, data.document, data.uploadedBy)
        return NextResponse.json({
          success: true,
          document: document
        })
      
      case 'addCommunication':
        const communication = await caseManager.addCommunication(data.caseId, data.communication, data.senderId)
        return NextResponse.json({
          success: true,
          communication: communication
        })
      
      case 'setDeadline':
        const deadline = await caseManager.setDeadline(data.caseId, data.deadline, data.setBy)
        return NextResponse.json({
          success: true,
          deadline: deadline
        })
      
      case 'generateReport':
        const report = await caseManager.generateCaseReport(data.caseId)
        return NextResponse.json({
          success: true,
          report: report
        })
      
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }
    
  } catch (error) {
    console.error('Case management error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to process request' },
      { status: 500 }
    )
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const caseId = searchParams.get('caseId')
    const userId = searchParams.get('userId')
    
    if (caseId) {
      // Get specific case
      const case_ = caseManager.cases.get(caseId)
      if (!case_) {
        return NextResponse.json(
          { error: 'Case not found' },
          { status: 404 }
        )
      }
      
      return NextResponse.json({
        success: true,
        case: case_
      })
    }
    
    if (userId) {
      // Get cases for user
      const userCases = Array.from(caseManager.cases.values()).filter(case_ => 
        case_.clientId === userId || case_.lawyerId === userId
      )
      
      return NextResponse.json({
        success: true,
        cases: userCases
      })
    }
    
    // Get all cases (with pagination in production)
    const allCases = Array.from(caseManager.cases.values())
    
    return NextResponse.json({
      success: true,
      cases: allCases
    })
    
  } catch (error) {
    console.error('Case retrieval error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve cases' },
      { status: 500 }
    )
  }
}
