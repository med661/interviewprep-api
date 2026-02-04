'use client';

import { useEffect, useState, useRef } from 'react';
import api from '@/lib/api';
import { Plus, Pencil, Trash2, Link as LinkIcon, Github, Twitter, Linkedin, Globe, Search, ArrowUpDown, Upload, X, ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import Image from 'next/image';

interface Contributor {
  id: string;
  name: string;
  role: string;
  bio?: string;
  image_url?: string;
  linkedin_url?: string;
  twitter_url?: string;
  github_url?: string;
  website_url?: string;
  is_active: boolean;
  order: number;
}

export default function ContributorsPage() {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Filter & Pagination States
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, last_page: 1, page: 1 });
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const [formData, setFormData] = useState<Partial<Contributor>>({
    name: '',
    role: '',
    bio: '',
    image_url: '',
    linkedin_url: '',
    twitter_url: '',
    github_url: '',
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
    fetchContributors();
  }, [page, debouncedSearch, sortOrder]);

  const fetchContributors = async () => {
    setLoading(true);
    try {
      const res = await api.get('/contributors/admin', {
        params: {
          page,
          limit: 9, // Grid layout fits 3x3 nicely
          search: debouncedSearch,
          sort: sortOrder
        }
      });
      setContributors(res.data.data);
      setMeta(res.data.meta);
    } catch (error) {
      console.error('Failed to fetch contributors');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.patch(`/contributors/${editingId}`, formData);
      } else {
        await api.post('/contributors', formData);
      }
      setIsModalOpen(false);
      fetchContributors();
      resetForm();
    } catch (error) {
      console.error('Failed to save contributor');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      await api.delete(`/contributors/${id}`);
      fetchContributors();
    } catch (error) {
      console.error('Failed to delete contributor');
    }
  };

  const handleGenerateCertificate = async (contributor: Contributor) => {
    try {
      const response = await api.get('/certificates/generate', {
        params: { 
            name: contributor.name, 
            role: contributor.role 
        },
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${contributor.name.replace(/\s+/g, '_')}_Certificate.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to generate certificate', error);
      alert('Failed to generate certificate. Please try again.');
    }
  };

  const handleEdit = (contributor: Contributor) => {
    setEditingId(contributor.id);
    setFormData(contributor);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: '',
      role: '',
      bio: '',
      image_url: '',
      linkedin_url: '',
      twitter_url: '',
      github_url: '',
      website_url: '',
      is_active: true,
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image_url: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image_url: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const toggleSort = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Community Contributors</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage profiles of community helpers and contributors</p>
        </div>
        <button
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors self-start sm:self-auto"
        >
          <Plus size={20} />
          Add Contributor
        </button>
      </div>

      {/* Filters & Search Bar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <input
            type="text"
            placeholder="Search by name, role, or bio..."
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
           Array.from({ length: 6 }).map((_, i) => (
             <div key={i} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 h-64 animate-pulse">
               <div className="flex gap-4 mb-4">
                 <div className="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-full" />
                 <div className="space-y-2 flex-1 pt-2">
                   <div className="h-4 bg-slate-200 dark:bg-slate-700 w-3/4 rounded" />
                   <div className="h-3 bg-slate-200 dark:bg-slate-700 w-1/2 rounded" />
                 </div>
               </div>
               <div className="space-y-2">
                 <div className="h-3 bg-slate-200 dark:bg-slate-700 w-full rounded" />
                 <div className="h-3 bg-slate-200 dark:bg-slate-700 w-5/6 rounded" />
                 <div className="h-3 bg-slate-200 dark:bg-slate-700 w-4/6 rounded" />
               </div>
             </div>
           ))
        ) : contributors.length === 0 ? (
          <div className="col-span-full text-center py-20 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-medium text-slate-900 dark:text-white">No contributors found</h3>
            <p className="text-slate-500">Try adjusting your search query.</p>
          </div>
        ) : (
          contributors.map((contributor) => (
            <div key={contributor.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden group">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden relative border-2 border-slate-200 dark:border-slate-600">
                      {contributor.image_url ? (
                          <img src={contributor.image_url} alt={contributor.name} className="w-full h-full object-cover" />
                      ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold text-xl">
                              {contributor.name.charAt(0)}
                          </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-900 dark:text-white">{contributor.name}</h3>
                      <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">{contributor.role}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleGenerateCertificate(contributor)} 
                      className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                      title="Generate Certificate"
                    >
                      <FileText size={16} />
                    </button>
                    <button onClick={() => handleEdit(contributor)} className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => handleDelete(contributor.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                <p className="text-slate-600 dark:text-slate-300 text-sm line-clamp-3 mb-4 min-h-[60px]">
                  {contributor.bio || "No bio provided."}
                </p>

                <div className="flex items-center gap-3 border-t border-slate-100 dark:border-slate-700 pt-4">
                   {contributor.linkedin_url && <a href={contributor.linkedin_url} target="_blank" className="text-slate-400 hover:text-[#0077b5]"><Linkedin size={18} /></a>}
                   {contributor.twitter_url && <a href={contributor.twitter_url} target="_blank" className="text-slate-400 hover:text-[#1DA1F2]"><Twitter size={18} /></a>}
                   {contributor.github_url && <a href={contributor.github_url} target="_blank" className="text-slate-400 hover:text-[#333] dark:hover:text-white"><Github size={18} /></a>}
                   {contributor.website_url && <a href={contributor.website_url} target="_blank" className="text-slate-400 hover:text-blue-500"><Globe size={18} /></a>}
                </div>
              </div>
            </div>
          ))
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
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <h2 className="text-xl font-bold dark:text-white">{editingId ? 'Edit Contributor' : 'Add New Contributor'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-slate-700">✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1 dark:text-slate-300">Name</label>
                    <input 
                        required
                        className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1 dark:text-slate-300">Role/Title</label>
                    <input 
                        required
                        className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700"
                        value={formData.role}
                        onChange={e => setFormData({...formData, role: e.target.value})}
                    />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 dark:text-slate-300">Profile Image</label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 overflow-hidden flex items-center justify-center relative group">
                    {formData.image_url ? (
                      <>
                        <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
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
                    <p className="mt-1 text-xs text-slate-500">Recommended: Square image, max 1MB</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 dark:text-slate-300">Bio</label>
                <textarea 
                    className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700"
                    rows={3}
                    value={formData.bio || ''}
                    onChange={e => setFormData({...formData, bio: e.target.value})}
                />
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Social Links</h3>
                <div className="grid grid-cols-2 gap-4">
                    <input 
                        className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700 text-sm"
                        placeholder="LinkedIn URL"
                        value={formData.linkedin_url || ''}
                        onChange={e => setFormData({...formData, linkedin_url: e.target.value})}
                    />
                    <input 
                        className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700 text-sm"
                        placeholder="Twitter URL"
                        value={formData.twitter_url || ''}
                        onChange={e => setFormData({...formData, twitter_url: e.target.value})}
                    />
                    <input 
                        className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700 text-sm"
                        placeholder="GitHub URL"
                        value={formData.github_url || ''}
                        onChange={e => setFormData({...formData, github_url: e.target.value})}
                    />
                    <input 
                        className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700 text-sm"
                        placeholder="Website URL"
                        value={formData.website_url || ''}
                        onChange={e => setFormData({...formData, website_url: e.target.value})}
                    />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save Contributor</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
