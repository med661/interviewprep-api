'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Terminal, User, LogOut, Sparkles, Menu, X } from 'lucide-react';
import { ModeToggle } from './ModeToggle';
import { useAuth } from '@/context/AuthContext';
import LoginModal from '@/components/auth/LoginModal';

export default function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const openAuth = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setIsLoginOpen(true);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
        <nav className="glass rounded-full px-6 py-3 flex items-center justify-between w-full max-w-5xl border border-white/20 dark:border-white/10 shadow-xl shadow-black/5 dark:shadow-black/20 animate-in fade-in slide-in-from-top-4 duration-700 pointer-events-auto relative">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400 hover:opacity-80 transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div className="bg-gradient-to-tr from-blue-600 to-violet-600 p-1.5 rounded-lg text-white shadow-lg shadow-blue-500/30">
              <Terminal className="w-5 h-5" />
            </div>
            <span className="hidden sm:inline">InterviewPrep</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-white/5 rounded-full transition-all"
            >
              Home
            </Link>
            <Link
              href="/categories"
              className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-white/5 rounded-full transition-all"
            >
              Categories
            </Link>
            <Link
              href="/community"
              className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-white/5 rounded-full transition-all"
            >
              Community
            </Link>
            {isAuthenticated && (
              <Link
                href="/dashboard"
                className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-white/5 rounded-full transition-all"
              >
                Dashboard
              </Link>
            )}
          </div>

          <div className="flex items-center gap-2">
            <ModeToggle />

            {/* Desktop Auth */}
            <div className="hidden md:flex ml-2">
              {!isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => openAuth('signin')}
                    className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    Sign In
                  </button>
                  <button 
                    onClick={() => openAuth('signup')}
                    className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-violet-600 rounded-full hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <Sparkles size={16} />
                    Sign Up
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                   <span className="text-sm font-medium">
                     {user?.email.split('@')[0]}
                   </span>
                   <button
                     onClick={logout}
                     className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
                     title="Sign Out"
                   >
                     <LogOut size={18} />
                   </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Mobile Menu Dropdown */}
          {isMobileMenuOpen && (
            <>
              {/* Overlay to close menu when clicking outside */}
              <div 
                className="fixed inset-0 z-40 bg-transparent md:hidden" 
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <div className="absolute top-full left-0 right-0 mt-2 mx-2 p-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-white/20 dark:border-slate-800 rounded-2xl shadow-xl flex flex-col gap-2 md:hidden animate-in slide-in-from-top-2 fade-in duration-200 origin-top z-50">
              <Link
                href="/"
                className="px-4 py-3 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/categories"
                className="px-4 py-3 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Categories
              </Link>
              <Link
                href="/community"
                className="px-4 py-3 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Community
              </Link>
              {isAuthenticated && (
                <Link
                  href="/dashboard"
                  className="px-4 py-3 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
              )}
              
              <div className="h-px bg-slate-200 dark:bg-slate-800 my-1" />
              
              {!isAuthenticated ? (
                <div className="flex flex-col gap-2 p-2">
                  <button 
                    onClick={() => openAuth('signin')}
                    className="w-full px-4 py-3 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors text-left"
                  >
                    Sign In
                  </button>
                  <button 
                    onClick={() => openAuth('signup')}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-violet-600 rounded-xl shadow-lg shadow-blue-500/20"
                  >
                    <Sparkles size={16} />
                    Sign Up
                  </button>
                </div>
              ) : (
                <button
                   onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                   className="w-full px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors flex items-center gap-2"
                >
                   <LogOut size={16} />
                   Sign Out
                </button>
              )}
            </div>
            </>
          )}
        </nav>
      </div>

      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
        mode={authMode}
      />
    </>
  );
}
