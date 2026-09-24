import { defineConfig } from 'vitest/config';

export default defineConfig({
  define: {
    // Match webpack DefinePlugin: globals available as bare identifiers at build time
    DOMAIN: JSON.stringify('https://img.de-publieke-zaak.nl'),
    APIBASE: JSON.stringify('/open-data/api/'),
  },
  resolve: {
    // Resolve TypeScript sources before any tsc-emitted `.js` leftovers that
    // may sit alongside them in src/ (Vite's default list tries `.js` before
    // `.ts`, which would silently run tests against stale compiled artifacts
    // instead of the actual source).
    extensions: ['.mts', '.ts', '.tsx', '.mjs', '.js', '.jsx', '.json'],
  },
  test: {
    env: {
      TZ: 'Europe/Amsterdam',
    },
    setupFiles: ['./test/helpers/setup-graphs.ts'],
  },
});
