import { defineConfig } from 'vitest/config';

export default defineConfig({
  define: {
    // Match webpack DefinePlugin: globals available as bare identifiers at build time
    DOMAIN: JSON.stringify('https://img.de-publieke-zaak.nl'),
    APIBASE: JSON.stringify('/open-data/api/'),
  },
  test: {
    env: {
      TZ: 'Europe/Amsterdam',
    },
    setupFiles: ['./test/helpers/setup-graphs.ts'],
  },
});
