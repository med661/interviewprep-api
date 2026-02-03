'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp, ExternalLink, ArrowRight, Eye, EyeOff, Bookmark, Loader2 } from 'lucide-react';
import RichTextReader from './RichTextReader';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

import { createPortal } from 'react-dom';

interface QuestionCardProps {
  question: any;
  categorySlug: string;
  levelSlug: string;
  index?: number;
  initiallyExpanded?: boolean;
}

export default function QuestionCard({ question, categorySlug, levelSlug, index, initiallyExpanded = false }: QuestionCardProps) {
  const [isExpanded, setIsExpanded] = useState(initiallyExpanded);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loadingBookmark, setLoadingBookmark] = useState(false);
  const [funnyMessage, setFunnyMessage] = useState<string | null>(null);
  const { user } = useAuth();

  const FUNNY_MESSAGES = [
    "Whoa there! You need to be logged in to hoard this gold! 🏴‍☠️",
    "This question is shy... it only goes home with logged-in users! 🙈",
    "Nice try! But the save button is exclusively for the cool kids (aka logged-in members). 😎",
    "I'd love to save this for you, but I don't know who you are! Login maybe? 🤷‍♂️",
    "404: User Identity Not Found. Please login to save! 🤖",
    "You shall not pass! (Without logging in first) 🧙‍♂️"
  ];

  useEffect(() => {
    setIsExpanded(initiallyExpanded);
  }, [initiallyExpanded]);

  // Check if bookmarked on mount (if user is logged in)
  useEffect(() => {
    if (user && question.id) {
       // Ideally this comes from the parent to avoid N+1, but for now we fetch or rely on question data if it exists
       // Check if question object already has bookmark info (depends on backend)
       // If not, we might need a separate check, but let's assume we handle it via interaction for now
       // Or simpler: just let the user toggle. 
       // Better: Check if `bookmarks` array exists in question (if included in query)
       if (question.bookmarks && question.bookmarks.length > 0) {
          // Assuming the backend returns bookmarks for the current user or we check user id
          // If the backend returns ALL bookmarks, we need to check if ANY belongs to this user.
          const userBookmark = question.bookmarks.find((b: any) => b.user_id === user.id);
          if (userBookmark) setIsBookmarked(true);
       }
    }
  }, [user, question]);

  const toggleBookmark = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
        // Show funny message
        const randomMsg = FUNNY_MESSAGES[Math.floor(Math.random() * FUNNY_MESSAGES.length)];
        setFunnyMessage(randomMsg);
        
        // Clear message after 4 seconds
        setTimeout(() => setFunnyMessage(null), 4000);

        // Dispatch event to open login modal with small delay
        setTimeout(() => {
            window.dispatchEvent(new Event('open-login-modal'));
        }, 500);
        return; 
    }

    setLoadingBookmark(true);
    try {
      // Use the toggle endpoint in UsersController
      const res = await api.post(`/users/bookmarks/${question.id}`);
      setIsBookmarked(res.data.bookmarked);
    } catch (err) {
      // Error handled globally
    } finally {
      setLoadingBookmark(false);
    }
  };

  return (
    <div className="glass-card rounded-2xl overflow-hidden group hover:border-primary/30 transition-all duration-300">
      <div className="p-4 md:p-5 flex items-start justify-between gap-4">
        <div 
          className="flex-1 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <h2 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors leading-tight select-none">
            {index ? `Q${index}. ` : ''}{question.title}
          </h2>
        </div>
        
        <div className="flex items-center gap-2 shrink-0">
          <button
            className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-secondary/50 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            title={isExpanded ? "Hide Answer" : "Show Answer"}
          >
            {isExpanded ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>

          <button
            className={`p-2 rounded-lg transition-colors ${
              isBookmarked 
                ? 'text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20' 
                : 'text-muted-foreground hover:text-yellow-500 hover:bg-secondary/50'
            }`}
            onClick={toggleBookmark}
            disabled={loadingBookmark}
            title={isBookmarked ? "Remove Bookmark" : "Save Question"}
          >
             {loadingBookmark ? (
                <Loader2 className="w-5 h-5 animate-spin" />
             ) : (
                <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
             )}
          </button>
          
          <Link
            href={`/interview/${categorySlug}/${levelSlug}/${question.slug}`}
            className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-secondary/50 transition-colors"
            title="View Full Details"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {isExpanded && (
        <div className="px-6 pb-6 md:px-8 md:pb-8 pt-0 animate-in slide-in-from-top-4 fade-in duration-300">
          <div className="pt-4 border-t border-border/50">
            <div className="prose prose-lg dark:prose-invert max-w-none prose-p:text-muted-foreground prose-headings:text-foreground">
              <div className="bg-secondary/30 rounded-xl p-6 border border-border/50">
                <RichTextReader content={question.answer_json} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Funny Toast Notification - Using Portal to escape overflow-hidden */}
      {funnyMessage && typeof document !== 'undefined' && createPortal(
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-4 fade-in zoom-in-95 duration-300 w-[90%] max-w-md pointer-events-none">
          <div className="bg-slate-900/95 dark:bg-white/95 text-white dark:text-slate-900 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-md border border-white/10 dark:border-slate-200/20 flex items-center gap-4 text-center justify-center pointer-events-auto">
             <span className="text-2xl animate-bounce">👻</span>
             <p className="font-bold text-sm md:text-base">{funnyMessage}</p>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

