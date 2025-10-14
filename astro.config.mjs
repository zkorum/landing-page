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
      // Chinese fallback logic
      "zh-hant": "zh-hans",
      "zh-hans": "en",
      // All other languages fallback to English
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
