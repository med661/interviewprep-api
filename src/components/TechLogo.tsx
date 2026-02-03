import { Code, Server, Database, Cpu, Users, Globe, Terminal, Layers } from 'lucide-react';
import Image from 'next/image';

interface TechLogoProps {
  name: string;
  className?: string;
  logoUrl?: string | null;
}

export const TechLogo = ({ name, className = "w-10 h-10", logoUrl }: TechLogoProps) => {
  // If logoUrl is provided, use it with lazy loading (default in next/image)
  if (logoUrl) {
    return (
      <div className={`${className} relative overflow-hidden rounded-md flex items-center justify-center`}>
        <img
          src={logoUrl}
          alt={`${name || 'Tech'} logo`}
          className="w-full h-full object-contain p-1"
          loading="lazy"
        />
      </div>
    );
  }

  const lower = (name || '').toLowerCase();
  
  // JavaScript (Yellow Shield style)
  if (lower.includes('javascript') || lower === 'js' || lower.includes('es6')) {
    return (
      <div className={`${className} bg-[#F7DF1E] rounded-md flex items-end justify-end p-1 shadow-sm border border-yellow-400/20`}>
        <span className="text-black font-extrabold text-[40%] leading-none tracking-tighter">JS</span>
      </div>
    );
  }

  // TypeScript (Blue Shield style)
  if (lower.includes('typescript') || lower === 'ts') {
    return (
      <div className={`${className} bg-[#3178C6] rounded-md flex items-end justify-end p-1 shadow-sm border border-blue-400/20`}>
        <span className="text-white font-extrabold text-[40%] leading-none tracking-tighter">TS</span>
      </div>
    );
  }

  // React (Blue Atom style fallback)
  if (lower.includes('react')) {
    return <div className={`text-[#61DAFB] ${className} flex items-center justify-center`}><Globe className="w-full h-full" /></div>;
  }

  // Node.js (Green Hexagon style fallback)
  if (lower.includes('node')) {
    return <div className={`text-[#339933] ${className} flex items-center justify-center`}><Server className="w-full h-full" /></div>;
  }

  // Python (Blue/Yellow style fallback)
  if (lower.includes('python')) {
    return <div className={`text-[#3776AB] ${className} flex items-center justify-center`}><Terminal className="w-full h-full" /></div>;
  }
  
  // HTML (Orange)
  if (lower.includes('html')) {
    return <div className={`text-[#E34F26] ${className} flex items-center justify-center`}><Code className="w-full h-full" /></div>;
  }

  // CSS (Blue)
  if (lower.includes('css')) {
    return <div className={`text-[#1572B6] ${className} flex items-center justify-center`}><Layers className="w-full h-full" /></div>;
  }

  // Default Fallbacks
  if (lower.includes('backend')) return <div className={`text-green-500 ${className} flex items-center justify-center`}><Server className="w-full h-full" /></div>;
  if (lower.includes('system')) return <div className={`text-purple-500 ${className} flex items-center justify-center`}><Database className="w-full h-full" /></div>;
  if (lower.includes('hr')) return <div className={`text-pink-500 ${className} flex items-center justify-center`}><Users className="w-full h-full" /></div>;
  
  return <div className={`text-blue-600 ${className} flex items-center justify-center`}><Cpu className="w-full h-full" /></div>;
};
