import { createWorker } from 'tesseract.js'
import pdfParse from 'pdf-parse'
import sharp from 'sharp'

class DocumentProcessor {
  constructor() {
    this.ocrWorker = null
    this.initializeOCR()
  }

  async initializeOCR() {
    try {
      this.ocrWorker = await createWorker(['eng', 'hin'])
    } catch (error) {
      console.error('Failed to initialize OCR worker:', error)
    }
  }

  async processDocument(file, fileBuffer) {
    const fileType = file.type || this.getFileTypeFromName(file.name)
    let extractedText = ''
    let metadata = {
      fileName: file.name,
      fileType: fileType,
      fileSize: file.size,
      processedAt: new Date().toISOString()
    }

    try {
      switch (true) {
        case fileType.includes('pdf'):
          extractedText = await this.processPDF(fileBuffer)
          break
        
        case fileType.includes('image'):
          extractedText = await this.processImage(fileBuffer)
          break
        
        case fileType.includes('text'):
          extractedText = fileBuffer.toString('utf-8')
          break
        
        case fileType.includes('word') || fileType.includes('msword'):
          extractedText = await this.processWordDocument(fileBuffer)
          break
        
        default:
          throw new Error(`Unsupported file type: ${fileType}`)
      }

      // Clean and validate extracted text
      extractedText = this.cleanExtractedText(extractedText)
      
      // Analyze document for legal content
      const analysis = await this.analyzeLegalContent(extractedText)
      
      return {
        extractedText,
        metadata: {
          ...metadata,
          ...analysis,
          wordCount: extractedText.split(' ').length,
          language: this.detectLanguage(extractedText)
        }
      }

    } catch (error) {
      console.error('Document processing error:', error)
      throw new Error(`Failed to process document: ${error.message}`)
    }
  }

  async processPDF(buffer) {
    try {
      const data = await pdfParse(buffer)
      return data.text
    } catch (error) {
      console.error('PDF processing error:', error)
      throw new Error('Failed to extract text from PDF')
    }
  }

  async processImage(buffer) {
    try {
      if (!this.ocrWorker) {
        await this.initializeOCR()
      }

      // Optimize image for OCR
      const optimizedImage = await sharp(buffer)
        .resize({ width: 2000, height: 2000, fit: 'inside', withoutEnlargement: true })
        .normalize()
        .sharpen()
        .toBuffer()

      const { data: { text } } = await this.ocrWorker.recognize(optimizedImage)
      return text
    } catch (error) {
      console.error('Image OCR error:', error)
      throw new Error('Failed to extract text from image')
    }
  }

  async processWordDocument(buffer) {
    // For Word documents, you might need mammoth.js or similar
    // For now, returning error message
    throw new Error('Word document processing not yet implemented. Please convert to PDF or upload as image.')
  }

  cleanExtractedText(text) {
    return text
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/\n\s*\n/g, '\n') // Remove empty lines
      .trim()
  }

  detectLanguage(text) {
    // Simple language detection
    const hindiPattern = /[\u0900-\u097F]/
    const englishPattern = /[a-zA-Z]/
    
    const hindiChars = (text.match(hindiPattern) || []).length
    const englishChars = (text.match(englishPattern) || []).length
    
    if (hindiChars > englishChars) return 'hindi'
    if (englishChars > 0) return 'english'
    return 'unknown'
  }

  async analyzeLegalContent(text) {
    const legalIndicators = {
      documentTypes: {
        'legal_notice': ['legal notice', 'notice', 'demand', 'cease and desist'],
        'contract': ['agreement', 'contract', 'terms and conditions', 'whereas'],
        'court_order': ['court order', 'judgment', 'decree', 'writ'],
        'complaint': ['complaint', 'petition', 'application', 'pray'],
        'police_report': ['fir', 'police', 'station', 'complaint number'],
        'property_document': ['sale deed', 'property', 'land', 'survey number'],
        'employment': ['employment', 'salary', 'termination', 'appointment']
      },
      
      legalEntities: {
        'courts': ['supreme court', 'high court', 'district court', 'sessions court'],
        'acts': ['indian penal code', 'ipc', 'crpc', 'consumer protection act'],
        'sections': /section\s+\d+/gi,
        'articles': /article\s+\d+/gi
      },
      
      urgencyIndicators: [
        'urgent', 'immediate', 'notice period', 'time limit', 'deadline',
        'show cause', 'appear before', 'within days'
      ]
    }

    const analysis = {
      documentType: 'general',
      legalConcepts: [],
      urgencyLevel: 'low',
      referencedLaws: [],
      suggestedActions: []
    }

    const textLower = text.toLowerCase()

    // Detect document type
    for (const [type, keywords] of Object.entries(legalIndicators.documentTypes)) {
      if (keywords.some(keyword => textLower.includes(keyword))) {
        analysis.documentType = type
        break
      }
    }

    // Extract legal references
    const sections = text.match(legalIndicators.legalEntities.sections) || []
    const articles = text.match(legalIndicators.legalEntities.articles) || []
    analysis.referencedLaws = [...sections, ...articles]

    // Check urgency
    const urgentKeywords = legalIndicators.urgencyIndicators.filter(
      keyword => textLower.includes(keyword)
    )
    if (urgentKeywords.length > 0) {
      analysis.urgencyLevel = urgentKeywords.length > 2 ? 'high' : 'medium'
    }

    // Suggest actions based on document type
    analysis.suggestedActions = this.getSuggestedActions(analysis.documentType)

    return analysis
  }

  getSuggestedActions(documentType) {
    const actionMap = {
      'legal_notice': [
        'Respond within the notice period',
        'Consult a lawyer immediately',
        'Gather relevant documents and evidence',
        'Consider negotiation or mediation'
      ],
      'court_order': [
        'Comply with court directions',
        'File compliance affidavit if required',
        'Consult lawyer for appeal options',
        'Maintain record of compliance'
      ],
      'contract': [
        'Review terms and conditions carefully',
        'Identify obligations and rights',
        'Check for unfair clauses',
        'Understand termination conditions'
      ],
      'complaint': [
        'Prepare detailed response',
        'Gather supporting documents',
        'File counter-claim if applicable',
        'Engage legal representation'
      ],
      'property_document': [
        'Verify document authenticity',
        'Check for encumbrances',
        'Ensure proper registration',
        'Obtain legal clearance certificate'
      ]
    }

    return actionMap[documentType] || [
      'Review document carefully',
      'Identify key legal issues',
      'Consult appropriate legal expert',
      'Maintain proper documentation'
    ]
  }

  getFileTypeFromName(fileName) {
    const extension = fileName.split('.').pop().toLowerCase()
    const typeMap = {
      'pdf': 'application/pdf',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'txt': 'text/plain',
      'doc': 'application/msword',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    }
    return typeMap[extension] || 'application/octet-stream'
  }

  async cleanup() {
    if (this.ocrWorker) {
      await this.ocrWorker.terminate()
    }
  }
}

export default DocumentProcessor
