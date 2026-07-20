import { useNavigate } from "react-router-dom"

const plans = [
  {
    id: 'explorer',
    name: 'Village Explorer',
    tagline: 'Begin your journey through the village',
    price: 15,
    description: 'Access every center in the village. Discover artists, advisors, performers, filmmakers, and community builders. Attend events, watch content, and find where your spirit belongs.',
    perks: [
      'Full village map access',
      'Browse all centers & studios',
      'Attend public events & screenings',
      'Community forums & discussions',
      'Member directory',
      'Monthly village newsletter',
    ],
    centers: ['Arts & Entertainment', 'Legal / Business', 'Community Marketplace'],
    highlighted: false,
  },

  {
    id: 'studio',
    name: 'Studio Member',
    tagline: 'Create, collaborate, and offer your gifts',
    price: 50,
    description: 'Everything in Village Explorer, plus the ability to host your own studio — offer services, products, classes, and collaborate directly with other village members.',
    perks: [
      'Everything in Village Explorer',
      'Open & manage your own studio',
      'Offer services, products & classes',
      'Priority listing in center directories',
      'Collaboration tools & direct messaging',
      'Advisory board access',
      'Revenue from studio offerings',
    ],
    centers: ['Arts & Entertainment', 'Legal / Business', 'Community Marketplace', 'Your Own Studio'],
    highlighted: true,
  },

]

const centers = [
  {
    icon: '🎨',
    name: 'Arts & Entertainment',
    description: 'Painters, sketchers, performers, theater troupes, and independent filmmakers sharing and collaborating.',
  },
  {
    icon: '⚖️',
    name: 'Legal & Business',
    description: 'Accountants, lawyers, and business consultants offering advisory boards for starting, financing, and growing ventures.',
  },
  {
    icon: '👥',
    name: 'Community Studios',
    description: 'Members offer services, products, and classes. A living marketplace built on passion and skillset.',
  },
]
function Memberships() {
  const navigate = useNavigate();

  const handleSelectPlan = (planId) => {
    navigate(`/signup?plan=${planId}`)
  }
  return (
    <div className="bg-[#1a1a1a] min-h-screen">

      {/* Hero */}
      <section className="py-24 px-16 text-center"
        style={{
          background: 'radial-gradient(ellipse at top, #3a1a2e 0%, #1a1a1a 60%)',
        }}
      >
        <p className="text-pink-500 text-xs tracking-widest mb-6">CHOOSE YOUR PATH</p>
        <h1 className="text-6xl font-serif text-white leading-tight mb-6">
          Your place in the <br />
          <span className="italic">village awaits.</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto">
          Two paths into One True Pure Love Village. Both are doors — only the depth of your participation differs.
        </p>
      </section>

      {/* Membership Cards */}
      <section className="px-16 pb-8">
        <div className="grid grid-cols-2 gap-6 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              onClick={() => handleSelectPlan(plan.id)}
              className={`relative rounded-2xl p-8 cursor-pointer transition hover:scale-[1.02] ${plan.highlighted
                  ? 'bg-[#3a1a2e] border border-pink-800'
                  : 'bg-[#2a2a2a] border border-gray-700'
                }`}
            >
              {plan.highlighted && (
                <span className="absolute top-4 right-4 bg-pink-500 text-white text-xs font-semibold px-4 py-1 rounded-full">
                  MOST COMPLETE
                </span>
              )}

              <h2 className="text-2xl font-serif text-white mb-1">{plan.name}</h2>
              <p className="text-pink-400 text-sm mb-6">{plan.tagline}</p>

              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-6xl font-serif text-white">${plan.price}</span>
                <span className="text-gray-400">/ year</span>
              </div>

              <p className="text-gray-400 text-sm leading-relaxed mb-8">{plan.description}</p>

              <div className="flex flex-col gap-3 mb-8">
                {plan.perks.map((perk) => (
                  <div key={perk} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full border border-pink-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-pink-500 text-xs">✓</span>
                    </div>
                    <span className="text-gray-300 text-sm">{perk}</span>
                  </div>
                ))}
              </div>

              <div>
                <p className="text-gray-500 text-xs tracking-widest mb-3">CENTERS INCLUDED</p>
                <div className="flex flex-wrap gap-2">
                  {plan.centers.map((center) => (
                    <span key={center} className="border border-gray-600 text-gray-300 text-xs px-3 py-1 rounded-full">
                      {center}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-gray-500 mt-8">Select a membership above to continue.</p>
      </section>

      {/* What Lives Inside */}
      <section className="px-16 py-24">
        <p className="text-gray-500 text-xs tracking-widest text-center mb-12">WHAT LIVES INSIDE THE VILLAGE</p>
        <div className="grid grid-cols-3 gap-6 max-w-5xl mx-auto">
          {centers.map((center) => (
            <div key={center.name} className="bg-[#2a2a2a] border border-gray-700 rounded-2xl p-8">
              <div className="w-12 h-12 bg-[#3a3a3a] rounded-xl flex items-center justify-center text-2xl mb-6">
                {center.icon}
              </div>
              <h3 className="text-white font-serif text-xl mb-3">{center.name}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{center.description}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}

export default Memberships