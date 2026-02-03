'use client';

import { useEffect, useState, useCallback } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import { Plus, Trash2, Edit, Search, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import Loader from '@/components/Loader';

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [level, setLevel] = useState('');
  
  // Pagination states
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories?limit=100');
      setCategories(res.data.data || []);
    } catch (err) {
    }
  };

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      
      if (search) params.append('search', search);
      if (category) params.append('category', category);
      if (level) params.append('level', level);

      const res = await api.get(`/questions?${params.toString()}`);
      setQuestions(res.data.data);
      setTotal(res.data.meta.total);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, category, level]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      await api.delete(`/questions/${id}`);
      fetchQuestions();
    } catch (err) {
      alert('Failed to delete question');
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Questions</h1>
        <Link
          href="/admin/questions/new"
          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus size={18} /> New Question
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search questions..."
              className="w-full pl-10 pr-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 bg-white border-gray-300"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1); // Reset to first page on search
              }}
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <select
              className="w-full pl-10 pr-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white text-slate-900 border-gray-300"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <select
              className="w-full pl-10 pr-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white text-slate-900 border-gray-300"
              value={level}
              onChange={(e) => {
                setLevel(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
             <span className="text-sm text-gray-500 whitespace-nowrap">Show:</span>
             <select
              className="w-full px-2 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-900 border-gray-300"
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded shadow overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-4 text-slate-700 font-semibold">Title</th>
              <th className="text-left p-4 text-slate-700 font-semibold">Category</th>
              <th className="text-left p-4 text-slate-700 font-semibold">Level</th>
              <th className="text-right p-4 text-slate-700 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="p-8 text-center">
                  <Loader />
                </td>
              </tr>
            ) : questions.length > 0 ? (
              questions.map((q) => (
                <tr key={q.id} className="border-t hover:bg-gray-50">
                  <td className="p-4 font-medium text-slate-900">{q.title}</td>
                  <td className="p-4">
                    <span className="bg-gray-100 px-2 py-1 rounded text-sm text-slate-700">
                      {q.category?.name}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded text-sm capitalize ${
                        q.level === 'beginner'
                          ? 'bg-green-100 text-green-800'
                          : q.level === 'intermediate'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {q.level}
                    </span>
                  </td>
                  <td className="p-4 text-right flex justify-end gap-2">
                    <Link
                      href={`/admin/questions/${q.id}/edit`}
                      className="text-blue-500 hover:text-blue-700 p-1 rounded hover:bg-blue-50 transition-colors"
                      title="Edit"
                    >
                      <Edit size={18} />
                    </Link>
                    <button
                      onClick={() => handleDelete(q.id)}
                      className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-500">
                  No questions found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>

        {/* Pagination */}
        {!loading && total > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-t bg-gray-50 gap-4">
            <div className="text-sm text-slate-600">
              Showing <span className="font-medium">{Math.min((page - 1) * limit + 1, total)}</span> to{' '}
              <span className="font-medium">{Math.min(page * limit, total)}</span> of{' '}
              <span className="font-medium">{total}</span> results
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 border rounded hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  // Logic to show pages around current page could be more complex, 
                  // but for now simple sliding window or just first few is ok.
                  // Let's do a simple version: if totalPages <= 7 show all, else show current window.
                  // For simplicity in this iteration, just showing current page and total.
                  // Actually, let's implement a simple page number list.
                  
                  let pNum = i + 1;
                  if (totalPages > 5) {
                      if (page > 3) {
                          pNum = page - 2 + i;
                      }
                      if (pNum > totalPages) return null;
                  }
                  
                  return (
                     <button
                        key={pNum}
                        onClick={() => setPage(pNum)}
                        className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
                          page === pNum
                            ? 'bg-blue-600 text-white'
                            : 'hover:bg-white text-slate-600'
                        }`}
                      >
                        {pNum}
                      </button>
                  );
                }).filter(Boolean)}
              </div>

              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 border rounded hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
