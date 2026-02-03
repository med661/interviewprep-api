'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import RichTextEditor from '@/components/RichTextEditor';
import { 
  Save, 
  ArrowLeft, 
  Eye, 
  Lock, 
  Unlock, 
  ChevronRight,
  Globe,
  FileText,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

export default function NewQuestionPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [slugLocked, setSlugLocked] = useState(true);
  
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
    api.get('/categories?limit=100').then((res) => {
      const categoriesData = Array.isArray(res.data) ? res.data : res.data.data;
      setCategories(categoriesData);
      if (categoriesData.length > 0) {
        setFormData((prev) => ({ ...prev, category_id: categoriesData[0].id }));
      }
    });
  }, []);

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newTitle = e.target.value;
    setFormData(prev => ({
      ...prev,
      title: newTitle,
      slug: slugLocked ? generateSlug(newTitle) : prev.slug
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/questions', formData);
      router.push('/admin/questions');
    } catch (err) {
      alert('Failed to create question');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <form onSubmit={handleSubmit}>
        {/* Sticky Action Bar */}
        <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/admin/questions"
                className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              
              <div className="flex flex-col">
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-0.5">
                  <span>Admin</span>
                  <ChevronRight className="w-3 h-3" />
                  <span>Questions</span>
                  <ChevronRight className="w-3 h-3" />
                  <span className="text-slate-900 font-medium">New Question</span>
                </div>
                <h1 className="text-lg font-bold text-slate-900 leading-none">
                  Create New Question
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Discard
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Create Question
              </button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            
            {/* Main Content Column */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Question Title Section */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-bold text-slate-900">
                    Question Title <span className="text-red-500">*</span>
                  </label>
                  <span className={`text-xs ${formData.title.length > 100 ? 'text-amber-500 font-bold' : 'text-slate-400'}`}>
                    {formData.title.length} chars
                  </span>
                </div>
                <textarea
                  className="w-full text-lg font-medium text-slate-900 placeholder:text-slate-300 border-0 border-b-2 border-slate-100 focus:border-blue-500 focus:ring-0 px-0 py-2 transition-all resize-none bg-transparent"
                  rows={2}
                  placeholder="e.g. Explain the difference between null and undefined in JavaScript..."
                  value={formData.title}
                  onChange={handleTitleChange}
                  required
                />
                <p className="text-xs text-slate-500 flex items-center gap-1.5">
                  <AlertCircle className="w-3 h-3" />
                  Keep titles concise and descriptive.
                </p>
              </div>

              {/* Answer Editor */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-blue-100 text-blue-600 rounded-md">
                      <FileText className="w-4 h-4" />
                    </div>
                    <label className="text-sm font-bold text-slate-900">Comprehensive Answer</label>
                  </div>
                  <span className="text-xs text-slate-500 uppercase font-medium tracking-wider">Rich Text</span>
                </div>
                <div className="p-6">
                  <RichTextEditor
                    content={formData.answer_json}
                    onChange={(json) => setFormData({ ...formData, answer_json: json })}
                  />
                </div>
              </div>

              {/* Tips Editor */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-amber-100 text-amber-600 rounded-md">
                      <Globe className="w-4 h-4" />
                    </div>
                    <label className="text-sm font-bold text-slate-900">Expert Tips & Notes</label>
                  </div>
                  <span className="text-xs text-slate-500 uppercase font-medium tracking-wider">Optional</span>
                </div>
                <div className="p-6">
                  <RichTextEditor
                    content={formData.tips_json}
                    onChange={(json) => setFormData({ ...formData, tips_json: json })}
                  />
                </div>
              </div>
            </div>

            {/* Sidebar Column */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Publishing Status */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                  Publishing
                </h3>
                
                <div className="space-y-4">


                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-sm font-medium text-slate-700">Featured</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={formData.is_featured}
                        onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                        className="sr-only peer" 
                      />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Organization */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-5">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Organization
                </h3>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                  <select
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    required
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Difficulty Level</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['beginner', 'intermediate', 'advanced'].map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setFormData({ ...formData, level: lvl })}
                        className={`px-2 py-2 text-xs font-medium rounded-lg capitalize border transition-all ${
                          formData.level === lvl
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Display Order</label>
                  <div className="relative">
                    <input
                      type="number"
                      className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-500 cursor-not-allowed focus:outline-none"
                      value={formData.order || ''}
                      readOnly
                      placeholder="Auto-assigned"
                    />
                    <div className="absolute right-3 top-2.5">
                      <span className="text-xs text-slate-400 bg-slate-200 px-1.5 py-0.5 rounded">Auto</span>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1.5">
                    Order is automatically set to the next available number.
                  </p>
                </div>
              </div>

              {/* URL Settings */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    URL Slug
                  </h3>
                  <button
                    type="button"
                    onClick={() => setSlugLocked(!slugLocked)}
                    className={`p-1.5 rounded-md transition-colors ${
                      slugLocked ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-500'
                    }`}
                    title={slugLocked ? "Slug is auto-generated" : "Slug is manually editable"}
                  >
                    {slugLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                  </button>
                </div>

                <div className="relative">
                  <input
                    className={`w-full pl-3 pr-3 py-2 text-sm border rounded-lg outline-none transition-all font-mono ${
                      slugLocked 
                        ? 'bg-slate-50 text-slate-500 border-slate-200 cursor-not-allowed' 
                        : 'bg-white text-slate-900 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                    }`}
                    value={formData.slug}
                    readOnly={slugLocked}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    required
                  />
                  <div className="mt-2 text-[10px] text-slate-400 truncate">
                    Preview: /interview/{categories.find(c => c.id === formData.category_id)?.slug || 'category'}/{formData.level}/{formData.slug || 'slug'}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
