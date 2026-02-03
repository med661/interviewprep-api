'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Github, Twitter, Linkedin, Globe, HeartHandshake } from 'lucide-react';
import Link from 'next/link';

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

export default function CommunityClient() {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContributors = async () => {
      try {
        const res = await api.get('/contributors');
        setContributors(res.data);
      } catch (error) {
        console.error('Failed to fetch contributors');
      } finally {
        setLoading(false);
      }
    };

    fetchContributors();
  }, []);

  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      {/* Background Ambience */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-in slide-in-from-bottom-8 fade-in duration-700">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-sm font-medium mb-6">
            <HeartHandshake className="w-4 h-4" />
            <span>Community Heroes</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
            Meet the Minds Behind <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              The Platform
            </span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            Our platform thrives thanks to these dedicated developers, engineers, and interview experts who volunteer their time to help you succeed.
          </p>
        </div>

        {/* Contributors Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-slate-900/50 rounded-2xl p-6 h-80 animate-pulse border border-slate-200 dark:border-slate-800">
                <div className="w-24 h-24 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto mb-4" />
                <div className="h-6 bg-slate-200 dark:bg-slate-800 w-1/2 mx-auto mb-3 rounded" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 w-1/3 mx-auto mb-6 rounded" />
                <div className="space-y-2">
                    <div className="h-3 bg-slate-200 dark:bg-slate-800 w-full rounded" />
                    <div className="h-3 bg-slate-200 dark:bg-slate-800 w-5/6 mx-auto rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {contributors.map((contributor) => (
              <Link 
                href={`/community/${contributor.id}`}
                key={contributor.id}
                className="group relative bg-white dark:bg-slate-900/50 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 hover:border-blue-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1 overflow-hidden"
              >
                {/* Decorative Gradient Blob */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-500" />

                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-br from-blue-500 to-purple-600 mb-5 shadow-lg">
                    <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-slate-900 relative">
                        {contributor.image_url ? (
                            <img 
                                src={contributor.image_url} 
                                alt={contributor.name} 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-slate-400 bg-slate-100 dark:bg-slate-800">
                                {contributor.name.charAt(0)}
                            </div>
                        )}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                    {contributor.name}
                  </h3>
                  <div className="inline-block px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-4 tracking-wide uppercase">
                    {contributor.role}
                  </div>

                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3 min-h-[60px]">
                    {contributor.bio || "Contributing to the community one commit at a time."}
                  </p>

                  <div className="flex items-center gap-4 mt-auto">
                    {contributor.github_url && (
                        <div className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all">
                            <Github className="w-5 h-5" />
                        </div>
                    )}
                    {contributor.linkedin_url && (
                        <div className="p-2 text-slate-400 hover:text-[#0077b5] hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-all">
                            <Linkedin className="w-5 h-5" />
                        </div>
                    )}
                    {contributor.twitter_url && (
                        <div className="p-2 text-slate-400 hover:text-[#1DA1F2] hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-all">
                            <Twitter className="w-5 h-5" />
                        </div>
                    )}
                    {contributor.website_url && (
                        <div className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-full transition-all">
                            <Globe className="w-5 h-5" />
                        </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
            
            {/* Join Us Card */}
            <div className="group relative bg-gradient-to-br from-blue-600 to-purple-700 rounded-3xl p-8 text-white text-center flex flex-col items-center justify-center hover:shadow-2xl hover:shadow-blue-600/20 transition-all duration-300 hover:-translate-y-1">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm group-hover:scale-110 transition-transform">
                    <HeartHandshake className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Join the Community</h3>
                <p className="text-white/80 mb-8 text-sm leading-relaxed">
                    Want to help others prepare for their dream job? Become a contributor and share your knowledge!
                </p>
                <Link 
                    href="/contact-us" 
                    className="px-6 py-3 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-colors w-full"
                >
                    Get Involved
                </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
