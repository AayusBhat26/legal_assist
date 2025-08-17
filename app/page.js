
import Link from 'next/link'
import SectionOne from './components/SectionOne'
import SectionTwo from './components/SectionTwo'
import SectionThree from './components/SectionThree'
import SectionFour from './components/SectionFour'
import { MessageSquare, Users, FileText, Shield, Brain, Scale, Clock, CheckCircle, Star, ArrowRight, Zap, Award, Globe } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-emerald-50 py-20">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]"></div>
        <div className="relative max-w-6xl mx-auto px-4">
          <div className="text-center">
            <div className="inline-flex items-center bg-gradient-to-r from-emerald-100 to-blue-100 text-emerald-800 px-6 py-3 rounded-full text-sm font-semibold mb-8 shadow-sm">
              <Brain className="mr-2" size={18} />
              Powered by Advanced AI & Legal Knowledge Base
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-8 leading-tight">
              Your Complete Legal
              <span className="block bg-gradient-to-r from-slate-700 via-emerald-600 to-blue-600 bg-clip-text text-transparent"> AI Assistant</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Get instant legal guidance through our advanced AI system, analyze documents with OCR, 
              and connect with verified lawyers. Built specifically for the Indian legal system.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
              <Link 
                href="/chat"
                className="group bg-gradient-to-r from-slate-700 to-emerald-600 text-white px-10 py-4 rounded-xl hover:from-slate-800 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 font-semibold text-lg shadow-xl hover:shadow-2xl flex items-center justify-center"
              >
                <Zap className="mr-2" size={20} />
                Start AI Legal Chat
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </Link>
              <Link 
                href="/lawyers"
                className="group bg-white text-slate-700 px-10 py-4 rounded-xl hover:bg-slate-50 transition-all duration-300 transform hover:scale-105 font-semibold text-lg shadow-xl border-2 border-slate-200 hover:border-slate-300 flex items-center justify-center"
              >
                <Users className="mr-2" size={20} />
                Find Expert Lawyers
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </Link>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-slate-600">
              <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm">
                <CheckCircle className="mr-2 text-emerald-500" size={16} />
                <span className="font-medium">10,000+ Cases Resolved</span>
              </div>
              <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm">
                <Star className="mr-2 text-amber-500" size={16} />
                <span className="font-medium">4.8/5 User Rating</span>
              </div>
              <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm">
                <Shield className="mr-2 text-slate-500" size={16} />
                <span className="font-medium">Bank-grade Security</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Everything You Need for Legal Assistance</h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            From AI-powered legal guidance to connecting with expert lawyers, we&apos;ve got you covered
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="group text-center p-8 bg-white rounded-2xl shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
            <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:from-emerald-100 group-hover:to-emerald-200 transition-all duration-300">
              <MessageSquare className="text-slate-700 group-hover:text-emerald-700" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-900">AI Legal Chat</h3>
            <p className="text-slate-600 leading-relaxed">
              Get instant answers to legal questions in simple, understandable language
            </p>
          </div>
          
          <div className="group text-center p-8 bg-white rounded-2xl shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Users className="text-emerald-700" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-900">Expert Lawyers</h3>
            <p className="text-slate-600 leading-relaxed">
              Connect with verified lawyers specializing in your specific case type
            </p>
          </div>
          
          <div className="group text-center p-8 bg-white rounded-2xl shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FileText className="text-amber-700" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-900">Document Analysis</h3>
            <p className="text-slate-600 leading-relaxed">
              Upload PDFs and images for AI-powered legal document analysis
            </p>
          </div>
          
          <div className="group text-center p-8 bg-white rounded-2xl shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
            <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Shield className="text-red-700" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-900">Secure & Private</h3>
            <p className="text-slate-600 leading-relaxed">
              Your legal matters are protected with enterprise-grade encryption
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">50,000+</div>
              <div className="text-slate-300">Users Trust Our Platform</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-slate-300">Cases Successfully Resolved</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-slate-300">Verified Expert Lawyers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Existing Sections */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <SectionOne />
          <SectionTwo />
          <SectionThree />
          <SectionFour />
        </div>
      </div>

      {/* Call to Action */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 text-white py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <Award className="mx-auto mb-6 text-emerald-400" size={64} />
          <h2 className="text-4xl font-bold mb-6">Ready to Get Professional Legal Help?</h2>
          <p className="text-xl mb-10 text-slate-300 leading-relaxed">
            Join thousands of users who trust our AI legal assistant for reliable guidance. 
            Get started today and experience the future of legal assistance.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link 
              href="/chat"
              className="group bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-10 py-4 rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 font-semibold text-lg shadow-xl hover:shadow-2xl flex items-center justify-center"
            >
              <Zap className="mr-2" size={20} />
              Start Free AI Chat
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </Link>
            <Link 
              href="/lawyers"
              className="group bg-white text-slate-900 px-10 py-4 rounded-xl hover:bg-slate-100 transition-all duration-300 transform hover:scale-105 font-semibold text-lg shadow-xl flex items-center justify-center"
            >
              <Users className="mr-2" size={20} />
              Browse Lawyers
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
