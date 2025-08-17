import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-slate-700 to-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">LA</span>
            </div>
            <span className="text-xl font-bold text-slate-900">Legal Assistant</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-slate-700 hover:text-slate-900 transition-colors font-medium">
              Home
            </Link>
            <Link href="/chat" className="text-slate-700 hover:text-slate-900 transition-colors font-medium">
              AI Chat
            </Link>
            <Link href="/lawyers" className="text-slate-700 hover:text-slate-900 transition-colors font-medium">
              Find Lawyers
            </Link>
            <Link 
              href="/chat" 
              className="bg-gradient-to-r from-slate-700 to-emerald-600 text-white px-6 py-2 rounded-lg hover:from-slate-800 hover:to-emerald-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
            >
              Get Started
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button className="md:hidden p-2 rounded-md text-slate-700 hover:text-slate-900 hover:bg-gray-100">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}
