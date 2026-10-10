import { useEffect, useRef, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import SignupPaymentForm, { SignupPaymentPreview } from '../components/SignupPaymentForm'

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || 'https://otplv-backend-production.up.railway.app'
).replace(/\/+$/, '')
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
const stripePromise = STRIPE_PUBLISHABLE_KEY ? loadStripe(STRIPE_PUBLISHABLE_KEY) : null
const STRIPE_UI_TEST_MODE =
  import.meta.env.DEV && import.meta.env.VITE_STRIPE_UI_TEST_MODE === 'true'
const STRIPE_UI_TEST_CLIENT_SECRET = import.meta.env.STRIPE_UI_TEST_CLIENT_SECRET
const STRIPE_UI_TEST_SESSION_ID =
  STRIPE_UI_TEST_CLIENT_SECRET.split('_secret_')[0] || 'local-test-session'
const HAS_VALID_STRIPE_TEST_CLIENT_SECRET =
  STRIPE_UI_TEST_CLIENT_SECRET.startsWith('cs_test_') &&
  STRIPE_UI_TEST_CLIENT_SECRET.includes('_secret_')

const interests = [
  { category: 'ARTS', items: ['Painting', 'Drawing & Sketching', 'Performing Arts'] },
  { category: 'ENTERTAINMENT', items: ['Theater', 'Film & Documentaries', 'Music'] },
  { category: 'LEGAL / BUSINESS', items: ['Accounting & Finance', 'Legal Advisory', 'Business Consulting', 'Entrepreneurship'] },
  { category: 'STUDIO', items: ['Teaching / Classes', 'Products & Marketplace'] },
  { category: 'COMMUNITY', items: ['Spiritual Practice', 'Community Building'] },
]

const colorPresets = ['#ec4899', '#ef4444', '#f472b6', '#f97316', '#d4a843', '#84cc16', '#60a5fa', '#e5e7eb']
const plans = [
  { id: 'explorer', name: 'Village Explorer', price: '$15 / year', desc: 'Browse all centers & attend events' },
  { id: 'studio', name: 'Studio Member', price: '$50 / year', desc: 'Everything above + open your own studio' },
]

async function readApiResponse(response) {
  const text = await response.text()
  let data = {}

  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      throw new Error('The signup server returned an unreadable response. Please try again.')
    }
  }

  if (!response.ok) {
    const message = data.error || data.message
    if (typeof message === 'string' && message.toLowerCase().includes('duplicate')) {
      throw new Error('This email is already registered. Please use a different email.')
    }
    throw new Error(typeof message === 'string' ? message : `The signup server returned an error (${response.status}).`)
  }

  return data
}

