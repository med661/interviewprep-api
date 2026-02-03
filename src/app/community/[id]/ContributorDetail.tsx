'use client';

import { Github, Twitter, Linkedin, Globe, ArrowLeft, Copy, CheckCircle2, Share2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface Contributor {
  id: string;
  name: string;
  role: string;
  bio?: string;
  image_url?: string;
  linkedin_url?: string;
  twitter_url?: string;
  github_url?: string;
  website_url?: string;
}

interface ContributorDetailProps {
  contributor: Contributor;
}

export default function ContributorDetail({ contributor }: ContributorDetailProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      {/* Background Ambience */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <Link 
            href="/community" 
            className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Community
          </Link>

          <div className="bg-white dark:bg-slate-900/50 rounded-3xl p-8 md:p-12 border border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden">
            {/* Decorative Gradient Blob */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl -mr-20 -mt-20" />

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-40 h-40 rounded-full p-1.5 bg-gradient-to-br from-blue-500 to-purple-600 mb-6 shadow-2xl">
                <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-slate-900 relative">
                    {contributor.image_url ? (
                        <img 
                            src={contributor.image_url} 
                            alt={contributor.name} 
                            className="w-full h-full object-cover" 
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-slate-400 bg-slate-100 dark:bg-slate-800">
                            {contributor.name.charAt(0)}
                        </div>
                    )}
                </div>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
                {contributor.name}
              </h1>
              <div className="inline-block px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-sm font-bold text-blue-600 dark:text-blue-400 mb-8 tracking-wide uppercase shadow-sm">
                {contributor.role}
              </div>

              <div className="w-full max-w-2xl bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 mb-8 border border-slate-100 dark:border-slate-800/50">
                <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed whitespace-pre-wrap">
                  {contributor.bio || "Contributing to the community one commit at a time."}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
                {contributor.github_url && (
                    <a 
                        href={contributor.github_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all font-medium"
                    >
                        <Github className="w-5 h-5" />
                        <span>GitHub</span>
                    </a>
                )}
                {contributor.linkedin_url && (
                    <a 
                        href={contributor.linkedin_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-5 py-2.5 bg-[#0077b5]/10 text-[#0077b5] hover:bg-[#0077b5]/20 rounded-xl transition-all font-medium"
                    >
                        <Linkedin className="w-5 h-5" />
                        <span>LinkedIn</span>
                    </a>
                )}
                {contributor.twitter_url && (
                    <a 
                        href={contributor.twitter_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-5 py-2.5 bg-[#1DA1F2]/10 text-[#1DA1F2] hover:bg-[#1DA1F2]/20 rounded-xl transition-all font-medium"
                    >
                        <Twitter className="w-5 h-5" />
                        <span>Twitter</span>
                    </a>
                )}
                {contributor.website_url && (
                    <a 
                        href={contributor.website_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-5 py-2.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900/50 rounded-xl transition-all font-medium"
                    >
                        <Globe className="w-5 h-5" />
                        <span>Website</span>
                    </a>
                )}
              </div>

              <div className="w-full border-t border-slate-100 dark:border-slate-800 pt-8 flex justify-center">
                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all"
                >
                  {copied ? <CheckCircle2 className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
                  {copied ? 'Link Copied!' : 'Share Profile'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
