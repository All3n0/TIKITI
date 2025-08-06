'use client';
import { useEffect, useState } from 'react';

export default function CookieConsentBanner({ onConsentGiven }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) setVisible(true);
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true');
    setVisible(false);
    onConsentGiven(); // Try rechecking session after accept
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-300 p-4 z-50 shadow-lg text-sm sm:text-base flex flex-col sm:flex-row items-center justify-between">
      <p className="mb-2 sm:mb-0 text-gray-700">
        We use cookies to keep you logged in. Please accept cookies to continue using Tikiti.
      </p>
      <button
        onClick={handleAccept}
        className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700 transition"
      >
        Accept Cookies
      </button>
    </div>
  );
}
