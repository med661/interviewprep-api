'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

interface RelatedQuestionsProps {
  questions?: any[];
}

export default function RelatedQuestions({ questions = [] }: RelatedQuestionsProps) {
  if (!questions || questions.length === 0) return null;

  return (
    <div className="mt-16 border-t border-slate-200 dark:border-slate-800 pt-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg text-blue-600 dark:text-blue-400">
          <Sparkles className="w-5 h-5 fill-current" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Related Questions
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {questions.map((q) => (
          <Link
            key={q.slug}
            href={`/interview/${q.category.slug}/${q.level}/${q.slug}`}
            className="group glass-card p-6 rounded-2xl hover:border-blue-500/30 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${
                  q.level === 'beginner' 
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                    : q.level === 'intermediate'
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                    : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                }`}>
                  {q.level}
                </span>
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors line-clamp-2 mb-4">
                {q.title}
              </h3>
            </div>
            
            <div className="flex items-center text-sm font-semibold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
              View Answer <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
