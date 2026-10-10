# Stripe payments launch checklist

Use this list to move the signup flow from local testing to real annual membership payments. Do not enable live payments until the backend, webhook, production configuration, and end-to-end checks are complete.

## 1. Prepare Stripe catalog and environments

- [x] Confirm the Explorer and Studio Stripe Prices are active recurring **yearly** prices, belong to the intended products, and use the intended currency and amounts.
- [ ] Record the Price IDs for backend configuration. Never accept Price IDs or amounts supplied by the browser.
- [x] Create a separate Stripe sandbox for development and testing; keep its API keys, prices, Checkout Sessions, and webhook endpoint separate from live mode.
- [ ] Create the production restricted API key with only the permissions required for Checkout Sessions, customers, and subscriptions. Store it only in the backend platform's secret manager/environment, never in Vite variables or frontend code.

## 2. Implement and secure the Railway backend

- [ ] Add backend configuration for the Stripe secret/restricted key and allowlisted annual plan Prices, for example `STRIPE_SECRET_KEY`, `STRIPE_PRICE_EXPLORER_ANNUAL`, and `STRIPE_PRICE_STUDIO_ANNUAL`. Store these as Railway secrets/server-side variables; use distinct sandbox and live values.
- [ ] Keep the API version current and use an instantiated Stripe client rather than a global API-key configuration.
- [ ] Implement `POST /signup/checkout-session`: validate and normalize required signup fields, allow only the known plan identifiers, map the plan to its server-configured Price ID, and persist the signup as pending.
- [ ] Create a subscription-mode Checkout Session using the server-selected Price, `ui_mode: "custom"`, and an appropriate return URL. Do not set `payment_method_types`; let Stripe dynamically select eligible methods. Set `integration_identifier` with a custom label and an eight-random-letter suffix.
- [ ] Return only the Checkout Session `clientSecret` and session ID required by the frontend. Never return the Stripe secret key or other unnecessary customer/session data.
- [ ] Configure API CORS for the production website origin and explicitly allowed local development origins; reject unrelated origins.
- [ ] Implement `GET /signup/checkout-status` so a browser cannot use an arbitrary session ID to inspect another person's signup. Return only `pending`, `confirmed`, or `failed`, and report `confirmed` only after trusted webhook processing activates that signup.
- [ ] Add a webhook endpoint using the raw request body and verify every event's Stripe signature with a backend-only `STRIPE_WEBHOOK_SECRET`. Make handling idempotent and safe to retry.
- [ ] Handle `checkout.session.completed` and `checkout.session.async_payment_succeeded`, and only grant access when `payment_status` permits fulfillment. Handle `checkout.session.async_payment_failed` as a failure.
- [ ] For subscriptions, handle the lifecycle events the application needs, including `customer.subscription.*`, `invoice.paid`, and `invoice.payment_failed`. Before production, also handle relevant `charge.dispute.created`, `charge.refunded`, and `radar.early_fraud_warning.created` events and resolve them to the correct subscription/customer.
- [ ] Grant, renew, suspend, or revoke membership based on verified backend state and the subscription lifecycle, not the browser return page or Stripe.js result.
- [ ] Do not enable automatic tax unless Stripe Tax is configured with active registrations in the jurisdictions where tax will be collected.

## 3. Configure frontend and hosting environment variables

- [ ] Set production `VITE_API_BASE_URL` to the production Railway API URL.
- [ ] Set production `VITE_STRIPE_PUBLISHABLE_KEY` to the production **publishable** key (`pk_live_...`). This value is public by design; never put a secret/restricted key here.
- [ ] Set `VITE_STRIPE_UI_TEST_MODE=false` in production (or omit it).
- [ ] Leave `STRIPE_UI_TEST_CLIENT_SECRET` unset in every deployed environment. It is only for a local sandbox Checkout Session and must never contain a live client secret.
- [ ] Configure Railway's production `STRIPE_SECRET_KEY`, Price ID variables, and `STRIPE_WEBHOOK_SECRET` in Railway's secret settings, not in this repository or any `VITE_` variable.
- [ ] Configure the production webhook URL and enabled event list in Stripe Workbench/Dashboard, using a separate endpoint and signing secret for the sandbox.
- [ ] Verify `.env.local` and other local environment files remain ignored by Git; keep `.env.example` limited to blank or non-secret placeholders.

## 4. Test before enabling live mode

- [ ] With sandbox keys and sandbox Prices, test both Explorer and Studio signup from the actual form through a backend-created Checkout Session.
- [ ] Test successful payment, declined payment, abandoned/expired checkout, and any enabled delayed/asynchronous payment method.
- [ ] Confirm webhook signature failures are rejected, duplicate webhook delivery is idempotent, and membership is not granted from the return URL alone.
- [ ] Confirm `checkout.session.completed` while unpaid does not activate membership; confirm successful asynchronous payment and recurring invoice events update membership correctly.
- [ ] Test subscription cancellation, renewal, and payment failure, plus the applicable refund/dispute/fraud event handling.
- [ ] Verify signup data, selected annual Price, customer, Checkout Session, subscription, and membership records remain associated and are not exposed through the status endpoint.
- [ ] Remove any local `STRIPE_UI_TEST_CLIENT_SECRET`, turn off UI test mode, and verify the ordinary signup page uses the backend integration.
- [ ] Run the frontend production build and lint checks; run the Railway backend's tests and verify webhook delivery in the sandbox.

## 5. Go live

- [ ] Confirm production Stripe account activation, live annual Prices, support/refund process, privacy disclosures, and applicable tax registrations.
- [ ] Deploy backend secrets and webhook endpoint first, then deploy the frontend with the production API URL and publishable key.
- [ ] Make one controlled production checkout and verify the signed webhook, subscription, and membership state before announcing availability.
- [ ] Monitor Stripe request/webhook logs and Railway errors; rotate any credential that was exposed and use separate keys for production and non-production.
