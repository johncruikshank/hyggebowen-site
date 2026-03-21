import React from 'react'

export default function Footer() {
  return (
    <footer className="border-t border-opacity-5 border-cream py-8 px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-opacity-30 text-cream font-sans">
        <span>© 2026 Hygge at Arbutus Ridge · Bowen Island, BC</span>
        <div className="space-x-2">
          <a href="tel:6043322032" className="hover:text-opacity-50 transition">604-332-2032</a>
          <span>·</span>
          <a href="mailto:info@hyggebowen.com" className="hover:text-opacity-50 transition">info@hyggebowen.com</a>
        </div>
      </div>
    </footer>
  )
}
