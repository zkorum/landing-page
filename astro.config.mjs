// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.agoracitizen.network',
  output: 'static', // SSG mode
  i18n: {
    defaultLocale: "en",
    locales: ["en", "fr", "es", "ar", "ja", "zh-hans", "zh-hant"],
    routing: {
      prefixDefaultLocale: false, // English URLs won't have /en/ prefix
      fallbackType: "rewrite", // Show fallback content without redirecting
    },
    fallback: {
      // IMPORTANT: This fallback configuration is REQUIRED for Astro to generate pages
      // for all locales in SSG mode, but the actual fallback behavior does NOT work.
      // When a translation key is missing, Astro does NOT fall back to the configured
      // locale - you must implement manual fallback logic in your translation loading code.
      //
      // Note: Chained fallback (e.g., "zh-hant": "zh-hans", "zh-hans": "en") prevents
      // page generation entirely, so all locales must fall back directly to the default locale.
      "zh-hant": "en",
      "zh-hans": "en",
      "fr": "en",
      "es": "en",
      "ar": "en",
      "ja": "en",
    }
  },
  integrations: [mdx()],
  vite: {
    server: {
      watch: {
        ignored: ['**/node_modules/**', '**/.git/**', '**/Dockerfile', '**/Makefile']
      }
    }
  },
  trailingSlash: 'never',
  outDir: './dist'
});
