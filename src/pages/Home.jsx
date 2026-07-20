import { useState } from 'react'

const testimonials = [
  {
    quote: "Walking into the village felt like coming home. The Arts Studio gave me a place to paint and grow alongside people who truly believe in each other's gifts.",
    name: "Denise Hargrove",
    location: "Atlanta, GA",
    center: "Arts Studio"
  },
  {
    quote: "The advisory board helped me go from a dream on paper to a real business. The support here is rooted in something deeper than just strategy — it's love in action.",
    name: "Marcus Webb",
    location: "Chicago, IL",
    center: "Legal & Business"
  },
  {
    quote: "I've performed in a lot of spaces, but none with this level of unity. The Performing Arts center isn't just a stage — it's a family.",
    name: "Yvette Fontaine",
    location: "New Orleans, LA",
    center: "Performing Arts"
  },
  {
    quote: "We joined as a couple looking for community. We found a whole village. The fellowship here has strengthened our relationship and our faith.",
    name: "James & Cora Mitchell",
    location: "Houston, TX",
    center: "Community"
  },
  {
    quote: "I signed up to teach a jewelry-making class and ended up learning far more than I gave. This village pours back into you.",
    name: "Priya Nair",
    location: "Detroit, MI",
    center: "Learning Studio"
  },
]

const slides = [
  {
    tag: 'COMMUNITY',
    title: 'Gather & Belong',
    description: 'A welcoming village where people of all backgrounds come together in fellowship, celebration, and shared purpose.',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1400'
  },
  {
    tag: 'ARTS STUDIO',
    title: 'Create & Express',
    description: 'A creative space where artists, musicians, and makers can develop their gifts and share their work with the world.',
    image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=1400'
  },
  {
    tag: 'LEARNING STUDIO',
    title: 'Grow & Discover',
    description: 'Education rooted in purpose — workshops, mentorship, and training to help you walk in your calling.',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1400'
  },
  {
    tag: 'LEGAL & BUSINESS',
    title: 'Build & Thrive',
    description: 'Real support for real dreams — legal guidance, business strategy, and advisory to help you launch and grow.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1400'
  },
  {
    tag: 'PERFORMING ARTS',
    title: 'Perform & Inspire',
    description: 'A stage for your story — dance, theatre, spoken word, and performance arts in a community that celebrates you.',
    image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=1400'
  },
]

