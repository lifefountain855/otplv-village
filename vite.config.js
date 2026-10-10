import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'

const rootDir = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig(({ command, mode }) => {
  const localEnv = loadEnv(mode, rootDir, '')

  return {
    plugins: [
      react(),
      tailwindcss(),
    ],
    define: {
      'import.meta.env.STRIPE_UI_TEST_CLIENT_SECRET':
        command === 'serve' && mode === 'development'
          ? JSON.stringify(localEnv.STRIPE_UI_TEST_CLIENT_SECRET || '')
          : JSON.stringify(''),
    },
  }
})
