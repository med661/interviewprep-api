'use client';

import { useEffect, useState, useRef } from 'react';
import api from '@/lib/api';
import { Plus, Pencil, Trash2, Search, ArrowUpDown, Upload, X, ChevronLeft, ChevronRight, Globe, GripVertical } from 'lucide-react';

interface Partner {
  id: string;
  name: string;
  logo_url: string;
  website_url?: string;
  is_active: boolean;
  order: number;
}

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Filter & Pagination States
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, last_page: 1, page: 1 });
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const [formData, setFormData] = useState<Partial<Partner>>({
    name: '',
    logo_url: '',
    website_url: '',
    is_active: true,
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to page 1 on new search
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetchPartners();
  }, [page, debouncedSearch, sortOrder]);

  const fetchPartners = async () => {
    setLoading(true);
    try {
      const res = await api.get('/partners/admin', {
        params: {
          page,
          limit: 10,
          search: debouncedSearch,
          sort: sortOrder
        }
      });
      setPartners(res.data.data);
      setMeta(res.data.meta);
    } catch (error) {
      console.error('Failed to fetch partners');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.patch(`/partners/${editingId}`, formData);
      } else {
        await api.post('/partners', formData);
      }
      setIsModalOpen(false);
      fetchPartners();
      resetForm();
    } catch (error) {
      console.error('Failed to save partner');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      await api.delete(`/partners/${id}`);
      fetchPartners();
    } catch (error) {
      console.error('Failed to delete partner');
    }
  };

  const handleEdit = (partner: Partner) => {
    setEditingId(partner.id);
    setFormData(partner);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: '',
      logo_url: '',
      website_url: '',
      is_active: true,
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, logo_url: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, logo_url: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const toggleSort = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Partners & Sponsors</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage partner logos displayed on the home page</p>
        </div>
        <button
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors self-start sm:self-auto"
        >
          <Plus size={20} />
          Add Partner
        </button>
      </div>

      {/* Filters & Search Bar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <input
            type="text"
            placeholder="Search partners..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
          />
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
        </div>

        <button
          onClick={toggleSort}
          className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-2 text-sm font-medium w-full sm:w-auto justify-center"
        >
          <ArrowUpDown className="w-4 h-4" />
          {sortOrder === 'asc' ? 'Order: Ascending' : 'Order: Descending'}
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        {loading ? (
           <div className="p-8 text-center text-slate-500">Loading partners...</div>
        ) : partners.length === 0 ? (
          <div className="p-8 text-center">
            <h3 className="text-lg font-medium text-slate-900 dark:text-white">No partners found</h3>
            <p className="text-slate-500">Try adding a new partner.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                  <th className="p-4 font-medium text-slate-500 dark:text-slate-400 w-16">Logo</th>
                  <th className="p-4 font-medium text-slate-500 dark:text-slate-400">Name</th>
                  <th className="p-4 font-medium text-slate-500 dark:text-slate-400">Website</th>
                  <th className="p-4 font-medium text-slate-500 dark:text-slate-400 w-24">Status</th>
                  <th className="p-4 font-medium text-slate-500 dark:text-slate-400 w-24 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {partners.map((partner) => (
                  <tr key={partner.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4">
                      <div className="w-12 h-12 bg-white rounded-lg border border-slate-200 dark:border-slate-700 p-1 flex items-center justify-center">
                        {partner.logo_url ? (
                          <img src={partner.logo_url} alt={partner.name} className="max-w-full max-h-full object-contain" />
                        ) : (
                          <span className="text-xs font-bold text-slate-400">NO LOGO</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 font-medium text-slate-900 dark:text-white">{partner.name}</td>
                    <td className="p-4 text-slate-500 text-sm">
                      {partner.website_url ? (
                        <a href={partner.website_url} target="_blank" className="flex items-center gap-1.5 hover:text-blue-600 transition-colors">
                          <Globe size={14} />
                          <span className="truncate max-w-[200px]">{partner.website_url}</span>
                        </a>
                      ) : '-'}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${partner.is_active ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>
                        {partner.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEdit(partner)} className="p-2 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg">
                          <Pencil size={16} />
                        </button>
                        <button onClick={() => handleDelete(partner.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <h2 className="text-xl font-bold dark:text-white">{editingId ? 'Edit Partner' : 'Add New Partner'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-slate-700">✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-slate-300">Partner Name</label>
                <input 
                    required
                    className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 dark:text-slate-300">Logo Image</label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-16 bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden flex items-center justify-center relative group">
                    {formData.logo_url ? (
                      <>
                        <img src={formData.logo_url} alt="Preview" className="max-w-full max-h-full object-contain p-1" />
                        <button 
                          type="button"
                          onClick={removeImage}
                          className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
                        >
                          <X size={20} />
                        </button>
                      </>
                    ) : (
                      <Upload size={24} className="text-slate-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="block w-full text-sm text-slate-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100
                        dark:file:bg-blue-900/30 dark:file:text-blue-300
                      "
                    />
                    <p className="mt-1 text-xs text-slate-500">Transparent PNG/SVG recommended</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 dark:text-slate-300">Website URL</label>
                <input 
                    className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700"
                    placeholder="https://..."
                    value={formData.website_url || ''}
                    onChange={e => setFormData({...formData, website_url: e.target.value})}
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input 
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={e => setFormData({...formData, is_active: e.target.checked})}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="is_active" className="text-sm font-medium dark:text-slate-300">Active / Visible</label>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save Partner</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
