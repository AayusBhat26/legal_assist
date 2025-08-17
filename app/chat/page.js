'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '../../lib/firebaseClient'
import { onAuthStateChanged } from 'firebase/auth'
import { Upload, Send, FileText, Mic, MicOff, Brain, MessageSquare, Users, ArrowRight } from 'lucide-react'
import FileUpload from '../../components/FileUpload'

export default function ChatPage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState(null)
  const router = useRouter()
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Hello! I\'m your AI legal assistant, powered by advanced machine learning and comprehensive Indian legal knowledge. I can help you understand laws, analyze documents, and connect you with qualified lawyers. How can I assist you today?',
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [showFileUpload, setShowFileUpload] = useState(false)
  const messagesEndRef = useRef(null)
  const recognition = useRef(null)

  useEffect(() => {
    // Set up Firebase auth listener with error handling
    let unsubscribe = () => {}
    
    try {
      if (auth && typeof auth.onAuthStateChanged === 'function') {
        unsubscribe = onAuthStateChanged(auth, 
          (user) => {
            setUser(user)
            setLoading(false)
            setAuthError(null)
          },
          (error) => {
            console.error('Auth error:', error)
            setAuthError(error.message)
            setLoading(false)
          }
        )
      } else {
        console.warn('Firebase auth not available')
        setLoading(false)
        setAuthError('Authentication not available')
      }
    } catch (error) {
      console.error('Firebase initialization error:', error)
      setLoading(false)
      setAuthError('Firebase initialization failed')
    }

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe()
      }
    }
  }, [])

  useEffect(() => {
    if (!loading && !user) {
      // Allow anonymous chat but with limited features
    }
    scrollToBottom()
  }, [messages, user, loading])

  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      recognition.current = new window.webkitSpeechRecognition()
      recognition.current.continuous = false
      recognition.current.interimResults = false
      recognition.current.lang = 'en-IN'
      
      recognition.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setInputMessage(transcript)
        setIsListening(false)
      }
      
      recognition.current.onend = () => {
        setIsListening(false)
      }
    }
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const startListening = () => {
    if (recognition.current) {
      setIsListening(true)
      recognition.current.start()
    }
  }

  const stopListening = () => {
    if (recognition.current) {
      recognition.current.stop()
      setIsListening(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!inputMessage.trim() || isLoading) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          userId: user?.uid,
          chatHistory: messages
        }),
      })

      const data = await response.json()
      
      console.log('Chat response data:', data)
      console.log('Suggested lawyers:', data.suggestedLawyers)
      
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: data.response,
        timestamp: new Date(),
        caseType: data.caseType,
        suggestedLawyers: data.suggestedLawyers,
        relevantLaws: data.relevantLaws
      }

      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: 'I apologize, but I encountered an error. Please try again later.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = (fileData) => {
    const fileMessage = {
      id: Date.now(),
      type: 'user',
      content: `Uploaded file: ${fileData.fileName}`,
      fileContent: fileData.extractedText,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, fileMessage])
    
    // Process the file content automatically
    if (fileData.extractedText) {
      setInputMessage(`Please analyze this document: ${fileData.extractedText.substring(0, 500)}...`)
    }
  }

  const formatMessage = (content) => {
    // Simple formatting for legal advice
    return content.split('\n').map((line, index) => (
      <p key={index} className="mb-2">{line}</p>
    ))
  }

  return (
    <div className="flex flex-col h-screen max-w-6xl mx-auto bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-slate-700 to-emerald-600 rounded-xl flex items-center justify-center">
                <Brain className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">AI Legal Assistant</h1>
                <p className="text-slate-600 flex items-center">
                  <MessageSquare className="mr-1" size={14} />
                  Powered by Advanced AI & Legal Knowledge Base
                </p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-sm text-slate-600">
                <span className="font-medium">50,000+</span> users trust our platform
              </div>
              <button 
                onClick={() => router.push('/lawyers')}
                className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 font-medium"
              >
                <Users size={16} />
                <span>Find Lawyers</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-4xl p-6 rounded-2xl shadow-sm ${
                message.type === 'user'
                  ? 'bg-gradient-to-r from-slate-700 to-slate-800 text-white'
                  : 'bg-white text-slate-900 border border-gray-100'
              }`}
            >
              <div className="text-base leading-relaxed">
                {formatMessage(message.content)}
              </div>
              
              {message.relevantLaws && (
                <div className="mt-4 p-4 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl border border-emerald-200">
                  <h4 className="font-semibold text-emerald-800 mb-3 flex items-center">
                    <FileText className="mr-2" size={16} />
                    Relevant Laws & Regulations
                  </h4>
                  <ul className="text-sm text-emerald-700 space-y-1">
                    {message.relevantLaws.map((law, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        {law}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {message.suggestedLawyers && message.suggestedLawyers.length > 0 && (
                <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                    <Users className="mr-2" size={16} />
                    Recommended Lawyers ({message.suggestedLawyers.length})
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {message.suggestedLawyers.map((lawyer, index) => (
                      <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-blue-100 hover:shadow-md transition-shadow">
                        <div className="font-semibold text-blue-700 mb-1">{lawyer.name}</div>
                        <div className="text-blue-600 text-sm mb-2">
                          {lawyer.specialization} • {lawyer.location}
                        </div>
                        <div className="text-slate-600 text-sm mb-3">
                          {lawyer.experience} experience • ⭐ {lawyer.rating}/5
                        </div>
                        <div className="text-slate-700 text-sm font-medium mb-3">
                          Consultation Fee: {lawyer.consultationFee}
                        </div>
                        <button 
                          onClick={() => router.push(`/lawyers/${lawyer.id}`)}
                          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 text-sm font-medium flex items-center justify-center"
                        >
                          View Profile
                          <ArrowRight className="ml-1" size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="text-xs text-slate-500 mt-3">
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white text-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-emerald-600"></div>
                <span className="text-slate-700">Analyzing your query with AI...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="flex items-end space-x-4">
          <div className="flex-1">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Describe your legal question, situation, or upload a document for analysis..."
              className="w-full p-4 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-base"
              rows={3}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit(e)
                }
              }}
            />
          </div>
          
          <div className="flex flex-col space-y-3">
            <button
              type="button"
              onClick={() => setShowFileUpload(true)}
              className="p-4 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors border border-slate-200"
              title="Upload Document"
            >
              <Upload size={20} />
            </button>
            
            <button
              type="button"
              onClick={isListening ? stopListening : startListening}
              className={`p-4 rounded-xl transition-all duration-200 border ${
                isListening 
                  ? 'bg-red-500 hover:bg-red-600 text-white border-red-500' 
                  : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-700 border-emerald-200'
              }`}
              title={isListening ? "Stop Recording" : "Start Voice Input"}
            >
              {isListening ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
            
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="p-4 bg-gradient-to-r from-slate-700 to-emerald-600 text-white rounded-xl hover:from-slate-800 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
              title="Send Message"
            >
              <Send size={20} />
            </button>
          </div>
        </form>
      </div>

      {showFileUpload && (
        <FileUpload
          onUpload={handleFileUpload}
          onClose={() => setShowFileUpload(false)}
        />
      )}
    </div>
  )
}
