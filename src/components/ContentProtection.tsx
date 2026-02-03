'use client';

import { useEffect, useState } from 'react';

export default function ContentProtection() {
  const [blur, setBlur] = useState(false);

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    const handleCopy = (e: ClipboardEvent) => e.preventDefault();
    const handleCut = (e: ClipboardEvent) => e.preventDefault();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === 'c' || e.key === 'u' || e.key === 'p' || e.key === 's')
      ) {
        e.preventDefault();
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setBlur(true);
      } else {
        setBlur(false);
      }
    };

    const handleBlur = () => setBlur(true);
    const handleFocus = () => setBlur(false);

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('cut', handleCut);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('cut', handleCut);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  if (!blur) return null;

  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center pointer-events-none">
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-gray-800">Content Protected</h2>
        <p className="text-gray-600 mt-2">Please keep this window focused to continue reading.</p>
      </div>
    </div>
  );
}
