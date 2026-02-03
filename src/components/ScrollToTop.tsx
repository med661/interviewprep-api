'use client';

import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

interface ScrollToTopProps {
  containerId?: string;
}

export default function ScrollToTop({ containerId }: ScrollToTopProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const getTarget = () => containerId ? document.getElementById(containerId) : window;
    const target = getTarget();

    if (!target) return;

    const toggleVisibility = () => {
      const scrollTop = containerId 
        ? (target as HTMLElement).scrollTop 
        : window.scrollY;

      if (scrollTop > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    target.addEventListener('scroll', toggleVisibility);

    return () => {
      target.removeEventListener('scroll', toggleVisibility);
    };
  }, [containerId]);

  const scrollToTop = () => {
    const target = containerId ? document.getElementById(containerId) : window;
    target?.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 z-50 p-3 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 animate-in fade-in zoom-in"
      aria-label="Scroll to top"
    >
      <ArrowUp className="h-6 w-6" />
    </button>
  );
}
