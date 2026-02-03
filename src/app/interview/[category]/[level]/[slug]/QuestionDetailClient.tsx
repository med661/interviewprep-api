'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import RichTextReader from '@/components/RichTextReader';
import ContentProtection from '@/components/ContentProtection';
import AdSense from '@/components/AdSense';
import { BookOpen, CheckCircle2, ChevronRight, Share2, Lightbulb, AlertTriangle, ArrowLeft, ArrowRight, Bookmark, Trophy, Twitter, Facebook, Linkedin, Copy, Volume2, StopCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import ReportModal from '@/components/ReportModal';
import RelatedQuestions from '@/components/RelatedQuestions';

interface QuestionDetailClientProps {
  slug: string;
  initialQuestion?: any;
}

export default function QuestionDetailClient({ slug, initialQuestion }: QuestionDetailClientProps) {
  const { user } = useAuth();
  const userId = user?.id;
  const [question, setQuestion] = useState<any>(initialQuestion || null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [funnyMessage, setFunnyMessage] = useState<string | null>(null);
  
  // Speech Synthesis State
  const [isReading, setIsReading] = useState(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);

  useEffect(() => {
    setIsSpeechSupported(typeof window !== 'undefined' && 'speechSynthesis' in window);
    
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const extractTextFromTiptap = (json: any): string => {
    if (!json) return '';
    if (Array.isArray(json)) {
      return json.map(extractTextFromTiptap).join(' ');
    }
    if (json.text) return json.text;
    if (json.content) return extractTextFromTiptap(json.content);
    return '';
  };

  const handleSpeak = () => {
    if (!isSpeechSupported) return;

    if (isReading) {
      window.speechSynthesis.cancel();
      setIsReading(false);
      return;
    }

    const titleText = question.title || '';
    const answerText = extractTextFromTiptap(question.answer_json);
    const fullText = `${titleText}. ${answerText}`;

    const utterance = new SpeechSynthesisUtterance(fullText);
    utterance.onend = () => setIsReading(false);
    utterance.onerror = () => setIsReading(false);
    
    // Optional: Select a better voice if available
    const voices = window.speechSynthesis.getVoices();
    // Try to find a good English voice
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Google US English') || 
      voice.name.includes('Samantha') || 
      voice.lang.startsWith('en-')
    );
    if (preferredVoice) utterance.voice = preferredVoice;

    window.speechSynthesis.speak(utterance);
    setIsReading(true);
  };

  const FUNNY_MESSAGES = [
    "Whoa there! You need to be logged in to hoard this gold! 🏴‍☠️",
    "This question is shy... it only goes home with logged-in users! 🙈",
    "Nice try! But the save button is exclusively for the cool kids (aka logged-in members). 😎",
    "I'd love to save this for you, but I don't know who you are! Login maybe? 🤷‍♂️",
    "404: User Identity Not Found. Please login to save! 🤖",
    "You shall not pass! (Without logging in first) 🧙‍♂️"
  ];

  useEffect(() => {
    if (!initialQuestion) {
      api.get(`/questions/${slug}`)
        .then((res) => setQuestion(res.data))
        .catch(() => {});
    }
  }, [slug, initialQuestion]);

  useEffect(() => {
    if (userId && question?.id) {
      api.get(`/users/status/${question.id}`)
        .then(res => {
          setIsBookmarked(res.data.bookmarked);
        })
        .catch(() => {});
    }
  }, [userId, question?.id]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setShowShareMenu(false);
  };

  const getShareUrl = (platform: string) => {
    // Construct clean URL for SEO friendliness and avoid tracking params
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const cleanUrl = question 
      ? `${baseUrl}/interview/${question.category.slug}/${question.level}/${question.slug}`
      : (typeof window !== 'undefined' ? window.location.href : '');

    const title = question?.title || 'Interview Question';
    // Generate relevant hashtags based on content
    const hashtags = ['interview', 'coding', 'developer', question?.category?.slug?.replace(/-/g, ''), question?.level].filter(Boolean).join(',');
    
    // Engaging text for social sharing
    const text = `🚀 Just found this great interview question: "${title}"\n\nCan you solve it? Check it out here! 👇\n`;
    
    switch (platform) {
      case 'twitter':
        return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(cleanUrl)}&hashtags=${hashtags}`;
      case 'linkedin':
        return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(cleanUrl)}`;
      case 'facebook':
        return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(cleanUrl)}`;
      case 'whatsapp':
        return `https://wa.me/?text=${encodeURIComponent(text + ' ' + cleanUrl)}`;
      default:
        return '';
    }
  };

  const toggleBookmark = async () => {
    if (!userId) {
      // Show funny message
      const randomMsg = FUNNY_MESSAGES[Math.floor(Math.random() * FUNNY_MESSAGES.length)];
      setFunnyMessage(randomMsg);
      
      // Clear message after 4 seconds
      setTimeout(() => setFunnyMessage(null), 4000);

      // Small delay before opening login modal to ensure user sees the message
      setTimeout(() => {
        window.dispatchEvent(new Event('open-login-modal'));
      }, 500);
      return;
    }
    const res = await api.post(`/users/bookmarks/${question.id}`);
    setIsBookmarked(res.data.bookmarked);
  };

  if (!question) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground animate-pulse">Loading amazing content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 pt-32">
      <ContentProtection />

      {/* Funny Toast Notification */}
      {funnyMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-4 fade-in zoom-in-95 duration-300 w-[90%] max-w-md">
          <div className="bg-slate-900/95 dark:bg-white/95 text-white dark:text-slate-900 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-md border border-white/10 dark:border-slate-200/20 flex items-center gap-4 text-center justify-center">
             <span className="text-2xl animate-bounce">👻</span>
             <p className="font-bold text-sm md:text-base">{funnyMessage}</p>
          </div>
        </div>
      )}

      {/* Background Ambience */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-violet-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-8 fade-in duration-700">

          {/* Breadcrumb / Navigation */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4 overflow-x-auto whitespace-nowrap pb-2">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4 flex-shrink-0" />
            <Link href={`/interview/${question.category.slug}/beginner`} className="hover:text-primary transition-colors capitalize">{question.category.name}</Link>
            <ChevronRight className="w-4 h-4 flex-shrink-0" />
            <Link href={`/interview/${question.category.slug}/${question.level}`} className="hover:text-primary transition-colors capitalize">{question.level}</Link>
            <ChevronRight className="w-4 h-4 flex-shrink-0" />
            <span className="text-foreground font-medium truncate">{question.title}</span>
          </div>

          {/* Header Card */}
          <div className="glass-card rounded-3xl p-8 md:p-10 border-l-4 border-l-blue-600 relative z-20">
            <div className="absolute top-0 right-0 p-6 opacity-10">
            </div>

            <div className="relative z-10">
              {/* Action Buttons Moved Top Above Title */}
              <div className="flex flex-wrap items-center justify-end gap-2 mb-4">
                  {/* Read Aloud Button */}
                  {isSpeechSupported && (
                    <button
                      onClick={handleSpeak}
                      className={`flex items-center gap-1.5 transition-all duration-300 px-3 py-1.5 rounded-md font-medium text-xs ${
                        isReading
                          ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 ring-1 ring-amber-500/20 animate-pulse'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                      title={isReading ? "Stop Reading" : "Read Question & Answer"}
                    >
                      {isReading ? <StopCircle className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                      {isReading ? 'Stop' : 'Listen'}
                    </button>
                  )}

                  <button
                    onClick={toggleBookmark}
                    className={`flex items-center gap-1.5 transition-all duration-300 px-3 py-1.5 rounded-md font-medium text-xs ${
                      isBookmarked 
                        ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 ring-1 ring-purple-500/20' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
                    {isBookmarked ? 'Saved' : 'Save'}
                  </button>

                  <div className="relative z-50">
                    <button 
                      onClick={() => setShowShareMenu(!showShareMenu)}
                      className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors px-3 py-1.5 rounded-md font-medium text-xs"
                      title="Share"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Share</span>
                    </button>

                    {showShareMenu && (
                      <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 p-2 z-[60] animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex flex-col gap-1">
                          <a 
                            href={getShareUrl('twitter')} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                          >
                            {/* Updated X Logo instead of Twitter Bird */}
                            <svg className="w-4 h-4 text-slate-900 dark:text-white" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                            <span>Post on X</span>
                          </a>
                          <a 
                            href={getShareUrl('linkedin')} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                          >
                            <Linkedin className="w-4 h-4 text-[#0A66C2]" />
                            <span>Share on LinkedIn</span>
                          </a>
                          <a 
                            href={getShareUrl('facebook')} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                          >
                            <Facebook className="w-4 h-4 text-[#1877F2]" />
                            <span>Share on Facebook</span>
                          </a>
                          <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />
                          <button 
                            onClick={handleCopyLink}
                            className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors w-full text-left"
                          >
                            {copied ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-slate-400" />}
                            <span>{copied ? 'Copied to clipboard' : 'Copy link'}</span>
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {/* Backdrop to close menu */}
                    {showShareMenu && (
                      <div className="fixed inset-0 z-40" onClick={() => setShowShareMenu(false)} />
                    )}
                  </div>
                  
                  <button
                    onClick={() => setIsReportModalOpen(true)}
                    className="flex items-center gap-1.5 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors px-3 py-1.5 rounded-md font-medium text-xs"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Report
                  </button>
              </div>

              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white leading-tight mb-2">
                {question.title}
              </h1>
            </div>
          </div>

          <ReportModal
            questionId={question.id}
            isOpen={isReportModalOpen}
            onClose={() => setIsReportModalOpen(false)}
          />

          {/* Answer Section */}
          <div className="glass-card rounded-3xl overflow-hidden shadow-xl ring-1 ring-black/5 dark:ring-white/10">
            <div className="bg-gradient-to-r from-gray-50 to-white dark:from-[#1a1b1e] dark:to-[#1a1b1e] border-b border-gray-100 dark:border-gray-800 px-8 py-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800 dark:text-gray-200 flex items-center gap-3">
                <div className="bg-blue-600 p-2 rounded-lg text-white shadow-lg shadow-blue-500/30">
                  <BookOpen className="w-5 h-5" />
                </div>
                Comprehensive Answer
              </h2>
            </div>
            <div className="p-8 md:p-10 prose prose-lg dark:prose-invert max-w-3xl mx-auto prose-headings:font-bold prose-a:text-blue-600 text-slate-800 dark:text-slate-300 prose-code:text-purple-600 dark:prose-code:text-purple-400">
              <RichTextReader content={question.answer_json} />
            </div>
          </div>

          {/* Tips Section */}
          {question.tips_json && Object.keys(question.tips_json).length > 0 && (
            <div className="glass-card rounded-3xl overflow-hidden shadow-xl ring-1 ring-black/5 dark:ring-white/10 mt-8 relative group">
               {/* Abstract decorative shapes */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-colors duration-500" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl group-hover:bg-orange-500/20 transition-colors duration-500" />
              
              <div className="relative z-10">
                <div className="border-b border-gray-100 dark:border-gray-800 px-8 py-6 flex items-center gap-4 bg-gradient-to-r from-amber-50/50 to-transparent dark:from-amber-950/10">
                  <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-2.5 rounded-xl text-white shadow-lg shadow-amber-500/20 rotate-3 group-hover:rotate-6 transition-transform duration-300">
                    <Lightbulb className="w-5 h-5 fill-white/90" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-gray-100">
                      Expert Insights
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                      Pro tips & common pitfalls
                    </p>
                  </div>
                </div>

                <div className="p-8 md:p-10 bg-gradient-to-b from-white to-amber-50/30 dark:from-[#1a1b1e] dark:to-amber-950/5">
                  <div className="prose prose-lg dark:prose-invert max-w-3xl mx-auto prose-p:text-slate-700 dark:prose-p:text-slate-300 prose-headings:text-slate-900 dark:prose-headings:text-white prose-li:marker:text-amber-500">
                    <RichTextReader content={question.tips_json} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-8">
            {question.previous ? (
              <Link
                href={`/interview/${question.previous.category.slug}/${question.previous.level}/${question.previous.slug}`}
                className="group relative overflow-hidden bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    <ArrowLeft size={20} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Previous</div>
                    <div className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors line-clamp-2">
                      {question.previous.title}
                    </div>
                  </div>
                </div>
              </Link>
            ) : <div className="hidden sm:block" />}

            {question.next && (
              <Link
                href={`/interview/${question.next.category.slug}/${question.next.level}/${question.next.slug}`}
                className="group relative overflow-hidden bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1 text-right"
              >
                <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-blue-500 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="flex items-center justify-end gap-4">
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Next Up</div>
                    <div className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors line-clamp-2">
                      {question.next.title}
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    <ArrowRight size={20} />
                  </div>
                </div>
              </Link>
            )}
          </div>

          <RelatedQuestions questions={question.related} />

          <div className="mt-16">
            <AdSense slot="1122334455" />
          </div>
         
        </div>
      </div>
    </div>
  );
}
