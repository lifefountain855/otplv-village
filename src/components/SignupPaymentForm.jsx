import { useState } from 'react'
import {
  CheckoutElementsProvider,
  PaymentElement,
  useCheckoutElements,
} from '@stripe/react-stripe-js/checkout'

export function SignupPaymentPreview({ onComplete }) {
  const [showDecline, setShowDecline] = useState(false)

  return (
    <div className="flex flex-col gap-6" aria-label="Simulated payment form preview">
      <p className="rounded-lg border border-amber-700 bg-amber-950/50 p-3 text-sm text-amber-200">
        Preview only — these are not live Stripe Elements. Do not enter real payment details.
      </p>
      <div className="flex flex-wrap gap-2 text-sm text-gray-300" aria-hidden="true">
        <span className="rounded-full border border-pink-500 bg-[#3a1a2e] px-4 py-2">Card</span>
        <span className="rounded-full border border-gray-600 px-4 py-2">Link</span>
        <span className="rounded-full border border-gray-600 px-4 py-2">More payment methods</span>
      </div>
      <div className="flex flex-col gap-4 rounded-xl border border-gray-600 bg-[#202020] p-5">
        <label className="flex flex-col gap-2 text-sm text-gray-300">
          Card information
          <input
            type="text"
            disabled
            placeholder="Card number     MM / YY     CVC"
            className="rounded-lg border border-gray-600 bg-[#2a2a2a] px-4 py-3 text-gray-500"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-gray-300">
          Country or region
          <input
            type="text"
            disabled
            placeholder="Select country or region"
            className="rounded-lg border border-gray-600 bg-[#2a2a2a] px-4 py-3 text-gray-500"
          />
        </label>
      </div>
      {showDecline && (
        <p role="alert" className="rounded-xl border border-red-800 bg-red-950/50 p-4 text-red-200">
          Simulated card decline. No payment was attempted.
        </p>
      )}
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => {
            setShowDecline(false)
            onComplete()
          }}
          className="flex-1 rounded-full bg-pink-500 py-4 font-semibold text-white transition hover:bg-pink-600"
        >
          Simulate successful payment
        </button>
        <button
          type="button"
          onClick={() => setShowDecline(true)}
          className="rounded-full border border-gray-600 px-5 py-4 text-gray-200 transition hover:border-pink-500"
        >
          Preview decline
        </button>
      </div>
    </div>
  )
}

function PaymentForm({ sessionId, plan, testMode, onPaymentSubmitted }) {
  const checkoutState = useCheckoutElements()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (checkoutState.type !== 'success' || isSubmitting) return

    setIsSubmitting(true)
    setError('')
    try {
      const returnUrl = new URL('/signup', window.location.origin)
      returnUrl.searchParams.set('plan', plan)
      if (testMode) {
        returnUrl.searchParams.set('stripe_test_return', 'true')
      } else {
        returnUrl.searchParams.set('session_id', sessionId)
      }

      const result = await checkoutState.checkout.confirm({
        returnUrl: returnUrl.toString(),
        redirect: 'if_required',
      })

      if (result.type === 'error') {
        setError(result.error.message)
        return
      }

      onPaymentSubmitted(result.session.id)
    } catch (confirmationError) {
      setError(
        confirmationError instanceof Error
          ? confirmationError.message
          : 'Payment could not be completed. Please try again.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (checkoutState.type === 'loading') {
    return <p className="text-gray-400" role="status">Loading secure payment form…</p>
  }

  if (checkoutState.type === 'error') {
    return <p className="text-red-300" role="alert">{checkoutState.error.message}</p>
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <PaymentElement />
      {error && (
        <p role="alert" className="rounded-xl border border-red-800 bg-red-950/50 p-4 text-red-200">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={isSubmitting || !checkoutState.checkout.canConfirm}
        className="w-full rounded-full bg-pink-500 py-4 font-semibold text-white transition hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? 'Processing payment…' : 'Pay securely'}
      </button>
    </form>
  )
}

function SignupPaymentForm({ stripePromise, clientSecret, sessionId, plan, email, testMode = false, onPaymentSubmitted }) {
  return (
    <CheckoutElementsProvider
      stripe={stripePromise}
      options={{
        clientSecret,
        defaultValues: { email },
        elementsOptions: {
          appearance: {
            theme: 'night',
            variables: {
              colorPrimary: '#ec4899',
              colorBackground: '#2a2a2a',
              colorText: '#f9fafb',
              colorDanger: '#f87171',
              borderRadius: '12px',
            },
          },
        },
      }}
    >
      <PaymentForm
        sessionId={sessionId}
        plan={plan}
        testMode={testMode}
        onPaymentSubmitted={onPaymentSubmitted}
      />
    </CheckoutElementsProvider>
  )
}

export default SignupPaymentForm
