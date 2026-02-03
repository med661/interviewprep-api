'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import AdSense from '@/components/AdSense';
import QuestionCard from '@/components/QuestionCard';
import { Search, ChevronLeft, ChevronRight, Loader2, X, Eye, Save, EyeOff } from 'lucide-react';

export default function CategoryPageClient({
  category,
  level
}: {
  category: string;
  level: string;
}) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [catName, setCatName] = useState('');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [meta, setMeta] = useState({ total: 0, last_page: 1, page: 1 });
  const [showAllAnswers, setShowAllAnswers] = useState(false);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setLoading(true);
    api.get(`/questions`, {
      params: {
        category,
        level,
        page,
        limit: 10,
        search: debouncedSearch
      }
    }).then((res) => {
      setQuestions(res.data.data);
      setMeta(res.data.meta);
      if (res.data.data.length > 0) {
        setCatName(res.data.data[0].category.name);
      }
    }).catch(() => {
      // Error handled by global interceptor
      setQuestions([]);
    }).finally(() => setLoading(false));
  }, [category, level, page, debouncedSearch]);

  const levels = ['beginner', 'intermediate', 'advanced'];

  return (
    <div className="min-h-screen bg-background pt-40 pb-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-72 flex-shrink-0 space-y-6 lg:sticky lg:top-32 lg:self-start">
            <div className="glass-card p-6 rounded-2xl">
              <h3 className="font-bold text-foreground mb-4 text-lg">Difficulty Level</h3>
              <div className="flex flex-col gap-2">
                {levels.map((l) => (
                  <Link
                    key={l}
                    href={`/interview/${category}/${l}`}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${level === l
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                      } capitalize flex items-center justify-between`}
                  >
                    {l}
                    {level === l && <span className="w-2 h-2 rounded-full bg-white/40" />}
                  </Link>
                ))}
              </div>
            </div>
            <div className="rounded-xl overflow-hidden shadow-sm">
              <AdSense slot="1234567890" />
            </div>
          </aside>

          <main className="flex-1">
            <div className="glass-card p-8 rounded-3xl mb-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

              <div className="flex flex-col gap-6 relative z-10 text-center items-center">
                <div>
                  <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground mb-2">
                    <span className="capitalize hover:text-primary transition-colors cursor-pointer">{category}</span>
                    <span>•</span>
                    <span className="capitalize">{level} Level</span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-black capitalize text-foreground tracking-tight">
                    {catName || category} Interview Questions
                  </h1>
                </div>
                <div className="relative w-full max-w-xl mx-auto">
                  <input
                    type="text"
                    placeholder="Search questions (e.g. 'closure', 'promise')..."
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-secondary/50 border-transparent focus:bg-background focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all outline-none text-foreground placeholder:text-muted-foreground text-lg shadow-sm"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <Search className="absolute left-4 top-4.5 w-5 h-5 text-muted-foreground" />
                  {search && (
                    <button
                      onClick={() => setSearch('')}
                      className="absolute right-4 top-4.5 text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
              </div>
            ) : (
              <div className="space-y-6">
                {/* Sticky Action Bar */}
                <div className="sticky top-20 z-20 glass-card p-3 rounded-xl mb-6 flex items-center justify-between shadow-sm border border-border/50 backdrop-blur-md">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground px-2">
                        <span>{meta.total} Questions</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowAllAnswers(!showAllAnswers)}
                            className="px-3 py-1.5 text-sm font-medium text-foreground hover:bg-secondary rounded-lg transition-colors flex items-center gap-2"
                        >
                            {showAllAnswers ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            <span className="hidden sm:inline">{showAllAnswers ? 'Hide All' : 'Show Answers'}</span>
                        </button>
                    </div>
                </div>

                <div className="space-y-4">
                  {questions.map((q, index) => (
                    <div key={q.id}>
                      <QuestionCard
                        question={q}
                        categorySlug={category}
                        levelSlug={level}
                        index={index + 1 + (page - 1) * 10}
                        initiallyExpanded={showAllAnswers}
                      />
                      {(index === 2 || index === 7) && (
                         <AdSense slot="9988776655" style={{ margin: '2rem 0' }} />
                      )}
                    </div>
                  ))}
                  {questions.length === 0 && (
                    <div className="text-center py-16 glass-card rounded-3xl border-dashed border-2 border-muted">
                      <div className="mx-auto w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4">
                        <Search className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-bold text-foreground mb-1">No questions found</h3>
                      <p className="text-muted-foreground">Try adjusting your search or filters.</p>
                    </div>
                  )}
                </div>

                {/* Pagination */}
                {meta.last_page > 1 && (
                  <div className="flex justify-center items-center gap-2 pt-8">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="p-3 rounded-xl border border-border hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed text-foreground transition-all"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-sm font-medium text-foreground px-4">
                      Page {page} of {meta.last_page}
                    </span>
                    <button
                      onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))}
                      disabled={page === meta.last_page}
                      className="p-3 rounded-xl border border-border hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed text-foreground transition-all"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
