
import Link from 'next/link'
import SectionOne from './components/SectionOne'
import SectionTwo from './components/SectionTwo'
import SectionThree from './components/SectionThree'
import SectionFour from './components/SectionFour'
import { MessageSquare, Users, FileText, Shield, Brain, Scale, Clock, CheckCircle, Star, ArrowRight } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-16 bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 rounded-xl shadow-sm">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Brain className="mr-2" size={16} />
            Powered by Advanced AI & Legal Knowledge Base
          </div>
          <h1 className="text-6xl font-bold text-slate-900 mb-6 leading-tight">
            Your Complete Legal
            <span className="bg-gradient-to-r from-slate-700 to-emerald-600 bg-clip-text text-transparent"> AI Assistant</span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Get instant legal guidance through our advanced AI system, analyze documents with OCR, 
            and connect with verified lawyers. Built specifically for Indian legal system with 
            comprehensive case law and regulatory knowledge.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link 
              href="/chat"
              className="bg-slate-700 text-white px-8 py-4 rounded-lg hover:bg-slate-800 transition-all transform hover:scale-105 font-semibold text-lg shadow-lg"
            >
              Start AI Legal Chat
            </Link>
            <Link 
              href="/lawyers"
              className="bg-emerald-600 text-white px-8 py-4 rounded-lg hover:bg-emerald-700 transition-all transform hover:scale-105 font-semibold text-lg shadow-lg"
            >
              Find Expert Lawyers
            </Link>
          </div>
          <div className="flex items-center justify-center space-x-8 text-sm text-slate-600">
            <div className="flex items-center">
              <CheckCircle className="mr-2 text-emerald-500" size={16} />
              <span>10,000+ Cases Resolved</span>
            </div>
            <div className="flex items-center">
              <Star className="mr-2 text-amber-500" size={16} />
              <span>4.8/5 User Rating</span>
            </div>
            <div className="flex items-center">
              <Shield className="mr-2 text-slate-500" size={16} />
              <span>Bank-grade Security</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="text-center p-6 bg-white rounded-lg shadow-md border border-slate-200 hover:shadow-lg transition-shadow">
          <MessageSquare className="mx-auto mb-4 text-slate-700" size={48} />
          <h3 className="text-lg font-semibold mb-2 text-slate-900">AI Legal Chat</h3>
          <p className="text-slate-600 text-sm">
            Get instant answers to legal questions in simple language
          </p>
        </div>
        
        <div className="text-center p-6 bg-white rounded-lg shadow-md border border-slate-200 hover:shadow-lg transition-shadow">
          <Users className="mx-auto mb-4 text-emerald-600" size={48} />
          <h3 className="text-lg font-semibold mb-2 text-slate-900">Expert Lawyers</h3>
          <p className="text-slate-600 text-sm">
            Connect with verified lawyers specializing in your case type
          </p>
        </div>
        
        <div className="text-center p-6 bg-white rounded-lg shadow-md border border-slate-200 hover:shadow-lg transition-shadow">
          <FileText className="mx-auto mb-4 text-amber-600" size={48} />
          <h3 className="text-lg font-semibold mb-2 text-slate-900">Document Analysis</h3>
          <p className="text-slate-600 text-sm">
            Upload PDFs and images for AI-powered legal document analysis
          </p>
        </div>
        
        <div className="text-center p-6 bg-white rounded-lg shadow-md border border-slate-200 hover:shadow-lg transition-shadow">
          <Shield className="mx-auto mb-4 text-red-600" size={48} />
          <h3 className="text-lg font-semibold mb-2 text-slate-900">Secure & Private</h3>
          <p className="text-slate-600 text-sm">
            Your legal matters are protected with end-to-end encryption
          </p>
        </div>
      </section>

      {/* Existing Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <SectionOne />
        <SectionTwo />
        <SectionThree />
        <SectionFour />
      </div>

      {/* Call to Action */}
      <section className="text-center py-12 bg-slate-700 text-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-4">Ready to Get Legal Help?</h2>
        <p className="text-xl mb-8 text-slate-200">
          Join thousands of users who trust our AI legal assistant for reliable guidance
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/chat"
            className="bg-white text-slate-700 px-8 py-3 rounded-lg hover:bg-slate-100 transition-colors font-semibold shadow-md"
          >
            Try Free Chat
          </Link>
          <Link 
            href="/login"
            className="bg-emerald-600 text-white px-8 py-3 rounded-lg hover:bg-emerald-700 transition-colors font-semibold border border-emerald-500"
          >
            Sign Up Now
          </Link>
        </div>
      </section>
    </div>
  )
}
