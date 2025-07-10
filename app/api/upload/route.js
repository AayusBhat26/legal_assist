import { NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import DocumentProcessor from '../../../lib/legal-knowledge/documentProcessor.js'
import LegalRAGSystem from '../../../lib/legal-knowledge/ragSystem.js'

// Initialize processors
const documentProcessor = new DocumentProcessor()
const legalRAG = new LegalRAGSystem()

export async function POST(request) {
  try {
    const data = await request.formData()
    const file = data.get('file')

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'uploads')
    
    // Save file temporarily
    const filename = `${Date.now()}_${file.name}`
    const filepath = join(uploadsDir, filename)
    
    try {
      await writeFile(filepath, buffer)
    } catch (dirError) {
      // If directory doesn't exist, create it
      const fs = require('fs')
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true })
        await writeFile(filepath, buffer)
      } else {
        throw dirError
      }
    }

    // Process document using advanced processor
    const processedDocument = await documentProcessor.processDocument(file, buffer)
    
    // Generate legal insights using RAG system
    const legalInsights = await legalRAG.generateLegalAdvice(
      `Please analyze this legal document: ${processedDocument.extractedText}`,
      [],
      `Document Type: ${processedDocument.metadata.documentType}\nUrgency: ${processedDocument.metadata.urgencyLevel}`
    )

    // Clean up temporary file
    try {
      const fs = require('fs')
      fs.unlinkSync(filepath)
    } catch (cleanupError) {
      console.warn('Failed to cleanup temporary file:', cleanupError)
    }

    return NextResponse.json({
      success: true,
      extractedText: processedDocument.extractedText,
      fileUrl: `/uploads/${filename}`,
      metadata: processedDocument.metadata,
      legalAnalysis: {
        documentType: processedDocument.metadata.documentType,
        urgencyLevel: processedDocument.metadata.urgencyLevel,
        suggestedActions: processedDocument.metadata.suggestedActions,
        referencedLaws: processedDocument.metadata.referencedLaws
      },
      aiInsights: {
        summary: legalInsights.response,
        relevantLaws: legalInsights.relevantLaws,
        confidence: legalInsights.confidence
      }
    })

  } catch (error) {
    console.error('Upload processing error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to process uploaded file',
        details: error.message 
      },
      { status: 500 }
    )
  }
}
