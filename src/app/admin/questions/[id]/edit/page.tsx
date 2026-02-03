'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import RichTextEditor from '@/components/RichTextEditor';
import { Lock, Unlock, Save, ArrowLeft, ChevronRight, Eye, LayoutTemplate } from 'lucide-react';
import Link from 'next/link';

export default function EditQuestionPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const { id } = use(params);
  const [isLoading, setIsLoading] = useState(true);
  const [isSlugLocked, setIsSlugLocked] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category_id: '',
    level: 'beginner',
    is_featured: false,
    is_published: true,
    order: 0,
    answer_json: {},
    tips_json: {},
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catsRes, questionRes] = await Promise.all([
            api.get('/categories?limit=100'),
            api.get(`/questions/${id}`),
        ]);
        
        const categoriesData = Array.isArray(catsRes.data) ? catsRes.data : catsRes.data.data;
        setCategories(categoriesData);
        const question = questionRes.data;
        
        if (question) {
            setFormData({
                title: question.title,
                slug: question.slug,
                category_id: question.category_id,
                level: question.level,
                is_featured: question.is_featured || false,
                is_published: question.is_published ?? true,
                order: question.order || 0,
                answer_json: question.answer_json,
                tips_json: question.tips_json,
            });
        }
      } catch (err) {
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await api.put(`/questions/${id}`, formData);
      router.push('/admin/questions');
    } catch (err) {
      alert('Failed to update question');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newTitle = e.target.value;
    setFormData(prev => ({
      ...prev,
      title: newTitle,
      // Only auto-update slug if locked
      slug: isSlugLocked 
        ? newTitle.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '')
        : prev.slug
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-slate-400">Loading editor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Sticky Action Bar */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span className="hover:text-slate-800 cursor-pointer">Admin</span>
            <ChevronRight className="w-4 h-4" />
            <span className="hover:text-slate-800 cursor-pointer">Questions</span>
            <ChevronRight className="w-4 h-4" />
            <span className="font-semibold text-slate-900">Edit Question</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">Preview</span>
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save Changes
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-slate-900">
                  Question Title <span className="text-red-500">*</span>
                </label>
                <span className={`text-xs ${formData.title.length > 100 ? 'text-amber-500' : 'text-slate-400'}`}>
                  {formData.title.length} chars
                </span>
              </div>
              <textarea
                className="w-full border-0 bg-slate-50 rounded-lg p-4 text-lg font-medium text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none min-h-[100px]"
                placeholder="e.g. What is the difference between let, const, and var?"
                value={formData.title}
                onChange={handleTitleChange}
                required
              />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-slate-900">Answer Explanation</label>
                <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">Markdown Supported</span>
              </div>
              <div className="prose-editor-wrapper min-h-[400px]">
                <RichTextEditor
                  content={formData.answer_json}
                  onChange={(json) => setFormData({ ...formData, answer_json: json })}
                />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
              <label className="block text-sm font-semibold text-slate-900">Tips / Notes</label>
              <RichTextEditor
                content={formData.tips_json}
                onChange={(json) => setFormData({ ...formData, tips_json: json })}
              />
            </div>
          </div>

          {/* Sidebar Metadata Column */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-6 sticky top-24">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2 pb-4 border-b border-slate-100">
                <LayoutTemplate className="w-4 h-4 text-blue-500" />
                Question Settings
              </h3>

              {/* Slug Management */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-700">URL Slug</label>
                  <button
                    type="button"
                    onClick={() => setIsSlugLocked(!isSlugLocked)}
                    className="text-slate-400 hover:text-blue-600 transition-colors"
                    title={isSlugLocked ? "Unlock to edit" : "Lock to auto-generate"}
                  >
                    {isSlugLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <div className="relative group">
                  <input
                    className={`w-full border rounded-lg px-3 py-2 text-sm text-slate-600 bg-slate-50 transition-colors ${
                      !isSlugLocked ? 'focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20' : 'cursor-not-allowed opacity-70'
                    }`}
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    readOnly={isSlugLocked}
                    required
                  />
                </div>
                <p className="text-[10px] text-slate-400 truncate">
                  /interview/{formData.level}/{formData.slug}
                </p>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Category</label>
                <select
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all bg-white"
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  required
                >
                  <option value="" disabled>Select a category...</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Difficulty */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Difficulty</label>
                <div className="grid grid-cols-3 gap-2">
                  {['beginner', 'intermediate', 'advanced'].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setFormData({ ...formData, level: lvl })}
                      className={`px-2 py-1.5 rounded-md text-xs font-medium capitalize transition-all border ${
                        formData.level === lvl
                          ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Order */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Display Order</label>
                <input
                  type="number"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all bg-white"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                />
              </div>

              {/* Featured Toggle */}
              <div className="pt-4 border-t border-slate-100">
                <label className="flex items-center justify-between cursor-pointer group">
                  <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">Featured Question</span>
                  <div className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={formData.is_featured}
                      onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
