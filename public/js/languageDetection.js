/**
 * Language detection and automatic redirect utility
 * Detects user's preferred language and redirects to the appropriate locale version
 */

(function() {
  const SUPPORTED_LOCALES = ['en', 'fr', 'es', 'ar', 'ja', 'zh-hans', 'zh-hant'];
  const DEFAULT_LOCALE = 'en';
  const STORAGE_KEY = 'agora-language';

  // Map browser language codes to our supported locales
  const LOCALE_MAP = {
    'en': 'en',
    'fr': 'fr',
    'es': 'es',
    'ar': 'ar',
    'ja': 'ja',
    'zh': 'zh-hans',
    'zh-CN': 'zh-hans',
    'zh-Hans': 'zh-hans',
    'zh-TW': 'zh-hant',
    'zh-HK': 'zh-hant',
    'zh-Hant': 'zh-hant',
  };

  /**
   * Detect locale from browser language preferences
   * @returns {string} Detected locale code
   */
  function detectBrowserLocale() {
    const browserLangs = navigator.languages || [navigator.language || navigator.userLanguage];

    for (const lang of browserLangs) {
      // Try exact match first
      if (LOCALE_MAP[lang]) {
        return LOCALE_MAP[lang];
      }
      // Try language code without region
      const baseCode = lang.split('-')[0];
      if (LOCALE_MAP[baseCode]) {
        return LOCALE_MAP[baseCode];
      }
    }

    return DEFAULT_LOCALE;
  }

  /**
   * Get user's preferred locale (saved preference or browser detection)
   * @returns {string} Preferred locale code
   */
  function getPreferredLocale() {
    let preferredLocale = localStorage.getItem(STORAGE_KEY);

    if (!preferredLocale || !SUPPORTED_LOCALES.includes(preferredLocale)) {
      preferredLocale = detectBrowserLocale();
      localStorage.setItem(STORAGE_KEY, preferredLocale);
    }

    return preferredLocale;
  }

  /**
   * Extract locale information from current URL path
   * @returns {object} Object with currentLocale, pathWithoutLocale, hasLocalePrefix
   */
  function parseCurrentPath() {
    const currentPath = window.location.pathname;
    const pathParts = currentPath.split('/').filter(Boolean);
    const firstPart = pathParts[0];

    const hasLocalePrefix = SUPPORTED_LOCALES.includes(firstPart);
    const currentLocale = hasLocalePrefix ? firstPart : DEFAULT_LOCALE;

    const pathWithoutLocale = hasLocalePrefix
      ? '/' + pathParts.slice(1).join('/')
      : currentPath;

    return {
      currentLocale,
      pathWithoutLocale,
      hasLocalePrefix,
      fullPath: currentPath
    };
  }

  /**
   * Build target path for a given locale
   * @param {string} locale - Target locale code
   * @param {string} pathWithoutLocale - Path without locale prefix
   * @returns {string} Full target path with locale prefix if needed
   */
  function buildTargetPath(locale, pathWithoutLocale) {
    if (locale === DEFAULT_LOCALE) {
      return pathWithoutLocale || '/';
    }
    return `/${locale}${pathWithoutLocale}`;
  }

  /**
   * Check if a URL exists by making a HEAD request
   * @param {string} url - URL to check
   * @returns {Promise<boolean>} True if page exists
   */
  async function checkPageExists(url) {
    try {
      const response = await fetch(url, { method: 'HEAD', redirect: 'manual' });
      // If status is 200 or redirect (3xx), the page exists
      return response.ok || (response.status >= 300 && response.status < 400);
    } catch (error) {
      // If fetch fails, assume page exists (static site should work)
      return true;
    }
  }

  /**
   * Perform language detection and redirect if needed
   * This is the main function that should be called on page load
   */
  async function handleLanguageRedirect() {
    const { currentLocale, pathWithoutLocale } = parseCurrentPath();
    const preferredLocale = getPreferredLocale();
    const currentHash = window.location.hash;
    const currentSearch = window.location.search;

    // If we're already on the preferred locale, just save it and return
    if (currentLocale === preferredLocale) {
      localStorage.setItem(STORAGE_KEY, currentLocale);
      return;
    }

    // Build target URL with preferred locale
    const targetPath = buildTargetPath(preferredLocale, pathWithoutLocale);

    // Check if the target page exists
    const pageExists = await checkPageExists(targetPath);

    if (pageExists) {
      // Redirect to preferred locale version
      window.location.replace(targetPath + currentSearch + currentHash);
    } else {
      // Page doesn't exist in preferred locale, stay on current page
      // Update the saved preference to match current locale to avoid future redirects
      localStorage.setItem(STORAGE_KEY, currentLocale);
    }
  }

  // Run on page load
  handleLanguageRedirect();

  // Export functions for use elsewhere if needed
  window.AgoraLanguage = {
    getPreferredLocale,
    detectBrowserLocale,
    parseCurrentPath,
    buildTargetPath,
    SUPPORTED_LOCALES,
    DEFAULT_LOCALE,
    STORAGE_KEY
  };
})();
