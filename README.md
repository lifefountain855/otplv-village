# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Stripe signup checkout

The signup page uses Stripe's embedded Payment Element backed by a Checkout Session in custom UI mode. Copy `.env.example` to `.env.local` and set `VITE_STRIPE_PUBLISHABLE_KEY` to the publishable key for the Stripe sandbox or environment being used. `VITE_API_BASE_URL` defaults to the existing Railway API. These `VITE_` values are included in browser code; never put a Stripe secret or restricted key in them. Configure the secret key and webhook signing secret in Railway's secret settings, preferably using a least-privilege restricted key.

To preview the signup/payment layout without waiting for the backend, set `VITE_STRIPE_UI_TEST_MODE=true` in `.env.local` and restart Vite. Without a test-session secret, this local-development-only mode skips the checkout and status requests and renders a clearly labeled mock payment-form preview with simulated success/decline buttons. It does not render Stripe Elements or take payment.

To mount the real Stripe Payment Element without calling the backend, add your Stripe **test-mode** publishable key to `VITE_STRIPE_PUBLISHABLE_KEY` and a client secret from a Stripe **test-mode custom Checkout Session** to `STRIPE_UI_TEST_CLIENT_SECRET` in the ignored `.env.local`. Keep `VITE_STRIPE_UI_TEST_MODE=true`. The local dev server checks that the keys start with `pk_test_` and `cs_test_` respectively; it uses the supplied session client secret directly and bypasses session creation/status API calls. Completing that test Checkout Session can create a real test-mode payment, but it does not exercise the backend webhook or activate membership. Do not share or commit the client secret, do not use a live (`cs_live_`/`pk_live_`) session or key, and never put the client secret in a `VITE_` variable. The Vite config exposes this non-`VITE_` value only to the local development server; it is excluded from production builds. Restart Vite after changing `.env.local`.

The frontend expects the Railway API to implement this contract:

- `POST /signup/checkout-session` accepts the signup form (`name`, `age`, `email`, `occupation`, `interests`, `plan`, and `syceColor`) and returns `{ "clientSecret": "...", "sessionId": "cs_..." }`. The backend must validate the plan (`explorer` or `studio`), map it to the corresponding annual Price from the Stripe catalog, persist signup details as pending, and create a Checkout Session with `mode: "subscription"` and `ui_mode: "custom"`. On current Stripe API versions, set `integration_identifier` to a custom label with an eight-random-letter suffix. Do not trust prices or amounts sent by a browser.
- `GET /signup/checkout-status?session_id=cs_...` returns `{ "status": "pending" | "confirmed" | "failed" }`. Return `confirmed` only after the signed webhook has verified payment and activated the membership; return only the minimum status information needed by the browser.
- Configure CORS on the API for the deployed website origin and local development origin.

The backend must verify Stripe webhook signatures and handle `checkout.session.completed`, `checkout.session.async_payment_succeeded`, and `checkout.session.async_payment_failed`. For annual subscriptions, also handle the lifecycle events it acts on, including `customer.subscription.*`, `invoice.paid`, and `invoice.payment_failed`; before production, account for relevant `charge.dispute.created`, `charge.refunded`, and `radar.early_fraud_warning.created` events. The browser's confirmation result or return URL is not a source of truth for membership fulfillment. Use a separate Stripe sandbox for development, and do not enable automatic tax unless active Stripe Tax registrations are in place.
