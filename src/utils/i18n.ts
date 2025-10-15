// Internationalization utility for loading translations with fallback support

// Define fallback chain for locales
export const fallbackChain: Record<string, string[]> = {
  'en': [],
  'fr': ['en'],
  'es': ['en'],
  'ar': ['en'],
  'ja': ['en'],
  'zh-hans': ['en'],
  'zh-hant': ['zh-hans', 'en'], // zh-hant falls back to zh-hans, then to en
};

/**
 * Load translations with fallback support
 *
 * This function loads translations for a given locale and page, with automatic
 * fallback to configured fallback locales when translation keys are missing.
 *
 * @param locale - The current locale (e.g., 'en', 'fr', 'zh-hant')
 * @param page - The translation file name (e.g., 'index', 'blog', 'BaseLayout', '404')
 * @returns A merged translations object with fallback values
 */
export async function loadTranslationsWithFallback(
  locale: string,
  page: string
): Promise<Record<string, any>> {
  // Build the fallback chain for this locale
  const locales = [locale, ...(fallbackChain[locale] || ['en'])];
  const translationObjects = [];

  // Load translations for each locale in the fallback chain
  for (const loc of locales) {
    try {
      // Dynamically import the translation file using string interpolation
      const module = await import(`../../public/locales/${loc}/${page}.json`);
      translationObjects.push(module.default);
    } catch (e) {
      console.warn(`Failed to load translations for locale: ${loc}, page: ${page}`);
    }
  }

  // Merge translations: later objects override earlier ones (reverse order for correct priority)
  // This ensures: current locale > first fallback > second fallback > ... > default locale
  return Object.assign({}, ...translationObjects.reverse());
}

/**
 * Create a translation function for accessing nested translation keys
 *
 * @param translations - The translations object
 * @returns A function that accepts a dot-notation key and returns the translation
 */
export function createTranslationFunction(translations: Record<string, any>) {
  return (key: string): string => {
    const keys = key.split('.');
    let value: any = translations;
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };
}
