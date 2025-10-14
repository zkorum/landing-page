# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the landing page for Agora Citizen Network (https://www.agoracitizen.network), a civic tech platform. The site is built with **Astro 5** (static site generator) with jQuery/Bootstrap for UI interactions. It is licensed under the Mozilla Public License Version 2.0 (see COPYING).

## Project Structure

```
landing-page/
├── src/
│   ├── components/
│   │   └── LanguageSwitcher.astro # Language switcher component
│   ├── layouts/
│   │   ├── BaseLayout.astro       # Main layout (navbar, footer, scripts)
│   │   └── BlogLayout.astro       # Blog post layout
│   ├── pages/
│   │   ├── 404.astro              # Custom 404 page
│   │   ├── index.astro            # Home page
│   │   ├── blog.astro             # Blog listing page
│   │   └── blog/[...slug].astro   # Dynamic blog post routes
│   └── content/
│       ├── config.ts              # Content collections schema
│       └── blog/
│           ├── en/                # English blog posts
│           ├── fr/                # French blog posts
│           ├── es/                # Spanish blog posts
│           ├── ar/                # Arabic blog posts
│           ├── ja/                # Japanese blog posts
│           ├── zh-hans/           # Simplified Chinese blog posts
│           └── zh-hant/           # Traditional Chinese blog posts
├── public/                        # Static assets
│   ├── locales/                   # i18n translation files (JSON)
│   │   ├── en/                    # English translations
│   │   ├── fr/                    # French translations
│   │   ├── es/                    # Spanish translations
│   │   ├── ar/                    # Arabic translations
│   │   ├── ja/                    # Japanese translations
│   │   ├── zh-hans/               # Simplified Chinese translations
│   │   └── zh-hant/               # Traditional Chinese translations
│   ├── css/                       # Font Awesome, animate.css
│   ├── js/                        # scrollIt.min.js, wow.min.js
│   ├── images/                    # All images
│   ├── webfonts/                  # Font Awesome fonts
│   ├── style.css                  # Main stylesheet
│   └── blog.css                   # Blog-specific styles
├── package.json
├── astro.config.mjs               # Astro config with i18n routing
├── tsconfig.json
└── CLAUDE.md                      # This file
```

