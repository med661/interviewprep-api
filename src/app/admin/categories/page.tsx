'use client';

import { useEffect, useState, useCallback } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import { Trash2, Pencil, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import Loader from '@/components/Loader';

interface Category {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  _count?: {
    questions: number;
  };
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form states
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);

  // Filter & Pagination states
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (search) params.append('search', search);

      const res = await api.get(`/categories?${params.toString()}`);
      
      // Handle both formats if API changes
      if (res.data.data) {
        setCategories(res.data.data);
        setTotal(res.data.meta.total);
      } else {
        // Fallback for flat array if backend response structure varies
        setCategories(Array.isArray(res.data) ? res.data : []);
        setTotal(Array.isArray(res.data) ? res.data.length : 0);
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  }, [page, limit, search]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('slug', slug);
      if (logoFile) {
        formData.append('file', logoFile);
      }

      await api.post('/categories', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setName('');
      setSlug('');
      setLogoFile(null);
      fetchCategories();
    } catch (err) {
      alert('Failed to create category');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
    } catch (err) {
      alert('Failed to delete category');
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-slate-900">Categories</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Form - Takes up 1/3 on large screens */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded shadow sticky top-6">
            <h2 className="text-lg font-semibold mb-4 text-slate-900">Add Category</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm text-slate-700 mb-1">Name</label>
                <input
                  className="border p-2 rounded w-full text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setSlug(e.target.value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, ''));
                  }}
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-1">Slug</label>
                <input
                  className="border p-2 rounded w-full text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-1">Logo File</label>
                <input
                  type="file"
                  accept="image/*"
                  className="border p-2 rounded w-full text-slate-900 bg-white"
                  onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                />
              </div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-2 transition-colors">
                Add Category
              </button>
            </form>
          </div>
        </div>

        {/* List & Filters - Takes up 2/3 on large screens */}
        <div className="lg:col-span-2">
          {/* Filters */}
          <div className="bg-white p-4 rounded shadow mb-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div className="relative w-full sm:w-auto flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search categories..."
                  className="w-full pl-10 pr-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 bg-white border-gray-300"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                />
              </div>
              
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-sm text-gray-500 whitespace-nowrap">Show:</span>
                <select
                  className="w-full sm:w-auto px-2 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-900 border-gray-300"
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
                    <th className="text-left p-4 text-slate-700 font-semibold">Name</th>
                    <th className="text-left p-4 text-slate-700 font-semibold">Slug</th>
                    <th className="text-left p-4 text-slate-700 font-semibold">Logo</th>
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
                  ) : categories.length > 0 ? (
                    categories.map((cat) => (
                      <tr key={cat.id} className="border-t hover:bg-gray-50">
                        <td className="p-4 text-slate-900">
                          <Link href={`/admin/categories/${cat.id}`} className="hover:text-blue-600 hover:underline font-medium">
                            {cat.name}
                          </Link>
                          {cat._count && (
                            <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                              {cat._count.questions} Qs
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-slate-600">{cat.slug}</td>
                        <td className="p-4 text-slate-600">
                          {cat.logo_url && (
                            <img src={cat.logo_url} alt={cat.name} className="w-8 h-8 object-contain" />
                          )}
                        </td>
                        <td className="p-4 text-right flex justify-end gap-2">
                          <Link
                            href={`/admin/categories/${cat.id}`}
                            className="text-blue-500 hover:text-blue-700 p-1 rounded hover:bg-blue-50 transition-colors"
                            title="Edit"
                          >
                            <Pencil size={18} />
                          </Link>
                          <button
                            onClick={() => handleDelete(cat.id)}
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
                        No categories found.
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
      </div>
    </div>
  );
}