function SignUp() {
  const [searchParams, setSearchParams] = useSearchParams()
  const requestedPlan = searchParams.get('plan')
  const returnSessionId = STRIPE_UI_TEST_MODE ? null : searchParams.get('session_id')
  const [selectedPlan, setSelectedPlan] = useState(
    plans.some((plan) => plan.id === requestedPlan) ? requestedPlan : 'explorer',
  )
  const [selectedInterests, setSelectedInterests] = useState([])
  const [syceColor, setSyceColor] = useState('#ec4899')
  const [form, setForm] = useState({ name: '', age: '', email: '', occupation: '' })
  const [checkoutSession, setCheckoutSession] = useState(null)
  const [testPaymentComplete, setTestPaymentComplete] = useState(
    STRIPE_UI_TEST_MODE && searchParams.get('stripe_test_return') === 'true',
  )
  const [testPaymentWasSimulated, setTestPaymentWasSimulated] = useState(false)
  const [creatingSession, setCreatingSession] = useState(false)
  const [formError, setFormError] = useState('')
  const [confirmationStatus, setConfirmationStatus] = useState(returnSessionId ? 'checking' : 'idle')
  const [confirmationError, setConfirmationError] = useState('')
  const [statusRetry, setStatusRetry] = useState(0)
  const colorPickerRef = useRef(null)

  useEffect(() => {
    if (!returnSessionId) return undefined

    let current = true

    async function checkPaymentStatus() {
      setConfirmationStatus('checking')
      setConfirmationError('')

      for (let attempt = 0; attempt < 30 && current; attempt += 1) {
        try {
          const response = await fetch(
            `${API_BASE_URL}/signup/checkout-status?session_id=${encodeURIComponent(returnSessionId)}`,
          )
          const data = await readApiResponse(response)

          if (data.status === 'confirmed') {
            if (current) setConfirmationStatus('confirmed')
            return
          }
          if (data.status === 'failed') {
            if (current) setConfirmationStatus('failed')
            return
          }
          if (data.status !== 'pending') {
            throw new Error('The signup server returned an unexpected payment status.')
          }
        } catch (error) {
          if (current) {
            setConfirmationError(error instanceof Error ? error.message : 'Could not verify your payment.')
            setConfirmationStatus('verification-error')
          }
          return
        }

        await new Promise((resolve) => window.setTimeout(resolve, 2000))
      }

      if (current) setConfirmationStatus('pending')
    }

    checkPaymentStatus()
    return () => {
      current = false
    }
  }, [returnSessionId, statusRetry])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setFormError('')

    if (!form.name.trim() || !form.email.trim() || !form.age) {
      setFormError('Please fill in your name, age, and email address.')
      return
    }
    if (!stripePromise && !STRIPE_UI_TEST_MODE) {
      setFormError('Online signup is not configured yet. Please contact us for help.')
      return
    }

    if (STRIPE_UI_TEST_MODE) {
      if (STRIPE_UI_TEST_CLIENT_SECRET && !HAS_VALID_STRIPE_TEST_CLIENT_SECRET) {
        setFormError('The local Stripe test session must be a test Checkout Session client secret beginning with cs_test_.')
        return
      }
      if (STRIPE_UI_TEST_CLIENT_SECRET && !STRIPE_PUBLISHABLE_KEY?.startsWith('pk_test_')) {
        setFormError('Set VITE_STRIPE_PUBLISHABLE_KEY to a Stripe test publishable key beginning with pk_test_.')
        return
      }
      setCheckoutSession({
        testMode: true,
        sessionId: STRIPE_UI_TEST_CLIENT_SECRET ? STRIPE_UI_TEST_SESSION_ID : 'preview-session',
        clientSecret: STRIPE_UI_TEST_CLIENT_SECRET,
      })
      return
    }

    setCreatingSession(true)
    try {
      const response = await fetch(`${API_BASE_URL}/signup/checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          name: form.name.trim(),
          email: form.email.trim(),
          interests: selectedInterests,
          plan: selectedPlan,
          syceColor,
        }),
      })
      const data = await readApiResponse(response)

      if (typeof data.clientSecret !== 'string' || typeof data.sessionId !== 'string') {
        throw new Error('The signup server did not return a valid Stripe Checkout Session.')
      }
      setCheckoutSession({ clientSecret: data.clientSecret, sessionId: data.sessionId })
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Could not start checkout. Please try again.')
    } finally {
      setCreatingSession(false)
    }
  }

  const toggleInterest = (item) => {
    setSelectedInterests((previous) =>
      previous.includes(item) ? previous.filter((interest) => interest !== item) : [...previous, item],
    )
  }

  const handlePaymentSubmitted = (sessionId) => {
    const nextSearchParams = new URLSearchParams(searchParams)
    nextSearchParams.set('session_id', sessionId)
    setSearchParams(nextSearchParams, { replace: true })
  }

  const handleTestPaymentComplete = (simulated = true) => {
    setTestPaymentWasSimulated(simulated)
    setTestPaymentComplete(true)
  }

  const handleStripeTestPaymentSubmitted = () => {
    handleTestPaymentComplete(false)
  }

  return (
    <div
      className="min-h-screen bg-[#1a1a1a]"
      style={{ background: 'radial-gradient(ellipse at top, #3a1a2e 0%, #1a1a1a 60%)' }}
    >
      <section className="px-8 pt-24 pb-12 text-center sm:px-16">
        <p className="mb-6 text-xs tracking-widest text-pink-500">BEGIN YOUR JOURNEY</p>
        <h1 className="mb-4 font-serif text-6xl leading-tight text-white">
          Join the Village. <br />
          <span className="italic">Find your center.</span>
        </h1>
        <p className="text-lg text-gray-400">
          A sacred space where artists, advisors, and seekers come together.
        </p>
      </section>

      {STRIPE_UI_TEST_MODE && testPaymentComplete ? (
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-8 pb-24 text-center" aria-live="polite">
          <p className="rounded-full border border-amber-600 px-4 py-2 text-xs tracking-widest text-amber-300">
            {testPaymentWasSimulated
              ? 'LOCAL UI PREVIEW — NO PAYMENT TAKEN'
              : 'STRIPE TEST SESSION — NO MEMBERSHIP ACTIVATED'}
          </p>
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-pink-500 text-4xl">✓</div>
          <h2 className="font-serif text-4xl text-white">          {testPaymentWasSimulated ? 'Signup preview complete' : 'Stripe test checkout complete'}</h2>
          <p className="max-w-md text-lg text-gray-400">
            {testPaymentWasSimulated
              ? 'This was a local UI simulation only. No Stripe payment was created and no membership was activated.'
              : searchParams.get('stripe_test_return') === 'true'
                ? 'Returned from a Stripe test Checkout Session. Check its status in the Stripe Dashboard; this page does not verify webhooks or activate membership.'
                : 'Stripe confirmed this test Checkout Session. This local test did not verify a webhook or activate a membership.'}
          </p>
          <button
            type="button"
            onClick={() => {
              setTestPaymentComplete(false)
              setCheckoutSession(null)
            }}
            className="rounded-full bg-pink-500 px-8 py-4 font-semibold text-white transition hover:bg-pink-600"
          >
            Test the signup flow again
          </button>
        </div>
      ) : confirmationStatus === 'confirmed' ? (
        <div className="flex flex-col items-center justify-center gap-6 py-24 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-pink-500 text-4xl">✓</div>
          <h2 className="font-serif text-4xl text-white">Welcome to the Village!</h2>
          <p className="max-w-md text-lg text-gray-400">
            Your payment is confirmed. Your membership is being activated.
          </p>
          <Link to="/" className="rounded-full bg-pink-500 px-8 py-4 font-semibold text-white transition hover:bg-pink-600">
            Back to Home
          </Link>
        </div>
      ) : returnSessionId ? (
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-8 pb-24 text-center" aria-live="polite">
          {confirmationStatus === 'failed' ? (
            <>
              <h2 className="font-serif text-3xl text-white">Payment was not completed</h2>
              <p className="text-gray-400">Your membership has not been activated. You can return to signup to try again.</p>
              <Link to={`/signup?plan=${selectedPlan}`} className="rounded-full bg-pink-500 px-8 py-4 font-semibold text-white">
                Try again
              </Link>
            </>
          ) : confirmationStatus === 'verification-error' ? (
            <>
              <h2 className="font-serif text-3xl text-white">We could not verify your payment yet</h2>
              <p className="text-gray-400">{confirmationError}</p>
              <button
                type="button"
                onClick={() => setStatusRetry((attempt) => attempt + 1)}
                className="rounded-full bg-pink-500 px-8 py-4 font-semibold text-white"
              >
                Check again
              </button>
            </>
          ) : (
            <>
              <h2 className="font-serif text-3xl text-white">
                {confirmationStatus === 'pending' ? 'Payment confirmation is still processing' : 'Confirming your payment'}
              </h2>
              <p className="text-gray-400">
                We’ll show your welcome once the payment is confirmed by our server. This page can stay open while we check.
              </p>
              {confirmationStatus === 'pending' && (
                <button
                  type="button"
                  onClick={() => setStatusRetry((attempt) => attempt + 1)}
                  className="rounded-full border border-gray-600 px-6 py-3 text-gray-200 hover:border-pink-500"
                >
                  Check again
                </button>
              )}
            </>
          )}
        </div>
      ) : (
        <section className="mx-auto flex max-w-3xl flex-col gap-8 px-8 pb-24 sm:px-16">
          {STRIPE_UI_TEST_MODE && (
            <p role="status" className="rounded-xl border border-amber-700 bg-amber-950/50 p-4 text-amber-200">
              {STRIPE_UI_TEST_CLIENT_SECRET
                ? 'Local Stripe test mode is on. The test Checkout Session is loaded directly; the backend and membership activation are bypassed.'
                : 'Local UI preview mode is on. Checkout is simulated; no Stripe request, payment, or membership activation will occur.'}
            </p>
          )}
          {!STRIPE_PUBLISHABLE_KEY && (
            !STRIPE_UI_TEST_MODE && <p role="alert" className="rounded-xl border border-amber-700 bg-amber-950/50 p-4 text-amber-200">
              Stripe checkout is not configured. Set the public Stripe publishable key to enable signup.
            </p>
          )}

          <form onSubmit={handleSubmit}>
            <fieldset
              disabled={Boolean(checkoutSession) || creatingSession}
              className="m-0 flex min-w-0 flex-col gap-8 border-0 p-0"
            >
              <div className="rounded-2xl border border-gray-700 bg-[#2a2a2a] p-8">
                <p className="mb-2 text-xs tracking-widest text-pink-500">SYCE COLOR</p>
                <p className="mb-6 text-sm text-gray-400">
                  Your personal signature color — it represents your presence in the village.
                </p>
                <div className="mb-6 flex flex-col items-center gap-6 sm:flex-row">
                  <div className="h-20 w-20 shrink-0 rounded-2xl" style={{ backgroundColor: syceColor }} />
                  <div className="flex w-full flex-col gap-3">
                    <div className="grid grid-cols-1 items-center gap-3 sm:flex">
                      <span className="text-sm text-gray-400">HEX</span>
                      <input
                        type="text"
                        value={syceColor}
                        onChange={(event) => setSyceColor(event.target.value)}
                        className="w-36 rounded-lg bg-[#3a3a3a] px-4 py-2 text-sm text-white"
                      />
                      <button
                        type="button"
                        onClick={() => colorPickerRef.current?.click()}
                        className="rounded-lg border border-gray-600 px-4 py-2 text-sm text-gray-300 hover:border-pink-500"
                      >
                        Pick
                      </button>
                      <input
                        ref={colorPickerRef}
                        type="color"
                        value={syceColor}
                        onChange={(event) => setSyceColor(event.target.value)}
                        className="hidden"
                        aria-label="Choose SYCE color"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <label htmlFor="syce-hue" className="text-sm text-gray-400">HUE</label>
                      <input
                        id="syce-hue"
                        type="range"
                        min="0"
                        max="360"
                        className="grow accent-pink-500"
                        onChange={(event) => setSyceColor(`hsl(${event.target.value}, 70%, 50%)`)}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs tracking-widest text-gray-400">PRESETS</span>
                  <div className="grid flex-1 grid-cols-[repeat(auto-fill,minmax(30px,1fr))] gap-2">
                    {colorPresets.map((color) => (
                      <button
                        type="button"
                        key={color}
                        aria-label={`Use color ${color}`}
                        onClick={() => setSyceColor(color)}
                        className="h-8 w-8 rounded-full border-2 transition hover:scale-110"
                        style={{ backgroundColor: color, borderColor: syceColor === color ? 'white' : 'transparent' }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="flex grow flex-col gap-2">
                  <label htmlFor="signup-name" className="text-xs tracking-widest text-gray-400">
                    FULL NAME <span className="text-pink-500">*</span>
                  </label>
                  <input
                    id="signup-name"
                    type="text"
                    autoComplete="name"
                    placeholder="Your name"
                    value={form.name}
                    onChange={(event) => setForm({ ...form, name: event.target.value })}
                    required
                    className="rounded-2xl border border-gray-700 bg-[#2a2a2a] px-4 py-4 text-white placeholder-gray-600 focus:border-pink-500 focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="signup-age" className="text-xs tracking-widest text-gray-400">
                    AGE <span className="text-pink-500">*</span>
                  </label>
                  <input
                    id="signup-age"
                    type="number"
                    min="1"
                    max="120"
                    placeholder="Age"
                    value={form.age}
                    onChange={(event) => setForm({ ...form, age: event.target.value })}
                    required
                    className="rounded-2xl border border-gray-700 bg-[#2a2a2a] px-4 py-4 text-white placeholder-gray-600 focus:border-pink-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="signup-email" className="text-xs tracking-widest text-gray-400">
                  EMAIL <span className="text-pink-500">*</span>
                </label>
                <input
                  id="signup-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(event) => setForm({ ...form, email: event.target.value })}
                  required
                  className="rounded-2xl border border-gray-700 bg-[#2a2a2a] px-4 py-4 text-white placeholder-gray-600 focus:border-pink-500 focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="signup-occupation" className="text-xs tracking-widest text-gray-400">OCCUPATION / SKILLS</label>
                <textarea
                  id="signup-occupation"
                  placeholder="Tell us what you do or what you're good at..."
                  value={form.occupation}
                  onChange={(event) => setForm({ ...form, occupation: event.target.value })}
                  rows={4}
                  className="resize-none rounded-2xl border border-gray-700 bg-[#2a2a2a] px-4 py-4 text-white placeholder-gray-600 focus:border-pink-500 focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-6">
                <p className="text-xs tracking-widest text-gray-400">INTERESTS &amp; PASSIONS</p>
                {interests.map((group) => (
                  <div key={group.category}>
                    <p className="mb-3 text-xs tracking-widest text-pink-500">{group.category}</p>
                    <div className="flex flex-wrap gap-2">
                      {group.items.map((item) => (
                        <button
                          type="button"
                          key={item}
                          aria-pressed={selectedInterests.includes(item)}
                          onClick={() => toggleInterest(item)}
                          className={`rounded-full border px-4 py-2 text-sm transition ${
                            selectedInterests.includes(item)
                              ? 'border-pink-500 bg-pink-500 text-white'
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

              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-xs tracking-widest text-gray-400">
                    MEMBERSHIP PLAN <span className="text-pink-500">*</span>
                  </p>
                  <Link to="/memberships" className="text-sm text-pink-400 hover:underline">
                    Not sure? Explore memberships
                  </Link>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {plans.map((plan) => (
                    <button
                      type="button"
                      key={plan.id}
                      aria-pressed={selectedPlan === plan.id}
                      onClick={() => setSelectedPlan(plan.id)}
                      className={`rounded-2xl border p-6 text-left transition ${
                        selectedPlan === plan.id
                          ? 'border-pink-500 bg-[#3a1a2e]'
                          : 'border-gray-700 bg-[#2a2a2a] hover:border-gray-500'
                      }`}
                    >
                      <span className="mb-1 block font-semibold text-white">{plan.name}</span>
                      <span className="mb-1 block text-sm text-pink-400">{plan.price}</span>
                      <span className="block text-xs text-gray-400">{plan.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {formError && (
                <p role="alert" className="rounded-xl border border-red-800 bg-red-950/50 p-4 text-red-200">
                  {formError}
                </p>
              )}

              {!checkoutSession && (
                <button
                  type="submit"
                  disabled={creatingSession || (!stripePromise && !STRIPE_UI_TEST_MODE)}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-pink-500 py-5 text-lg font-semibold text-white transition hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {creatingSession
                    ? 'Preparing secure checkout…'
                    : STRIPE_UI_TEST_MODE
                      ? STRIPE_UI_TEST_CLIENT_SECRET
                        ? 'Continue to Stripe test payment'
                        : 'Continue to payment preview'
                      : 'Continue to secure payment'}
                </button>
              )}
            </fieldset>
          </form>

          {checkoutSession && (checkoutSession.testMode || stripePromise) && (
            <div className="flex flex-col gap-6 rounded-2xl border border-gray-700 bg-[#2a2a2a] p-8">
              <div>
                <p className="mb-2 text-xs tracking-widest text-pink-500">SECURE PAYMENT</p>
                <h2 className="font-serif text-2xl text-white">
                  {plans.find((plan) => plan.id === selectedPlan)?.name}
                </h2>
                <p className="mt-2 text-sm text-gray-400">
                  {checkoutSession.testMode
                    ? checkoutSession.clientSecret
                      ? 'Using your local Stripe test Checkout Session. Completing it does not activate membership.'
                      : 'Preview the payment layout and simulate the checkout interaction.'
                    : 'Your signup details are ready. Complete payment to continue.'}
                </p>
              </div>
              {checkoutSession.testMode && !checkoutSession.clientSecret ? (
                <SignupPaymentPreview onComplete={handleTestPaymentComplete} />
              ) : (
                <SignupPaymentForm
                  stripePromise={stripePromise}
                  clientSecret={checkoutSession.clientSecret}
                  sessionId={checkoutSession.sessionId}
                  plan={selectedPlan}
                  email={form.email}
                  testMode={checkoutSession.testMode}
                  onPaymentSubmitted={
                    checkoutSession.testMode ? handleStripeTestPaymentSubmitted : handlePaymentSubmitted
                  }
                />
              )}
              <button
                type="button"
                onClick={() => setCheckoutSession(null)}
                className="self-start text-sm text-gray-400 underline hover:text-white"
              >
                Edit signup details
              </button>
            </div>
          )}

          <p className="text-center text-sm text-gray-500">
            By joining, you agree to our values of love, respect, and purposeful collaboration.
          </p>
        </section>
      )}
    </div>
  )
}

export default SignUp
