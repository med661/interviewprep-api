'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

interface AdSenseProps {
  slot: string;
  style?: React.CSSProperties;
  format?: 'auto' | 'fluid' | 'rectangle';
}

const AdSense = ({ slot, style, format = 'auto' }: AdSenseProps) => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      // AdSense error ignored
    }
  }, []);

  return (
    <div className="my-8 text-center overflow-hidden">
      <span className="text-xs text-gray-400 block mb-1">Advertisement</span>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', ...style }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default AdSense;
