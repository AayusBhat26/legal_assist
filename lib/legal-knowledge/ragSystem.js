import { GoogleGenerativeAI } from '@google/generative-ai'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai'
import { MemoryVectorStore } from 'langchain/vectorstores/memory'
import { Document } from '@langchain/core/documents'

class LegalRAGSystem {
  constructor() {
    if (!process.env.GOOGLE_GEMINI_API_KEY) {
      throw new Error('GOOGLE_GEMINI_API_KEY is not configured')
    }
    
    this.geminiAPI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY)
    this.model = this.geminiAPI.getGenerativeModel({ 
      model: 'gemini-1.5-flash' // Updated to a more stable model
    })
    
    this.embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GOOGLE_GEMINI_API_KEY,
      model: 'text-embedding-004' // Updated embedding model
    })
    
    this.vectorStore = null
    this.textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    })
    
    this.initializeKnowledgeBase()
  }

  async initializeKnowledgeBase() {
    // Indian Legal Knowledge Base
    const legalDocuments = [
      // Constitution of India
      {
        content: `Article 14: Right to Equality - The State shall not deny to any person equality before the law or the equal protection of the laws within the territory of India. This fundamental right ensures that all persons, regardless of their status, are treated equally under the law.`,
        metadata: { source: 'Constitution of India', article: '14', category: 'Fundamental Rights' }
      },
      {
        content: `Article 19: Right to Freedom - All citizens shall have the right to freedom of speech and expression, to assemble peaceably and without arms, to form associations or unions, to move freely throughout India, and to practice any profession or carry on any occupation, trade or business.`,
        metadata: { source: 'Constitution of India', article: '19', category: 'Fundamental Rights' }
      },
      {
        content: `Article 21: Right to Life and Personal Liberty - No person shall be deprived of his life or personal liberty except according to procedure established by law. This includes right to live with dignity, right to privacy, right to health, and right to education.`,
        metadata: { source: 'Constitution of India', article: '21', category: 'Fundamental Rights' }
      },

      // Indian Penal Code (IPC)
      {
        content: `Section 375 IPC: Rape - A man is said to commit rape if he has sexual intercourse with a woman against her will, without her consent, with her consent obtained by putting her in fear of death or hurt, or with her consent when she believes he is her husband.`,
        metadata: { source: 'Indian Penal Code', section: '375', category: 'Criminal Law' }
      },
      {
        content: `Section 420 IPC: Cheating and dishonestly inducing delivery of property - Whoever cheats and thereby dishonestly induces the person deceived to deliver any property shall be punished with imprisonment up to seven years and fine.`,
        metadata: { source: 'Indian Penal Code', section: '420', category: 'Criminal Law' }
      },
      {
        content: `Section 498A IPC: Domestic Violence - Whoever, being the husband or relative of the husband of a woman, subjects such woman to cruelty shall be punished with imprisonment up to three years and fine.`,
        metadata: { source: 'Indian Penal Code', section: '498A', category: 'Criminal Law', subcategory: 'Domestic Violence' }
      },

      // Consumer Protection Act
      {
        content: `Consumer Protection Act 2019: Consumer Rights - Every consumer has the right to be protected against marketing of goods and services which are hazardous to life and property, right to be informed about quality, quantity, potency, purity, standard and price of goods or services, right to be assured access to variety of goods and services at competitive prices.`,
        metadata: { source: 'Consumer Protection Act 2019', category: 'Consumer Law' }
      },
      {
        content: `Consumer Complaint Process: A consumer can file a complaint in District Forum (up to ₹1 crore), State Commission (₹1 crore to ₹10 crore), or National Commission (above ₹10 crore). Complaint must be filed within 2 years of cause of action. No court fee for complaints up to ₹5 lakhs.`,
        metadata: { source: 'Consumer Protection Act 2019', category: 'Consumer Law', procedure: 'Complaint Filing' }
      },

      // Family Law
      {
        content: `Hindu Marriage Act 1955: Grounds for Divorce - Adultery, cruelty (mental or physical), desertion for 2+ years, conversion to another religion, unsound mind, incurable leprosy, venereal disease, renunciation of world. Mutual consent divorce also available under Section 13B.`,
        metadata: { source: 'Hindu Marriage Act 1955', category: 'Family Law', type: 'Divorce' }
      },
      {
        content: `Child Custody Laws: Courts decide custody based on child's welfare as paramount consideration. Generally, children below 5 years stay with mother. Father's financial capacity, mother's moral character, child's preference (if mature) are considered.`,
        metadata: { source: 'Family Courts Act', category: 'Family Law', type: 'Child Custody' }
      },

      // Property Law
      {
        content: `Transfer of Property Act 1882: A sale is a transfer of ownership in exchange for a price paid or promised. For immovable property above ₹100, sale deed must be registered. Stamp duty varies by state. Both buyer and seller must sign in presence of witnesses.`,
        metadata: { source: 'Transfer of Property Act 1882', category: 'Property Law', type: 'Sale' }
      },
      {
        content: `Rent Control Laws: Tenant cannot be evicted except on specific grounds - non-payment of rent, subletting without permission, using premises for illegal purpose, causing damage to property. Landlord must give notice period as per state rent control act.`,
        metadata: { source: 'Rent Control Act', category: 'Property Law', type: 'Rental' }
      },

      // Labour Law
      {
        content: `Industrial Disputes Act 1947: No workman can be retrenched unless 1 month's notice or pay in lieu, compensation equal to 15 days average pay for each completed year of service, and permission from appropriate government if establishment employs 100+ workers.`,
        metadata: { source: 'Industrial Disputes Act 1947', category: 'Labour Law', type: 'Retrenchment' }
      },
      {
        content: `Sexual Harassment at Workplace Act 2013: Every workplace with 10+ employees must constitute Internal Complaints Committee. Complaint to be filed within 3 months. Interim relief can include transfer of complainant or respondent. Penalty for false complaint possible.`,
        metadata: { source: 'POSH Act 2013', category: 'Labour Law', type: 'Sexual Harassment' }
      },

      // Cyber Law
      {
        content: `Information Technology Act 2000: Section 66A (now struck down) dealt with offensive messages. Section 67 criminalizes publishing obscene material. Section 43 provides for compensation for data damage. Cyber crimes can be reported to local police or cybercrime cell.`,
        metadata: { source: 'IT Act 2000', category: 'Cyber Law' }
      },

      // Civil Procedure
      {
        content: `Civil Procedure Code: Limitation period for filing suit - 3 years for recovery of immovable property, 3 years for compensation for negligence, 1 year for defamation, 3 years for breach of contract. Time starts from when cause of action arises.`,
        metadata: { source: 'Code of Civil Procedure 1908', category: 'Civil Law', type: 'Limitation' }
      }
    ]

    // Convert to Document objects
    const documents = legalDocuments.map(doc => 
      new Document({
        pageContent: doc.content,
        metadata: doc.metadata
      })
    )

    // Split documents and create vector store
    const splitDocs = await this.textSplitter.splitDocuments(documents)
    this.vectorStore = await MemoryVectorStore.fromDocuments(splitDocs, this.embeddings)
  }

  async searchLegalKnowledge(query, topK = 5) {
    if (!this.vectorStore) {
      await this.initializeKnowledgeBase()
    }

    const results = await this.vectorStore.similaritySearch(query, topK)
    return results.map(doc => ({
      content: doc.pageContent,
      metadata: doc.metadata,
      relevanceScore: doc.score || 0
    }))
  }

  async generateLegalAdvice(userQuery, chatHistory = [], documentContext = '') {
    try {
      // Get relevant legal knowledge
      const relevantDocs = await this.searchLegalKnowledge(userQuery)
      
      // Build context from retrieved documents
      const legalContext = relevantDocs
        .map(doc => `${doc.metadata.source}: ${doc.content}`)
        .join('\n\n')

      // Prepare the full prompt for Gemini
      const fullPrompt = `You are an expert AI legal assistant specializing in Indian law. You provide accurate, helpful legal information while maintaining appropriate disclaimers.

INSTRUCTIONS:
1. Analyze the user's query in the context of Indian law
2. Use the provided legal knowledge to give specific, relevant advice
3. Cite specific laws, sections, and articles when applicable
4. Explain complex legal concepts in simple language
5. Always include appropriate legal disclaimers
6. If the query requires urgent legal action, emphasize consulting a lawyer immediately
7. For document analysis, focus on key legal issues and relevant laws

LEGAL KNOWLEDGE CONTEXT:
${legalContext}

${documentContext ? `DOCUMENT CONTEXT: ${documentContext}` : ''}

CONVERSATION HISTORY:
${chatHistory.slice(-3).map(msg => `${msg.type}: ${msg.content}`).join('\n')}

GUIDELINES:
- Be empathetic and understanding
- Provide actionable guidance where possible
- Explain rights and legal options clearly
- Mention relevant time limits and procedures
- Suggest when professional legal help is essential

Remember: You are providing legal information, not legal advice. Always recommend consulting with a qualified lawyer for specific legal matters.

USER QUERY: ${userQuery}

Please provide a comprehensive legal response:`

      const result = await this.model.generateContent(fullPrompt)
      
      // Check if the response is valid
      if (!result || !result.response) {
        throw new Error('Invalid response from Gemini API')
      }
      
      const response = result.response.text()
      
      if (!response || response.trim() === '') {
        throw new Error('Empty response from Gemini API')
      }

      return {
        response: response,
        relevantLaws: relevantDocs.map(doc => `${doc.metadata.source} ${doc.metadata.section || doc.metadata.article || ''}`),
        citations: relevantDocs.map(doc => doc.metadata),
        confidence: this.calculateConfidence(relevantDocs)
      }

    } catch (error) {
      console.error('Error generating legal advice:', error)
      
      // Provide more specific error messages
      if (error.message?.includes('404') || error.status === 404) {
        throw new Error('Gemini API endpoint not found. Please check your API key and model configuration.')
      } else if (error.message?.includes('403') || error.status === 403) {
        throw new Error('Gemini API access forbidden. Please check your API key permissions.')
      } else if (error.message?.includes('quota') || error.message?.includes('limit')) {
        throw new Error('Gemini API quota exceeded. Please check your usage limits.')
      } else if (error.message?.includes('Invalid response')) {
        throw new Error('Invalid response from Gemini API. Please try again.')
      } else {
        throw new Error(`Failed to generate legal advice: ${error.message}`)
      }
    }
  }

  classifyLegalQuery(query) {
    const categories = {
      'criminal': ['crime', 'criminal', 'police', 'arrest', 'bail', 'fir', 'chargesheet', 'murder', 'theft', 'rape', 'assault'],
      'family': ['divorce', 'marriage', 'custody', 'alimony', 'domestic', 'family', 'child', 'wife', 'husband'],
      'property': ['property', 'land', 'rent', 'landlord', 'tenant', 'eviction', 'sale', 'purchase', 'registration'],
      'consumer': ['consumer', 'product', 'service', 'refund', 'warranty', 'complaint', 'defective'],
      'labour': ['job', 'employment', 'salary', 'termination', 'harassment', 'workplace', 'leave', 'overtime'],
      'cyber': ['cyber', 'online', 'internet', 'hacking', 'fraud', 'digital', 'social media', 'data'],
      'civil': ['contract', 'agreement', 'breach', 'compensation', 'negligence', 'damages', 'suit', 'court']
    }

    const queryLower = query.toLowerCase()
    
    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => queryLower.includes(keyword))) {
        return category
      }
    }
    
    return 'general'
  }

  calculateConfidence(relevantDocs) {
    if (!relevantDocs.length) return 0.3
    
    // Calculate confidence based on relevance scores and document count
    const avgRelevance = relevantDocs.reduce((sum, doc) => sum + (doc.relevanceScore || 0.5), 0) / relevantDocs.length
    const docCountBonus = Math.min(relevantDocs.length / 5, 0.2)
    
    return Math.min(avgRelevance + docCountBonus, 0.95)
  }

  async addLegalDocument(content, metadata) {
    const document = new Document({
      pageContent: content,
      metadata: metadata
    })

    const splitDocs = await this.textSplitter.splitDocuments([document])
    
    if (this.vectorStore) {
      await this.vectorStore.addDocuments(splitDocs)
    }
  }
}

export default LegalRAGSystem
