'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface Partner {
  id: string;
  name: string;
  logo_url: string;
  website_url?: string;
}

export default function PartnersMarquee({ partners }: { partners: Partner[] }) {
  if (!partners || partners.length === 0) return null;

  return (
    <div className="w-full bg-[#F8F9FF] dark:bg-slate-900/50 border-y border-slate-100 dark:border-slate-800 py-16 overflow-hidden">
      <div className="container mx-auto px-4 mb-10 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Our Strategic Partners
        </h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          Collaborating with industry leaders to bring you the best interview preparation resources.
        </p>
      </div>
      
      {/* If partners count is less than 5, disable marquee and center them */}
      {partners.length < 5 ? (
        <div className="flex flex-wrap justify-center gap-16 sm:gap-24 items-center py-4 px-4">
          {partners.map((partner) => (
            <PartnerLogo key={partner.id} partner={partner} />
          ))}
        </div>
      ) : (
        /* Only enable marquee for larger lists */
        <div className="relative flex overflow-x-hidden group py-4">
          <div className="flex animate-marquee whitespace-nowrap gap-16 sm:gap-24 items-center">
            {/* First set of logos */}
            {partners.map((partner) => (
              <PartnerLogo key={`p1-${partner.id}`} partner={partner} />
            ))}
            {/* Second set of logos for seamless loop */}
            {partners.map((partner) => (
              <PartnerLogo key={`p2-${partner.id}`} partner={partner} />
            ))}
          </div>

          {/* Gradient Masks */}
          <div className="absolute top-0 left-0 h-full w-32 bg-gradient-to-r from-[#F8F9FF] dark:from-slate-900 to-transparent z-10" />
          <div className="absolute top-0 right-0 h-full w-32 bg-gradient-to-l from-[#F8F9FF] dark:from-slate-900 to-transparent z-10" />
        </div>
      )}

      <div className="text-center mt-10">
        <a 
          href="/contact-us" 
          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
        >
          Become a Partner <span>→</span>
        </a>
      </div>
    </div>
  );
}

function PartnerLogo({ partner }: { partner: Partner }) {
  const content = (
    <div className="relative h-16 w-40 cursor-pointer transition-transform duration-300 hover:scale-105">
      <img
        src={partner.logo_url}
        alt={partner.name}
        className="w-full h-full object-contain"
      />
    </div>
  );

  if (partner.website_url) {
    return (
      <a href={partner.website_url} target="_blank" rel="noopener noreferrer" title={partner.name}>
        {content}
      </a>
    );
  }

  return <div title={partner.name}>{content}</div>;
}
