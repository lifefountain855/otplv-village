import { useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'

const interests = [
  { category: 'ARTS', items: ['Painting', 'Drawing & Sketching', 'Performing Arts'] },
  { category: 'ENTERTAINMENT', items: ['Theater', 'Film & Documentaries', 'Music'] },
  { category: 'LEGAL / BUSINESS', items: ['Accounting & Finance', 'Legal Advisory', 'Business Consulting', 'Entrepreneurship'] },
  { category: 'STUDIO', items: ['Teaching / Classes', 'Products & Marketplace'] },
  { category: 'COMMUNITY', items: ['Spiritual Practice', 'Community Building'] },
]

const colorPresets = ['#ec4899', '#ef4444', '#f472b6', '#f97316', '#d4a843', '#84cc16', '#60a5fa', '#e5e7eb']

function SignUp() {
  const [searchParams] = useSearchParams()
  const planFromUrl = searchParams.get('plan')

  const [selectedPlan, setSelectedPlan] = useState(planFromUrl || 'explorer')
  const [selectedInterests, setSelectedInterests] = useState([])
  const [syceColor, setSyceColor] = useState('#ec4899')
  const [form, setForm] = useState({ name: '', age: '', email: '', occupation: '' })

  const toggleInterest = (item) => {
    setSelectedInterests(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    )
  }

  const handleColorPreset = (color) => {
    setSyceColor(color)
  }

  return (
    <div className="bg-[#1a1a1a] min-h-screen"
      style={{ background: 'radial-gradient(ellipse at top, #3a1a2e 0%, #1a1a1a 60%)' }}
    >
      {/* Hero */}
      <section className="pt-24 pb-12 px-16 text-center">
        <p className="text-pink-500 text-xs tracking-widest mb-6">BEGIN YOUR JOURNEY</p>
        <h1 className="text-6xl font-serif text-white leading-tight mb-4">
          Join the Village. <br />
          <span className="italic">Find your center.</span>
        </h1>
        <p className="text-gray-400 text-lg">A sacred space where artists, advisors, and seekers come together.</p>
      </section>

      {/* Form */}
      <section className="px-16 pb-24 max-w-3xl mx-auto flex flex-col gap-8">

        {/* SYCE Color */}
        <div className="bg-[#2a2a2a] border border-gray-700 rounded-2xl p-8">
          <p className="text-pink-500 text-xs tracking-widest mb-2">SYCE COLOR</p>
          <p className="text-gray-400 text-sm mb-6">Your personal signature color — it represents your presence in the village.</p>
          <div className="flex items-center gap-6 mb-6">
            <div className="w-20 h-20 rounded-2xl flex-shrink-0" style={{ backgroundColor: syceColor }} />
            <div className="flex flex-col gap-3 flex-1">
              <div className="flex items-center gap-3">
                <span className="text-gray-400 text-sm">HEX</span>
                <input
                  type="text"
                  value={syceColor}
                  onChange={(e) => setSyceColor(e.target.value)}
                  className="bg-[#3a3a3a] text-white px-4 py-2 rounded-lg text-sm w-36"
                />
                <button
                  onClick={() => document.getElementById('colorPicker').click()}
                  className="border border-gray-600 text-gray-300 px-4 py-2 rounded-lg text-sm hover:border-pink-500"
                >
                  Pick
                </button>
                <input
                  id="colorPicker"
                  type="color"
                  value={syceColor}
                  onChange={(e) => setSyceColor(e.target.value)}
                  className="hidden"
                />
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-400 text-sm">HUE</span>
                <input
                  type="range"
                  min="0"
                  max="360"
                  className="flex-1 accent-pink-500"
                  onChange={(e) => {
                    const h = e.target.value
                    setSyceColor(`hsl(${h}, 70%, 50%)`)
                  }}
                />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-gray-400 text-xs tracking-widest">PRESETS</span>
            <div className="flex gap-2">
              {colorPresets.map((color) => (
                <button
                  key={color}
                  onClick={() => handleColorPreset(color)}
                  className="w-8 h-8 rounded-full border-2 hover:scale-110 transition"
                  style={{ backgroundColor: color, borderColor: syceColor === color ? 'white' : 'transparent' }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-4">
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
            <label className="text-gray-400 text-xs tracking-widest">AGE <span className="text-pink-500">*</span></label>
            <input
              type="number"
              placeholder="Age"
              value={form.age}
              onChange={(e) => setForm({ ...form, age: e.target.value })}
              className="bg-[#2a2a2a] border border-gray-700 text-white px-4 py-4 rounded-2xl placeholder-gray-600 focus:outline-none focus:border-pink-500"
            />
          </div>
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
          <label className="text-gray-400 text-xs tracking-widest">OCCUPATION / SKILLS</label>
          <textarea
            placeholder="Tell us what you do or what you're good at..."
            value={form.occupation}
            onChange={(e) => setForm({ ...form, occupation: e.target.value })}
            rows={4}
            className="bg-[#2a2a2a] border border-gray-700 text-white px-4 py-4 rounded-2xl placeholder-gray-600 focus:outline-none focus:border-pink-500 resize-none"
          />
        </div>

        {/* Interests */}
        <div className="flex flex-col gap-6">
          <label className="text-gray-400 text-xs tracking-widest">INTERESTS & PASSIONS</label>
          {interests.map((group) => (
            <div key={group.category}>
              <p className="text-pink-500 text-xs tracking-widest mb-3">{group.category}</p>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <button
                    key={item}
                    onClick={() => toggleInterest(item)}
                    className={`px-4 py-2 rounded-full text-sm border transition ${
                      selectedInterests.includes(item)
                        ? 'bg-pink-500 border-pink-500 text-white'
                        : 'border-gray-600 text-gray-300 hover:border-pink-500'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Membership Plan */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <label className="text-gray-400 text-xs tracking-widest">MEMBERSHIP PLAN <span className="text-pink-500">*</span></label>
            <Link to="/memberships" className="text-pink-400 text-sm hover:underline">Not sure? Explore memberships →</Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { id: 'explorer', name: 'Village Explorer', price: '$15 / year', desc: 'Browse all centers & attend events' },
              { id: 'studio', name: 'Studio Member', price: '$50 / year', desc: 'Everything above + open your own studio' },
            ].map((plan) => (
              <button
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`text-left p-6 rounded-2xl border transition ${
                  selectedPlan === plan.id
                    ? 'border-pink-500 bg-[#3a1a2e]'
                    : 'border-gray-700 bg-[#2a2a2a] hover:border-gray-500'
                }`}
              >
                <p className="text-white font-semibold mb-1">{plan.name}</p>
                <p className="text-pink-400 text-sm mb-1">{plan.price}</p>
                <p className="text-gray-400 text-xs">{plan.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button className="w-full bg-pink-500 text-white py-5 rounded-full text-lg font-semibold flex items-center justify-center gap-2 hover:bg-pink-600 transition">
          Join the Village →
        </button>
        <p className="text-center text-gray-500 text-sm">
          By joining, you agree to our values of love, respect, and purposeful collaboration.
        </p>

      </section>
    </div>
  )
}

export default SignUp