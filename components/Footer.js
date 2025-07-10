// components/Footer.js
export default function Footer() {
  return (
    <footer className="bg-slate-800 text-slate-300 p-4 text-center border-t border-slate-700">
      <p>&copy; {new Date().getFullYear()} Legal Assistant. All rights reserved.</p>
    </footer>
  )
}