function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)

  return (
    <div className="bg-[#1a1a1a]">

      {/* Hero Section */}
      <section
        className="relative min-h-screen flex items-center px-16 py-20"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.85) 40%, rgba(0,0,0,0.4) 100%), url('https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1400')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Vision & Mission tag */}
        <div className="absolute top-8 left-16">
          <span className="border border-pink-500 text-pink-400 text-xs tracking-widest px-4 py-2 rounded-full flex items-center gap-2">
            ★ OUR VISION & MISSION
          </span>
        </div>

        {/* Hero content */}
        <div className="max-w-2xl mt-8">
          <h1 className="text-7xl font-serif text-white leading-tight mb-6">
            One True Pure <br />
            <span className="text-pink-500 italic">Love</span> Village
          </h1>
          <p className="text-white text-xl mb-3">
            A safe place where people come to collaborate in their gifting and purpose.
          </p>
          <p className="text-gray-400 text-base mb-10">
            Desiring to be in right relationship — building confidence through a loving, Godly character. One vision. One mind. One agreement.
          </p>
          <div className="flex gap-4">
            <a href="/signup" className="bg-pink-500 text-white px-8 py-4 rounded-full font-semibold flex items-center gap-2 hover:bg-pink-600">
              Join the Village →
            </a>
            <a href="/memberships" className="border border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-black transition">
              Explore Memberships
            </a>
          </div>
        </div>
      </section>

      <section className="bg-[#111111] py-8 px-16 grid grid-cols-4 divide-x divide-gray-700">
        <div className="px-8">
          <p className="text-pink-500 text-xs tracking-widest mb-2">OUR FOUNDATION</p>
          <p className="text-white text-xl font-semibold">Faith & Purpose</p>
        </div>
        <div className="px-8">
          <p className="text-pink-500 text-xs tracking-widest mb-2">OUR METHOD</p>
          <p className="text-white text-xl font-semibold">Unity of Vision</p>
        </div>
        <div className="px-8">
          <p className="text-pink-500 text-xs tracking-widest mb-2">OUR PROMISE</p>
          <p className="text-white text-xl font-semibold">Charity Never Fails</p>
        </div>
        <div className="px-8">
          <p className="text-pink-500 text-xs tracking-widest mb-2">OUR COMMUNITY</p>
          <p className="text-white text-xl font-semibold">All Are Welcome</p>
        </div>
      </section>

      {/* Founder Video Section */}
      <section className="bg-[#1a1a1a] px-16 py-24 flex items-center gap-16">

        {/* Left side text */}
        <div className="flex-1">
          <p className="text-pink-500 text-xs tracking-widest mb-4">FROM THE FOUNDER</p>
          <h2 className="text-5xl font-serif text-white leading-tight mb-6">
            A word about what <br />
            <span className="italic">we are building.</span>
          </h2>
          <p className="text-gray-400 text-base leading-relaxed mb-8">
            The village was born from a desire to see people walk fully in their God-given purpose — not alone, but together. Watch the founder share the heart behind One True Pure Love Village.
          </p>
          <blockquote className="border-l-2 border-pink-500 pl-4 text-gray-400 italic">
            "Faith without demonstration is of no value to anyone."
          </blockquote>
        </div>

        {/* Right side video placeholder */}
        <div className="flex-1 relative rounded-2xl overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800"
            alt="Founder video"
            className="w-full h-80 object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-2">
            <div className="w-16 h-16 bg-pink-500/80 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl">▶</span>
            </div>
            <p className="text-white text-sm tracking-widest">WATCH THE STORY</p>
          </div>
          <div className="absolute bottom-4 left-4">
            <p className="text-white font-semibold">Village Founder</p>
            <p className="text-gray-300 text-xs tracking-widest">ONE TRUE PURE LOVE VILLAGE</p>
          </div>
        </div>

      </section>

      {/* Centers Slider */}
      <section className="bg-[#111111] px-16 py-24">
        <p className="text-pink-500 text-xs tracking-widest text-center mb-2">INSIDE THE VILLAGE</p>
        <h2 className="text-5xl font-serif text-white text-center mb-12">Explore Our Centers</h2>

        {/* Slider */}
        <div className="relative rounded-2xl overflow-hidden">
          <img
            src={slides[currentSlide].image}
            alt={slides[currentSlide].title}
            className="w-full h-[500px] object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />

          {/* Slide content */}
          <div className="absolute bottom-12 left-12">
            <span className="border border-white text-white text-xs px-4 py-1 rounded-full mb-4 inline-block">
              {slides[currentSlide].tag}
            </span>
            <h3 className="text-4xl font-serif text-white mb-2">{slides[currentSlide].title}</h3>
            <p className="text-gray-300 max-w-lg">{slides[currentSlide].description}</p>
          </div>

          {/* Arrows */}
          <div className="absolute bottom-12 right-12 flex gap-3">
            <button
              onClick={() => setCurrentSlide(currentSlide === 0 ? slides.length - 1 : currentSlide - 1)}
              className="w-10 h-10 rounded-full border border-white text-white flex items-center justify-center hover:bg-white hover:text-black transition"
            >
              ←
            </button>
            <button
              onClick={() => setCurrentSlide(currentSlide === slides.length - 1 ? 0 : currentSlide + 1)}
              className="w-10 h-10 rounded-full border border-white text-white flex items-center justify-center hover:bg-white hover:text-black transition"
            >
              →
            </button>
          </div>

          {/* Dots */}
          <div className="absolute bottom-4 left-12 flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full ${index === currentSlide ? 'bg-pink-500 w-6' : 'bg-gray-500'} transition-all`}
              />
            ))}
          </div>

          {/* Counter */}
          <div className="absolute bottom-4 right-12 text-gray-400 text-sm">
            {currentSlide + 1} / {slides.length}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-[#1a1a1a] px-16 py-24">
        <p className="text-pink-500 text-xs tracking-widest text-center mb-4">VILLAGE VOICES</p>
        <h2 className="text-5xl font-serif text-white text-center mb-4">What Members Are Saying</h2>
        <p className="text-gray-400 text-center mb-16">
          From Atlanta to Detroit, people are finding their center — and their community.
        </p>

        <div className="grid grid-cols-3 gap-4 mb-4 items-start">
          {testimonials.slice(0, 3).map((t, index) => (
            <div key={index} className="bg-[#2a2a2a] border border-gray-700 rounded-2xl p-6 flex flex-col justify-between min-w-0">              <div>
              <p className="text-pink-500 text-4xl font-serif mb-4">"</p>
              <p className="text-gray-300 text-sm leading-relaxed mb-6">{t.quote}</p>
            </div>
              <div>
                <div className="border-t border-gray-600 mb-4" />
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {t.name[0]}
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{t.name}</p>
                      <p className="text-gray-400 text-xs">{t.location}</p>
                    </div>
                  </div>
                  <span className="border border-pink-500 text-pink-400 text-xs px-3 py-1 rounded-full">{t.center}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
          {testimonials.slice(3).map((t, index) => (
            <div key={index} className="bg-[#2a2a2a] border border-gray-700 rounded-2xl p-6 flex flex-col justify-between min-w-0">              <div>
              <p className="text-pink-500 text-4xl font-serif mb-4">"</p>
              <p className="text-gray-300 text-sm leading-relaxed mb-6">{t.quote}</p>
            </div>
              <div>
                <div className="border-t border-gray-600 mb-4" />
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {t.name[0]}
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{t.name}</p>
                      <p className="text-gray-400 text-xs">{t.location}</p>
                    </div>
                  </div>
                  <span className="border border-pink-500 text-pink-400 text-xs px-3 py-1 rounded-full">{t.center}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#111111] py-24 flex flex-col items-center gap-6">
        <p className="text-gray-400 text-lg">Ready to write your own story?</p>
        <a href="/signup" className="bg-pink-500 text-white px-10 py-4 rounded-full font-semibold flex items-center gap-2 hover:bg-pink-600 transition">
          Join the Village →
        </a>
      </section>

    </div>
  )
}

export default Home