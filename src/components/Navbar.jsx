function Navbar() {
  return (
    <nav className="bg-[#1a1a1a] px-8 py-4 flex items-center justify-between">
      
      {/* Logo and site name */}
      <div className="flex items-center gap-4">
        <img src="/logo.png" alt="OTPLV Logo" className="w-12 h-12" />
        <span className="text-white text-xl font-semibold">One True Pure Love Village</span>
      </div>

      {/* Navigation links */}
      <div className="flex items-center gap-2 border border-pink-500 rounded-full px-4 py-2">
        <a href="/" className="bg-pink-500 text-white px-4 py-1 rounded-full">Home</a>
        <a href="/signup" className="text-gray-300 px-4 py-1 hover:text-white">Sign Up</a>
        <a href="/memberships" className="text-gray-300 px-4 py-1 hover:text-white">Memberships</a>
        <a href="/about" className="text-gray-300 px-4 py-1 hover:text-white">About Us</a>
        <a href="/contact" className="text-gray-300 px-4 py-1 hover:text-white">Contact</a>
      </div>

    </nav>
  )
}

export default Navbar