'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '../../lib/firebaseClient'
import { onAuthStateChanged } from 'firebase/auth'
import { Upload, Send, FileText, Mic, MicOff } from 'lucide-react'
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
      content: 'Hello! I\'m your AI legal assistant. I can help you understand Indian laws and connect you with qualified lawyers. How can I assist you today?',
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
    <div className="flex flex-col h-screen max-w-4xl mx-auto">
      <div className="bg-slate-700 text-white p-4 shadow-lg">
        <h1 className="text-xl font-bold">Legal Assistant Chat</h1>
        <p className="text-sm text-slate-200 mt-1">
          💬 Ask legal questions and get lawyer recommendations
        </p>
        {authError && (
          <div className="bg-red-500 text-white p-2 rounded mt-2 text-sm">
            Authentication Error: {authError}
          </div>
        )}
        {!user && !authError && (
          <p className="text-sm text-slate-200 mt-1">
            For case management and advanced features, please{' '}
            <button 
              onClick={() => router.push('/login')}
              className="underline hover:text-white"
            >
              sign in
            </button>
          </p>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-3xl p-4 rounded-lg ${
                message.type === 'user'
                  ? 'bg-slate-700 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <div className="text-sm">
                {formatMessage(message.content)}
              </div>
              
              {message.relevantLaws && (
                <div className="mt-3 p-3 bg-emerald-50 rounded border-l-4 border-emerald-400">
                  <h4 className="font-semibold text-emerald-800 mb-2">Relevant Laws:</h4>
                  <ul className="text-sm text-emerald-700">
                    {message.relevantLaws.map((law, index) => (
                      <li key={index} className="mb-1">• {law}</li>
                    ))}
                  </ul>
                </div>
              )}

              {message.suggestedLawyers && message.suggestedLawyers.length > 0 && (
                <div className="mt-3 p-3 bg-blue-50 rounded border-l-4 border-blue-400">
                  <h4 className="font-semibold text-blue-800 mb-2">
                    🧑‍⚖️ Suggested Lawyers ({message.suggestedLawyers.length})
                  </h4>
                  <div className="space-y-2">
                    {message.suggestedLawyers.map((lawyer, index) => (
                      <div key={index} className="text-sm bg-white p-2 rounded shadow-sm">
                        <div className="font-medium text-blue-700">{lawyer.name}</div>
                        <div className="text-blue-600 text-xs">
                          {lawyer.specialization} • {lawyer.location}
                        </div>
                        <div className="text-gray-600 text-xs mt-1">
                          {lawyer.experience} experience • ⭐ {lawyer.rating}/5
                        </div>
                        <div className="text-gray-600 text-xs">
                          Fee: {lawyer.consultationFee}
                        </div>
                        <button 
                          onClick={() => router.push(`/lawyers/${lawyer.id}`)}
                          className="text-blue-600 hover:underline text-xs mt-1 inline-block"
                        >
                          View Profile & Contact →
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="text-xs opacity-70 mt-2">
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-900 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-600"></div>
                <span>Analyzing your query...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t bg-white p-4">
        <form onSubmit={handleSubmit} className="flex items-end space-x-2">
          <div className="flex-1">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Describe your legal question or situation..."
              className="w-full p-3 border border-slate-300 rounded-lg resize-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              rows={3}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit(e)
                }
              }}
            />
          </div>
          
          <div className="flex flex-col space-y-2">
            <button
              type="button"
              onClick={() => setShowFileUpload(true)}
              className="p-3 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-colors"
              title="Upload Document"
            >
              <Upload size={20} />
            </button>
            
            <button
              type="button"
              onClick={isListening ? stopListening : startListening}
              className={`p-3 rounded-lg transition-colors ${
                isListening 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-emerald-500 hover:bg-emerald-600 text-white'
              }`}
              title={isListening ? "Stop Recording" : "Start Voice Input"}
            >
              {isListening ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
            
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="p-3 bg-slate-700 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
