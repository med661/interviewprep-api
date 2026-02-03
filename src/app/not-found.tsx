'use client';

import Link from 'next/link';
import { FileQuestion, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Animated 404 Glitch Effect */}
        <div className="relative">
          <h1 className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 animate-pulse select-none">
            404
          </h1>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-9xl font-black text-blue-600/10 dark:text-blue-400/10 blur-xl">
            404
          </div>
        </div>

        {/* Funny Developer Message */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-foreground">
            Wait, this variable is <span className="text-red-500 font-mono">undefined</span>!
          </h2>
          <p className="text-lg text-muted-foreground max-w-lg mx-auto">
            We searched the entire binary tree, checked every index in the array, and even grep'd the database. 
            Result? <code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-sm font-mono">null</code>.
          </p>
          <p className="text-sm text-muted-foreground italic">
            (Maybe it was garbage collected?)
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link 
            href="/"
            className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition-all hover:scale-105 shadow-lg shadow-blue-600/20"
          >
            <Home className="w-5 h-5" />
            Return Home
          </Link>
          <button 
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-8 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-foreground rounded-full font-medium transition-all hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </div>

        {/* Code Snippet Decoration */}
        <div className="mt-12 opacity-50 select-none pointer-events-none" aria-hidden="true">
          <pre className="text-xs text-left inline-block bg-slate-50 dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 font-mono">
{`if (page === "found") {
  return render(page);
} else {
  // Page not found
  throw new Error("Where are we?");
  // TODO: Fix the router
}`}
          </pre>
        </div>
      </div>
    </div>
  );
}