## Development Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server (http://localhost:4321)
npm run build        # Build for production → dist/
npm run preview      # Preview production build
```

## Deployment

The site is deployed to Netlify. Configuration is in **netlify.toml**:
- Build command: `npm run build`
- Publish directory: `dist`
- Redirect rules:
  - `/feed/*` → redirects to agoracitizen.app
  - Old HTML blog URLs → new clean URLs (e.g., `/blog-bloquonstout.html` → `/blog/bloquonstout`)
- All language variants are generated at build time as static pages
- Netlify serves the appropriate locale based on the URL path

## Architecture Notes

### Astro + jQuery/Bootstrap Architecture
This site uses **Astro for templating and build** with **jQuery/Bootstrap for UI interactions**:
- Astro handles page generation, layouts, and content collections
- jQuery/Bootstrap/scrollIt/WOW.js handle client-side interactions (loaded via `is:inline` scripts)
- The `is:inline` attribute prevents Astro from processing these scripts, keeping them as-is
- Can incrementally migrate to Vue/React components if needed

### Navigation System
- Home page uses scroll-spy navigation (scrollIt.js library)
- Navigation links use `data-scroll-nav` and `data-scroll-index` attributes
- Navbar animations (scroll effects, logo switching) handled by jQuery

### Responsive Design
- Bootstrap 4.1.1 grid system
- Mobile-first responsive design
- Navbar collapses to hamburger menu on mobile
- jQuery handles navbar scroll effects and logo switching (big_logo_agora.png ↔ small_logo_agora.png)

### JavaScript Dependencies (Preserved from Original)
- jQuery 1.12.4
- Bootstrap 4.1.1
- bxSlider (for testimonial/slider functionality)
- WOW.js (for scroll animations with animate.css)
- scrollIt.js (for smooth scroll navigation)
- Plausible Analytics (privacy-focused analytics)

### Key Features
- **Internationalization (i18n)**: Built-in Astro i18n routing with 7 languages
  - English (en) - default, no prefix in URLs
  - French (fr), Spanish (es), Arabic (ar), Japanese (ja)
  - Simplified Chinese (zh-hans), Traditional Chinese (zh-hant)
  - Fallback system: zh-hant → zh-hans → en, all others → en
- **Content Collections**: Blog posts stored as markdown in `src/content/blog/{locale}/`
- **Dynamic Routes**: `/blog/[slug]` generates pages from markdown
- **Language Switcher**: Custom component with flag icons for language selection
- **Translation System**: JSON-based translations in `public/locales/{locale}/`
  - Per-page translation files: `index.json`, `blog.json`, `BaseLayout.json`, `404.json`
  - Each page imports its own translations dynamically
- **Dynamic mockup images**: Home page rotates through 4 mockup images every 4 seconds
- **Partners slider**: Infinite horizontal scroll animation for partner logos
- **Collapsible FAQ**: Bootstrap collapse components
- **TypeScript Support**: Optional type safety with .astro files

## Common Editing Tasks

### Adding a new blog post
1. Create markdown files for each language in `src/content/blog/{locale}/[slug].md`
   - Start with English: `src/content/blog/en/[slug].md`
   - Add translations in other locales as needed
2. Add frontmatter with title, description, author, date, thumbnail, image
3. Write content in markdown (HTML also works for complex layouts)
4. The post automatically appears on `/blog` and generates route `/blog/[slug]`
5. Add thumbnail image to `public/images/`

**Example frontmatter:**
```yaml
---
title: "Your Blog Title"
description: "Brief description for listing page"
author: "Agora Team"
date: "January 2025"
thumbnail: "/images/your-thumbnail.jpg"
image: "/images/your-og-image.jpg"
---
```

**Note:** Blog posts are locale-specific. Each language directory should contain the translated version of the blog post with the same slug.

**Note:** For images with captions, use HTML instead of markdown:
```html
<div class="text-center my-4">
  <img src="/images/your-image.jpg" alt="Description" class="img-fluid" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
  <p class="mt-2" style="font-size: 14px; color: #818992; font-style: italic;">Image caption text</p>
</div>
```

### Updating translations
1. Locate the appropriate JSON file in `public/locales/{locale}/`
   - `BaseLayout.json` - Navbar and footer text
   - `index.json` - Home page content
   - `blog.json` - Blog listing page
   - `404.json` - 404 page content
2. Edit the JSON values (keep the keys unchanged)
3. Repeat for all locales you want to support

### Adding a new language
1. Add the locale code to `astro.config.mjs` in the `i18n.locales` array
2. Create translation files in `public/locales/{new-locale}/`:
   - `BaseLayout.json`, `index.json`, `blog.json`, `404.json`
3. Create blog post directory: `src/content/blog/{new-locale}/`
4. Add translations for existing blog posts
5. Update the fallback configuration in `astro.config.mjs` if needed

### Updating team members
Edit the Team section in `public/locales/{locale}/index.json` under the `team` object. The team member cards are rendered in `src/pages/index.astro`.

### Adding partners/logos
1. Add logo image to `public/images/`
2. Edit the partners section in `src/pages/index.astro` (search for "partners-track")
3. Add logo twice for seamless infinite scroll animation

### Modifying navigation
1. Update navigation links in `src/layouts/BaseLayout.astro`
2. Update navigation labels in `public/locales/{locale}/BaseLayout.json`

## External Resources

- Main application: https://www.agoracitizen.app
- GitHub organization: https://github.com/zkorum
- Original template: https://www.free-css.com/free-css-templates/page295/applight
- Font libraries: Google Fonts (Poppins, Unbounded, Bricolage Grotesque, Kepler Std)
- Icons: Font Awesome 6

## Important Implementation Notes

### Internationalization (i18n) Architecture
The site uses Astro's built-in i18n routing system:
- **URL Structure**:
  - English (default): `/` (no prefix)
  - Other languages: `/{locale}/` (e.g., `/fr/`, `/es/`)
- **Translation Loading**: Each page dynamically imports its own translation JSON file based on the current locale
- **Locale Detection**: Astro automatically detects locale from URL and provides it via `Astro.currentLocale`
- **Fallback Strategy**: Configured in `astro.config.mjs`:
  - Traditional Chinese → Simplified Chinese → English
  - All other languages → English
- **Blog Posts**: Stored in locale-specific directories (`src/content/blog/{locale}/`)
- **Dynamic Routes**: The `[...slug].astro` file handles blog post routing for all locales

### Script Loading with `is:inline`
All jQuery/Bootstrap scripts use the `is:inline` attribute in BaseLayout.astro to prevent Astro from processing them:
```astro
<script is:inline src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
```
This ensures scripts work exactly as expected without bundling or transformation.

### Canonical URL Handling
`Astro.site` is undefined in development mode, so BaseLayout.astro uses a fallback:
```javascript
const canonicalURL = Astro.site ? new URL(Astro.url.pathname, Astro.site) : `https://www.agoracitizen.network${Astro.url.pathname}`;
```

### Image Captions in Blog Posts
For styled image captions, use HTML instead of markdown:
```html
<div class="text-center my-4">
  <img src="/images/example.jpg" alt="..." class="img-fluid" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
  <p class="mt-2" style="font-size: 14px; color: #818992; font-style: italic;">Caption text</p>
</div>
```

### Site URL Configuration
Production site uses `www` subdomain. Configured in:
- `astro.config.mjs`: `site: 'https://www.agoracitizen.network'`
- `BaseLayout.astro`: Fallback URL includes `www`

## License

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

See [COPYING](./COPYING) for the full license text.
