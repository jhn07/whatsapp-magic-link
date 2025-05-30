import { useState, useEffect } from "react";


/**
 * Hook to determine if the application is running in an in-app browser
 * (WebView inside applications like Gmail, Facebook, Instagram, etc.)
 * 
 * @returns {boolean} true, if the application is running in an in-app browser
 */
export const useInAppBrowser = (): boolean => {
  const [isInApp, setIsInApp] = useState<boolean>(false);

  useEffect(() => {
    // Perform check only on the client side
    if (typeof window === 'undefined') return;

    const ua = navigator.userAgent.toLowerCase();

    const inApp = (
      // Popular applications
      /instagram|fbav|fbsv|fb_iab|twitter|whatsapp|telegram|line|gsaversion|gmail/i.test(ua) ||
      // Android WebView
      /wv/i.test(ua) ||
      // iOS WebView: usually doesn't have "Version" or "Safari"
      (/iphone|ipad|ipod/i.test(ua) && !(/version|safari/i.test(ua)))
    );

    // For development, you can add an in-app browser simulation
    if (process.env.NODE_ENV === 'development' && window.location.search.includes('debug=inapp')) {
      setIsInApp(true);
      return;
    }

    setIsInApp(inApp);
  }, []);

  return isInApp;
};

export default useInAppBrowser;