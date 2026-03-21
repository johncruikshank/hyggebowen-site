import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-forest bg-opacity-95 backdrop-blur">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3">
          <span className="font-serif text-2xl font-light italic text-rust">hygge</span>
          <span className="hidden sm:inline font-sans text-xs leading-tight text-opacity-50 text-cream max-w-xs">
            / ˈhoo · gə / — warmth, belonging, contentment
          </span>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-8 items-center">
          <li><Link to="/the-homes" className="font-sans text-sm font-light hover:text-rust transition">The Homes</Link></li>
          <li><Link to="/the-land" className="font-sans text-sm font-light hover:text-rust transition">The Land</Link></li>
          <li><Link to="/community" className="font-sans text-sm font-light hover:text-rust transition">Community</Link></li>
          <li><Link to="/the-film" className="font-sans text-sm font-light hover:text-rust transition">The Film</Link></li>
          <li><Link to="/connect" className="btn px-6 py-2 text-xs">Connect</Link></li>
        </ul>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-cream"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-bark border-t border-opacity-10 border-cream">
          <ul className="flex flex-col p-4 gap-3">
            <li><Link to="/the-homes" className="block py-2 hover:text-rust" onClick={() => setIsOpen(false)}>The Homes</Link></li>
            <li><Link to="/the-land" className="block py-2 hover:text-rust" onClick={() => setIsOpen(false)}>The Land</Link></li>
            <li><Link to="/community" className="block py-2 hover:text-rust" onClick={() => setIsOpen(false)}>Community</Link></li>
            <li><Link to="/the-film" className="block py-2 hover:text-rust" onClick={() => setIsOpen(false)}>The Film</Link></li>
            <li><Link to="/connect" className="btn block text-center py-2" onClick={() => setIsOpen(false)}>Connect</Link></li>
          </ul>
        </div>
      )}
    </nav>
  )
}
