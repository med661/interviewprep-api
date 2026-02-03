'use client';

import { useEffect, useState } from 'react';
import { WifiOff, RefreshCcw, X } from 'lucide-react';

export default function ConnectionStatus() {
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const handleConnectionLost = () => setIsError(true);
    const handleConnectionRestored = () => setIsError(false);

    window.addEventListener('api-connection-lost', handleConnectionLost);
    window.addEventListener('api-connection-restored', handleConnectionRestored);

    return () => {
      window.removeEventListener('api-connection-lost', handleConnectionLost);
      window.removeEventListener('api-connection-restored', handleConnectionRestored);
    };
  }, []);

  if (!isError) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="bg-red-500 text-white p-4 rounded-lg shadow-lg flex items-start gap-3 border border-red-600">
        <WifiOff className="w-5 h-5 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="font-semibold text-sm">Connection Lost</h3>
          <p className="text-xs text-red-100 mt-1">
            Cannot reach the server. Please check your internet connection or try again later.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-3 text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-md transition-colors flex items-center gap-2 font-medium"
          >
            <RefreshCcw className="w-3 h-3" />
            Reload Page
          </button>
        </div>
        <button 
          onClick={() => setIsError(false)}
          className="text-red-100 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
