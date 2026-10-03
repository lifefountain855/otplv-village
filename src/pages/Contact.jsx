import { useState } from 'react'

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) {
      alert('Please fill in all fields.')
      return
    }
    try {
      const response = await fetch('https://otplv-backend-production.up.railway.app/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: form.message
        })
      })

      const data = await response.json()

      if (response.ok) {
        setSubmitted(true)
      } else {
        alert('Something went wrong: ' + data.error)
      }
    } catch (error) {
      alert('Could not connect to server. Please try again.')
      console.error(error)
    }
  }
  return (

    <div
      className="bg-[#1a1a1a] min-h-screen"
      style={{ background: 'radial-gradient(ellipse at top, #3a1a2e 0%, #1a1a1a 60%)' }}
    >
      <section className="pt-24 pb-12 px-16 text-center">
        <p className="text-pink-500 text-xs tracking-widest mb-6">REACH OUT</p>
        <h1 className="text-6xl font-serif text-white leading-tight mb-4">
          Get in Touch.
        </h1>
        <p className="text-gray-400 text-lg">We would love to hear from you.</p>
      </section>

      <section className="px-8 sm:px-16 pb-24 max-w-5xl mx-auto">
        <div className="flex justify-center gap-16 flex-col md:flex-row px-auto">

          <div className="flex flex-col gap-8">
            <div>
              <p className="text-pink-500 text-xs tracking-widest mb-3">EMAIL</p>

              <a href="mailto:unclewallysworld@gmail.com"
                className="text-white text-lg hover:text-pink-400 transition"
              >
                unclewallysworld@gmail.com
              </a>
            </div>
            <div>
              <p className="text-pink-500 text-xs tracking-widest mb-3">PHONE</p>

              <a href="tel:2014177488"
                className="text-white text-lg hover:text-pink-400 transition"
              >
                201-417-7488
              </a>
            </div>
          </div>

          {submitted ? (
            <div className="bg-[#2a2a2a] border border-gray-700 rounded-2xl p-12 flex flex-col items-center justify-center text-center gap-4">
              <p className="text-pink-500 text-4xl">✓</p>
              <h3 className="text-white text-2xl font-serif">Message Sent!</h3>
              <p className="text-gray-400">We will get back to you as soon as possible.</p>
              <button
                onClick={() => { setSubmitted(false); setForm({ name: '', email: '', message: '' }) }}
                className="text-pink-400 text-sm hover:underline mt-2"
              >
                Send another message
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-6 grow">
              <div className="flex flex-col gap-2">
                <label className="text-gray-400 text-xs tracking-widest">FULL NAME <span className="text-pink-500">*</span></label>
                <input
                  type="text"
                  placeholder="Your name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="bg-[#2a2a2a] border border-gray-700 text-white px-4 py-4 rounded-2xl placeholder-gray-600 focus:outline-none focus:border-pink-500"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-gray-400 text-xs tracking-widest">EMAIL <span className="text-pink-500">*</span></label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="bg-[#2a2a2a] border border-gray-700 text-white px-4 py-4 rounded-2xl placeholder-gray-600 focus:outline-none focus:border-pink-500"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-gray-400 text-xs tracking-widest">MESSAGE <span className="text-pink-500">*</span></label>
                <textarea
                  placeholder="Tell us how we can help..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  rows={6}
                  className="bg-[#2a2a2a] border border-gray-700 text-white px-4 py-4 rounded-2xl placeholder-gray-600 focus:outline-none focus:border-pink-500 resize-none"
                />
              </div>
              <button
                onClick={handleSubmit}
                className="w-full bg-pink-500 text-white py-4 rounded-full font-semibold hover:bg-pink-600 transition"
              >
                Send Message
              </button>
            </div>
          )}

        </div>
      </section>
    </div>
  )
}

export default Contact