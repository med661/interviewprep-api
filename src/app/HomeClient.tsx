'use client';

import Link from 'next/link';
import AdSense from '@/components/AdSense';
import PartnersMarquee from '@/components/PartnersMarquee';
import { ArrowRight, Code, Server, Database, Cpu, Users, Sparkles, Zap, Star } from 'lucide-react';
import { TechLogo } from '@/components/TechLogo';

export default function HomeClient({ categories, featured, partners }: { categories: any[], featured: any[], partners: any[] }) {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-950">
      {/* Hero Section */}
      <section className="relative pt-40 pb-32 overflow-hidden">
        {/* Abstract Background Effects Removed for cleaner look */}
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-white/10 text-sm font-medium mb-8 animate-in slide-in-from-bottom-4 fade-in duration-700">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400 font-bold">
              New Questions Added Weekly
            </span>
          </div>

          <h1 className="text-6xl md:text-7xl lg:text-8xl font-black mb-8 tracking-tight text-slate-900 dark:text-white leading-tight animate-in slide-in-from-bottom-8 fade-in duration-1000">
            Master Your <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-violet-500 animate-gradient-x">
              Technical Interview
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-12 leading-relaxed animate-in slide-in-from-bottom-12 fade-in duration-1000 delay-200">
            Access curated questions, expert-verified answers, and essential tips for developers. Level up your career with confidence.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-in slide-in-from-bottom-16 fade-in duration-1000 delay-300">
            <Link
              href="#categories"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-full font-bold text-lg hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Zap className="w-5 h-5 fill-current" />
              Start Practicing
            </Link>
            <Link
              href="#featured"
              className="px-8 py-4 bg-white dark:bg-white/10 text-slate-700 dark:text-white border border-slate-200 dark:border-white/10 rounded-full font-bold text-lg hover:bg-slate-50 dark:hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-2"
            >
              View Featured
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Floating Stats or Icons */}
          <div className="absolute top-1/2 -translate-y-1/2 left-10 hidden xl:block animate-float delay-1000">
            <div className="glass p-4 rounded-2xl border-l-4 border-blue-500">
              <Code className="w-8 h-8 text-blue-500 mb-2" />
              <div className="font-bold text-lg">500+</div>
              <div className="text-xs text-muted-foreground">Coding Questions</div>
            </div>
          </div>

          <div className="absolute top-1/2 -translate-y-1/2 right-10 hidden xl:block animate-float delay-500">
            <div className="glass p-4 rounded-2xl border-l-4 border-violet-500">
              <Users className="w-8 h-8 text-violet-500 mb-2" />
              <div className="font-bold text-lg">10k+</div>
              <div className="text-xs text-muted-foreground">Developers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Marquee */}
      <PartnersMarquee partners={partners} />

      <div className="container mx-auto px-4 py-20 space-y-32">
        <AdSense slot="1234567890" style={{ maxWidth: '800px', margin: '0 auto 4rem' }} />
        {/* Categories Section */}
        <section id="categories">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-yellow-500 fill-current" />
                Browse by Category
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Sharpen your skills in specific areas.
              </p>
            </div>
            <Link href="/categories" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold flex items-center gap-1 group">
              View all <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((cat, idx) => (
              <Link
                key={cat.id}
                href={`/interview/${cat.slug}/beginner`}
                className="group glass-card p-8 rounded-3xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-violet-500/10 rounded-bl-[100px] -mr-8 -mt-8 transition-all group-hover:scale-110" />

                <div className="mb-6 w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                  <TechLogo name={cat.name} logoUrl={cat.logo_url} className="w-16 h-16" />
                </div>

                <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  Explore questions <ArrowRight className="w-4 h-4" />
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Questions Section */}
        <section id="featured" className="relative">
          <AdSense slot="0987654321" style={{ maxWidth: '800px', margin: '0 auto 4rem' }} />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-50/30 dark:via-blue-900/10 to-transparent -mx-4 md:-mx-20 -z-10 h-full rounded-[3rem]" />

          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-3">
                <Star className="w-8 h-8 text-amber-400 fill-current" />
                Featured Questions
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Top interview questions asked by leading tech companies.
              </p>
            </div>
          </div>

          <div className="grid gap-6">
            {featured.map((q) => (
              <Link
                key={q.id}
                href={`/interview/${q.category.slug}/${q.level}/${q.slug}`}
                className="group block glass p-0.5 rounded-2xl hover:bg-gradient-to-r hover:from-blue-500 hover:via-indigo-500 hover:to-violet-500 transition-all duration-500"
              >
                <div className="bg-white dark:bg-[#1a1b1e] p-6 sm:p-8 rounded-[15px] h-full flex flex-col sm:flex-row sm:items-center justify-between gap-6 group-hover:bg-white/95 dark:group-hover:bg-[#1a1b1e]/95 transition-all">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                        {q.category.name}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${q.level === 'beginner'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                            : q.level === 'intermediate'
                              ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                              : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                          }`}
                      >
                        {q.level}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-violet-600 transition-all">
                      {q.title}
                    </h3>
                  </div>
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                    <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
