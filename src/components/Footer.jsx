function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-gray-300 px-8 py-10 mt-auto">
      <div className="flex flex-col md:flex-row justify-between items-start gap-8">

        {/* Logo and name */}
        <div className="flex items-center gap-4">
          <img src="/logo.png" alt="OTPLV Logo" className="w-10 h-10 flex-shrink-0" />
          <span className="text-white font-semibold text-lg">One True Pure Love Village</span>
        </div>

        {/* Page links */}
        <div className="flex flex-col gap-2">
          <span className="text-white font-semibold mb-1">Pages</span>
          <a href="/" className="hover:text-white">Home</a>
          <a href="/signup" className="hover:text-white">Sign Up</a>
          <a href="/memberships" className="hover:text-white">Memberships</a>
          <a href="/about" className="hover:text-white">About Us</a>
          <a href="/contact" className="hover:text-white">Contact</a>
        </div>

        {/* Contact info */}
        <div className="flex flex-col gap-2">
          <span className="text-white font-semibold mb-1">Contact</span>
          <span>Email: unclewallysworld@gmail.com</span>
          <span>Phone: (201)-417-7488</span>
        </div>

      </div>
    </footer>
  )
}

export default Footer