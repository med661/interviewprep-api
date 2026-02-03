'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';
import { Bookmark, Clock, ArrowRight, BookOpen, ChevronLeft, ChevronDown, ChevronUp } from 'lucide-react';
import RichTextReader from '@/components/RichTextReader';
import Loader from '@/components/Loader';
import { TechLogo } from '@/components/TechLogo';

export default function UserDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<{ slug: string; name: string } | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());

  const toggleExpand = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedQuestions(newExpanded);
  };

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        let endpoint = '';
        
        // Bookmarks logic
        if (selectedCategory) {
          endpoint = `/users/bookmarks?category=${selectedCategory.slug}`;
        } else {
          endpoint = '/users/bookmarks/categories';
        }
        
        const res = await api.get(endpoint);
        setData(res.data);
        
        // Auto-expand all questions if we are viewing a list of questions
        if (selectedCategory) {
          const allIds: Set<string> = new Set(res.data.map((item: any) => item.id));
          setExpandedQuestions(allIds);
        }
      } catch (err) {
        // Error handling
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, selectedCategory]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader size="lg" variant="dots" />
      </div>
    );
  }

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center py-20">
          <Loader size="lg" />
        </div>
      );
    }

    if (data.length === 0) {
      return (
        <div className="text-center py-20">
          <div className="bg-slate-100 dark:bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bookmark className="text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
            No bookmarks yet
          </h3>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            Start saving questions you want to review later.
          </p>
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition-colors"
          >
            Explore Questions
          </Link>
        </div>
      );
    }

    // View: Categories Grid (Bookmarks root)
    if (!selectedCategory) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {data.map((cat: any) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory({ slug: cat.slug, name: cat.name })}
              className="group p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 hover:shadow-lg transition-all text-left"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-300">
                  <TechLogo name={cat.name} logoUrl={cat.logo_url} className="w-12 h-12" />
                </div>
                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold px-3 py-1 rounded-full">
                  {cat.count} Saved
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 transition-colors">
                {cat.name}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
                View Questions <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </p>
            </button>
          ))}
        </div>
      );
    }

    // View: Questions List (Selected Category Bookmarks)
    return (
      <div className="space-y-6">
        {selectedCategory && (
          <div className="flex items-center gap-4 mb-6">
            <button 
              onClick={() => setSelectedCategory(null)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-slate-500" />
            </button>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              <span className="text-slate-400 font-normal">Saved in </span>
              {selectedCategory.name}
            </h2>
          </div>
        )}

        <div className="grid gap-4">
          {data.map((item) => {
            const q = item.question;
            
            if (!q || !q.category) {
              return null;
            }

            const isExpanded = expandedQuestions.has(item.id);

            return (
              <div
                key={item.id}
                className="group rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 overflow-hidden hover:border-blue-500/30 hover:shadow-md transition-all"
              >
                <div 
                  className="flex items-center justify-between p-4 cursor-pointer"
                  onClick={(e) => toggleExpand(e, item.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700 group-hover:border-blue-200 dark:group-hover:border-blue-900 transition-colors">
                      <BookOpen className="w-5 h-5 text-slate-400 group-hover:text-blue-500" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-md">
                          {q.category.name}
                        </span>
                        <span className="text-xs text-slate-400 capitalize">{q.level}</span>
                      </div>
                      <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                        {q.title}
                      </h3>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                     <button
                        onClick={(e) => toggleExpand(e, item.id)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors"
                        title={isExpanded ? "Hide Answer" : "Show Answer"}
                      >
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                      <Link
                        href={`/interview/${q.category.slug}/${q.level}/${q.slug}`}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors"
                        title="Go to full page"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ArrowRight className="w-5 h-5" />
                      </Link>
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-4 pb-4 md:px-6 md:pb-6 pt-0 animate-in slide-in-from-top-2 fade-in duration-200">
                    <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                       <div className="prose prose-sm dark:prose-invert max-w-none prose-p:text-slate-600 dark:prose-p:text-slate-300">
                          <RichTextReader content={q.answer_json} />
                       </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-32 pb-20">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Welcome back, {user?.email.split('@')[0]}.
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              Pick up where you left off.
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden min-h-[600px]">
          <div className="border-b border-slate-200 dark:border-slate-800">
            <div className="flex gap-8 px-8">
              <div
                className="py-4 text-sm font-medium border-b-2 border-blue-600 text-blue-600 flex items-center gap-2"
              >
                <Bookmark size={18} />
                Saved Questions
              </div>
            </div>
          </div>

          <div className="p-8">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
