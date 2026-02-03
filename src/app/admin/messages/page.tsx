'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Mail, CheckCircle, Clock, Trash2, Search, Filter, Star, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';
import { format } from 'date-fns';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  is_starred: boolean;
  created_at: string;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read' | 'starred'>('all');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, last_page: 1, page: 1 });
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to page 1 on new search
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetchMessages();
  }, [page, filter, subjectFilter, debouncedSearch, sortOrder]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await api.get('/contact', {
        params: {
          page,
          limit: 10,
          status: filter,
          subject: subjectFilter,
          search: debouncedSearch,
          sort: sortOrder
        }
      });
      setMessages(res.data.data);
      setMeta(res.data.meta);
    } catch (error) {
      console.error('Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await api.patch(`/contact/${id}/read`);
      setMessages(messages.map(m => m.id === id ? { ...m, status: 'read' } : m));
    } catch (error) {
      console.error('Failed to update message');
    }
  };

  const toggleReadStatus = async (id: string, currentStatus: string) => {
    try {
      await api.patch(`/contact/${id}/toggle-read`);
      const newStatus = currentStatus === 'unread' ? 'read' : 'unread';
      setMessages(messages.map(m => m.id === id ? { ...m, status: newStatus as any } : m));
    } catch (error) {
      console.error('Failed to update message status');
    }
  };

  const toggleStar = async (id: string) => {
    try {
      await api.patch(`/contact/${id}/star`);
      setMessages(messages.map(m => m.id === id ? { ...m, is_starred: !m.is_starred } : m));
    } catch (error) {
      console.error('Failed to star message');
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    try {
      await api.delete(`/contact/${id}`);
      setMessages(messages.filter(m => m.id !== id));
      // Refresh if empty to keep pagination correct
      if (messages.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        fetchMessages();
      }
    } catch (error) {
      console.error('Failed to delete message');
    }
  };

  const toggleSort = () => {
    setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Messages</h1>
          <p className="text-slate-500 dark:text-slate-400">View and manage contact form submissions</p>
        </div>
      </div>

      {/* Filters & Search Bar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          
          {/* Status Tabs */}
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900/50 p-1 rounded-lg border border-slate-200 dark:border-slate-700 overflow-x-auto w-full lg:w-auto">
            <button
              onClick={() => { setFilter('all'); setPage(1); }}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                filter === 'all' 
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => { setFilter('unread'); setPage(1); }}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                filter === 'unread' 
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-blue-600'
              }`}
            >
              Unread
            </button>
            <button
              onClick={() => { setFilter('starred'); setPage(1); }}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${
                filter === 'starred' 
                  ? 'bg-white dark:bg-slate-800 text-yellow-600 dark:text-yellow-400 shadow-sm' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-yellow-600'
              }`}
            >
              <Star className="w-4 h-4" fill={filter === 'starred' ? 'currentColor' : 'none'} />
              Starred
            </button>
          </div>

          {/* Search & Subject Filter */}
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search messages..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            </div>

            <select
              value={subjectFilter}
              onChange={(e) => { setSubjectFilter(e.target.value); setPage(1); }}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm min-w-[140px]"
            >
              <option value="all">All Subjects</option>
              <option value="General Inquiry">General Inquiry</option>
              <option value="Support">Support</option>
              <option value="Feedback">Feedback</option>
              <option value="Business">Business</option>
            </select>

            <button
              onClick={toggleSort}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-2 text-sm font-medium min-w-[140px] justify-center"
            >
              <ArrowUpDown className="w-4 h-4" />
              {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {loading ? (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-500">Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
            <Mail className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white">No messages found</h3>
            <p className="text-slate-500">Try adjusting your filters or search.</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`group bg-white dark:bg-slate-800 p-6 rounded-2xl border transition-all hover:shadow-md ${
                msg.status === 'unread' 
                  ? 'border-blue-200 dark:border-blue-900/50 shadow-sm ring-1 ring-blue-500/10' 
                  : 'border-slate-200 dark:border-slate-700 opacity-90'
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => toggleStar(msg.id)}
                    className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
                  >
                    <Star 
                        className={`w-5 h-5 ${msg.is_starred ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300 dark:text-slate-600'}`} 
                    />
                  </button>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${
                    msg.status === 'unread' 
                      ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' 
                      : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'
                  }`}>
                    {msg.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        {msg.subject}
                        {msg.status === 'unread' && <span className="w-2 h-2 rounded-full bg-blue-500"></span>}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      From: <span className="font-medium text-slate-700 dark:text-slate-300">{msg.name}</span> ({msg.email})
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full hidden sm:inline-block">
                    {format(new Date(msg.created_at), 'MMM d, yyyy • h:mm a')}
                  </span>
                  
                  <button 
                    onClick={() => toggleReadStatus(msg.id, msg.status)}
                    className={`p-2 rounded-lg transition-colors ${
                        msg.status === 'unread' 
                        ? 'text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20' 
                        : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                    title={msg.status === 'unread' ? "Mark as Read" : "Mark as Unread"}
                  >
                    <CheckCircle className={`w-5 h-5 ${msg.status === 'read' ? 'fill-current' : ''}`} />
                  </button>

                  <button 
                    onClick={() => deleteMessage(msg.id)}
                    className="p-2 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                    title="Delete Message"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="pl-13 ml-13 border-l-2 border-slate-100 dark:border-slate-700 pl-4">
                <p className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {msg.message}
                </p>
              </div>
            </div>
          ))
        )}

        {/* Pagination Controls */}
        {meta.last_page > 1 && (
          <div className="flex justify-center items-center gap-2 pt-6">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-slate-600 dark:text-slate-400 transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400 px-4">
              Page {page} of {meta.last_page}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))}
              disabled={page === meta.last_page}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-slate-600 dark:text-slate-400 transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
