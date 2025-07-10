import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-slate-800 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold hover:text-slate-200 transition-colors">
          Legal Assistant
        </Link>
        <nav className="flex space-x-6">
          <Link href="/chat" className="hover:text-slate-200 transition-colors font-medium">
            AI Chat
          </Link>
          <Link href="/lawyers" className="hover:text-slate-200 transition-colors font-medium">
            Find Lawyers
          </Link>
          <Link href="/login" className="hover:text-slate-200 transition-colors font-medium">
            Login
          </Link>
          <Link href="/" className="hover:text-slate-200 transition-colors font-medium">
            Home
          </Link>
        </nav>
      </div>
    </header>
  )
}
