'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdSense from '@/components/AdSense';
import api from '@/lib/api';
import { Search, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { TechLogo } from '@/components/TechLogo';

export default function CategoriesClient() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, totalPages: 0, limit: 12 });

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get('/categories', {
        params: {
          page,
          limit: meta.limit,
          search
        }
      });
      // Handle response structure { data: [...], meta: ... }
      const data = Array.isArray(res.data) ? res.data : (res.data.data || []);
      const metaData = res.data.meta || { total: 0, totalPages: 0, limit: 12 };
      
      setCategories(data);
      setMeta(metaData);
    } catch (err) {
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCategories();
    }, 300);
    return () => clearTimeout(timer);
  }, [page, search]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-950 pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-6xl">
        
        {/* Header Section */}
        <div className="text-center mb-12 space-y-6">
            <div className="space-y-2">
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white flex items-center justify-center gap-3">
                    <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-yellow-500 fill-current" />
                    All Categories
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                    Browse our collection of technical interview topics and master your next interview.
                </p>
            </div>

            {/* Prominent Search Bar */}
            <div className="relative max-w-[600px] mx-auto w-full group">
                <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6" />
                    <input
                        type="text"
                        placeholder="Search categories (e.g. JavaScript, System Design)..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1); // Reset to page 1 on search
                        }}
                        className="w-full pl-14 pr-6 py-4 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-lg text-slate-900 dark:text-white placeholder:text-slate-400 shadow-lg shadow-slate-200/50 dark:shadow-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1">
                        <kbd className="px-2 py-1 text-xs font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">⌘</kbd>
                        <kbd className="px-2 py-1 text-xs font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">K</kbd>
                    </div>
                </div>
            </div>
        </div>

        <AdSense slot="5678901234" style={{ marginBottom: '3rem' }} />

        {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="h-56 rounded-3xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
                ))}
            </div>
        ) : (
            <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
                    {categories.length > 0 ? categories.map((cat) => (
                        <Link
                            key={cat.id}
                            href={`/interview/${cat.slug}/beginner`}
                            className="group bg-white dark:bg-slate-900 p-6 rounded-3xl relative overflow-hidden border border-slate-200 dark:border-slate-800 hover:shadow-xl hover:border-blue-500/20 transition-all duration-300 flex flex-col items-center text-center"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-violet-500/5 rounded-bl-[100px] -mr-8 -mt-8 transition-all group-hover:scale-110" />

                            <div className="mb-6 w-20 h-20 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                                <TechLogo name={cat.name} logoUrl={cat.logo_url} className="w-16 h-16" />
                            </div>

                            <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {cat.name}
                            </h3>
                            
                            <div className="mt-auto pt-4 flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                <span className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full font-medium">
                                    {cat._count?.questions || 0} Questions
                                </span>
                            </div>
                        </Link>
                    )) : (
                        <div className="col-span-full text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 border-dashed">
                            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="w-8 h-8 text-slate-400" />
                            </div>
                            <p className="text-xl font-medium text-slate-900 dark:text-white mb-2">No categories found</p>
                            <p className="text-slate-500">We couldn't find anything matching "{search}"</p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {meta.totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="p-3 rounded-full border border-slate-200 dark:border-slate-700 disabled:opacity-50 hover:bg-white dark:hover:bg-slate-800 shadow-sm transition-all"
                        >
                            <ChevronLeft className="w-6 h-6 text-slate-600 dark:text-slate-300" />
                        </button>
                        <span className="text-slate-600 dark:text-slate-300 font-medium px-4 py-2 bg-white dark:bg-slate-900 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm">
                            Page {page} of {meta.totalPages}
                        </span>
                        <button
                            onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
                            disabled={page === meta.totalPages}
                            className="p-3 rounded-full border border-slate-200 dark:border-slate-700 disabled:opacity-50 hover:bg-white dark:hover:bg-slate-800 shadow-sm transition-all"
                        >
                            <ChevronRight className="w-6 h-6 text-slate-600 dark:text-slate-300" />
                        </button>
                    </div>
                )}
            </>
        )}
      </div>
    </div>
  );
}
