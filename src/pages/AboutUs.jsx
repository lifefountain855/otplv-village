function AboutUs() {
  const tags = ['Founder', 'Community Builder', 'Entrepreneur', 'Iwanciw Functional Funware', 'Faith Leader']

  return (
    <div
      className="bg-[#1a1a1a] min-h-screen"
      style={{ background: 'radial-gradient(ellipse at top, #3a1a2e 0%, #1a1a1a 60%)' }}
    >

      {/* Hero */}
      <section className="pt-16 pb-8 px-8 sm:px-16">
        <p className="text-pink-500 text-xs tracking-widest mb-4">THE HEART BEHIND THE VILLAGE</p>
        <h1 className="text-6xl font-serif text-white mb-12">Meet the Founder</h1>

        {/* Photo placeholder */}
        <div className="bg-[#2a2a2a] border max-w-200 border-gray-700 rounded-2xl p-5 mx-auto">
         <img src='wally.png' className="aspect-3/4 sm:aspect-3/2 rounded-2xl object-cover object-center"/>
        </div>
      </section>

      {/* Name card */}
      <section className="px-8 sm:px-16 py-6">
        <div className="bg-[#2a2a2a] border border-gray-700 rounded-2xl p-6">
          <h2 className="text-white text-2xl font-serif mb-1">Wally Iwanciw</h2>
          <p className="text-pink-400 text-sm mb-1">Owner</p>
          <p className="text-gray-400 text-sm">Iwanciw Functional Funware</p>
        </div>
      </section>

      {/* Bio */}
      <section className="px-8 sm:px-16 py-12">
        <h2 className="text-4xl font-serif text-white leading-tight mb-8">
          Building purpose-driven community <span className="italic">one relationship at a time.</span>
        </h2>

        <div className="flex flex-col gap-6 text-gray-400 text-base leading-relaxed mb-12">
          <p>
            Wally Iwanciw is the founder of One True Pure Love Village and the owner of Iwanciw Functional Funware. Driven by a deep conviction that people thrive when they are in right relationship — with God, with one another, and with their own purpose — Wally built the village as a living expression of that belief.
          </p>
          <p>
            His work spans community development, entrepreneurship, and faith-based collaboration. Through Iwanciw Functional Funware, Wally has developed a framework for meaningful, functional engagement — the same principles that underpin everything the village stands for.
          </p>
          <p>
            Wally believes that an abundant life is not passive. It must be demonstrated in how we walk, how we work, and how we serve — especially within community. With almost 40 years in the fashion industry, he has built brands rooted in joy, light, and peace — and now brings that same spirit to the village.
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-3 mb-16">
          {tags.map((tag) => (
            <span key={tag} className="border border-gray-600 text-gray-300 text-sm px-4 py-2 rounded-full">
              {tag}
            </span>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 mb-16" />

        {/* More coming soon */}
        <p className="text-pink-500 text-xs tracking-widest mb-8">MORE COMING SOON</p>
        <div className="flex flex-col md:flex-row gap-6">
          {[
            {
              title: 'Background & Story',
              desc: "Wally's full journey — from vision to village — will be shared here."
            },
            {
              title: 'Iwanciw Functional Funware',
              desc: "Learn more about the company and philosophy behind the founder's broader work."
            },
            {
              title: 'Media & Appearances',
              desc: 'Interviews, speaking engagements, and featured content will be listed here.'
            },
          ].map((card) => (
            <div key={card.title} className="bg-[#2a2a2a] border border-gray-700 rounded-2xl p-8">
              <div className="w-8 h-1 bg-pink-500 rounded mb-6" />
              <h3 className="text-white font-serif text-xl mb-3">{card.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}

export default AboutUs