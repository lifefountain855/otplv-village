import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Logo from './Logo'

const links = [
  { to: '/', label: 'Home' },
  { to: '/signup', label: 'Sign Up' },
  { to: '/memberships', label: 'Membership' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact' },
]

function Navbar() {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="bg-[#161616] px-8 py-4 border-b border-neutral-700 flex items-center justify-between">

      {/* Logo and site name */}
      <Link to="/" className="flex items-center gap-4">
        <Logo size={50} glow={false} backgroundColor="#eee" backgroundRadius='10' pathOptions={[{},{},{fill:"#ff0000",strokeWidth:"2",strokeLinecap:"round"},{}]}/>
        <span className="text-white text-xl font-semibold hidden sm:block">One True Pure Love Village</span>
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-2 border border-pink-500 rounded-full px-4 py-2">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={
              location.pathname === link.to
                ? 'bg-pink-500 text-white px-4 py-1 rounded-full'
                : 'text-gray-300 px-4 py-1 hover:text-white'
            }
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Mobile hamburger button */}
      <button
        className="md:hidden text-white text-2xl"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? '✕' : '☰'}
      </button>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-[#1a1a1a] border-t border-gray-700 flex flex-col px-8 py-4 gap-4 z-50 md:hidden">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={
                location.pathname === link.to
                  ? 'text-pink-500 font-semibold'
                  : 'text-gray-300 hover:text-white'
              }
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}

    </nav>
  )
}

export default Navbar