'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Save, RefreshCw, Lock, Unlock, ArrowLeft, ChevronRight, Eye, EyeOff, Image as ImageIcon, Upload } from 'lucide-react';
import RichTextReader from '@/components/RichTextReader';

// Sortable Item Component
function SortableItem(props: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: props.id });
  
  const [showAnswer, setShowAnswer] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white border border-slate-200 rounded-md mb-2 shadow-sm overflow-hidden"
    >
      <div className="flex items-center gap-3 p-3">
        <div {...attributes} {...listeners} className="cursor-grab text-slate-400 hover:text-slate-600 touch-none">
          <GripVertical size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-slate-900 truncate">{props.title}</div>
          <div className="text-xs text-slate-500 truncate">/{props.slug}</div>
        </div>
        
        <button 
          type="button"
          onClick={() => setShowAnswer(!showAnswer)}
          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
          title={showAnswer ? "Hide Answer" : "Show Answer"}
        >
          {showAnswer ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>

        <div className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-600 whitespace-nowrap">
          Order: {props.order}
        </div>
      </div>
      
      {showAnswer && (
        <div className="px-10 pb-4 pt-0">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-sm prose prose-sm max-w-none">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Answer Preview</span>
            <RichTextReader content={props.answer} />
          </div>
        </div>
      )}
    </div>
  );
}

export default function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  
  // Category Form State
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    logo_url: '',
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [categorySlug, setCategorySlug] = useState(''); // Stable slug for fetching questions
  const [isSlugLocked, setIsSlugLocked] = useState(true);

  // Question Ordering State
  const [questions, setQuestions] = useState<any[]>([]);
  const [selectedLevel, setSelectedLevel] = useState('beginner');
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  const [savingCategory, setSavingCategory] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Fetch Category Details
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await api.get(`/categories/${id}`);
        setFormData({
          name: res.data.name,
          slug: res.data.slug,
          logo_url: res.data.logo_url || '',
        });
        setCategorySlug(res.data.slug);
      } catch (err) {
        alert('Failed to load category');
        router.push('/admin/categories');
      } finally {
        setLoading(false);
      }
    };
    fetchCategory();
  }, [id, router]);

  // Fetch Questions when Level or Category Slug changes
  useEffect(() => {
    if (!categorySlug) return;

    const fetchQuestions = async () => {
      setLoadingQuestions(true);
      try {
        // Fetch all questions for this category and level (increase limit to ensure we get all for reordering)
        const res = await api.get('/questions', {
          params: {
            category: categorySlug,
            level: selectedLevel,
            limit: 100, // Reasonable limit for manual ordering
          },
        });
        setQuestions(res.data.data || []);
      } catch (err) {
      } finally {
        setLoadingQuestions(false);
      }
    };

    fetchQuestions();
  }, [categorySlug, selectedLevel]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSavingCategory(true);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('slug', formData.slug);
      if (logoFile) {
        data.append('file', logoFile);
      }

      const res = await api.patch(`/categories/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Update stable slug if it changed
      setCategorySlug(res.data.slug);
      // Update logo preview if new logo uploaded
      if (res.data.logo_url) {
          setFormData(prev => ({ ...prev, logo_url: res.data.logo_url }));
          setLogoFile(null); // Clear file input
      }
      alert('Category updated successfully');
    } catch (err) {
      alert('Failed to update category');
    } finally {
        setSavingCategory(false);
    }
  };

  // Drag and Drop Handlers
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setQuestions((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);
        
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleSaveOrder = async () => {
    setSavingOrder(true);
    try {
      // Map questions to { id, order } based on their current index
      const orderUpdates = questions.map((q, index) => ({
        id: q.id,
        order: index + 1, // 1-based ordering
      }));

      await api.post('/questions/reorder', orderUpdates);
      
      // Update local state to reflect new order numbers
      setQuestions(questions.map((q, index) => ({ ...q, order: index + 1 })));
      
      alert('Order saved successfully');
    } catch (err) {
      alert('Failed to save order');
    } finally {
      setSavingOrder(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

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
            <span className="hover:text-slate-800 cursor-pointer">Categories</span>
            <ChevronRight className="w-4 h-4" />
            <span className="font-semibold text-slate-900">Edit Category</span>
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
            onClick={() => handleSubmit()}
            disabled={savingCategory}
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {savingCategory ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Update Category
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Edit Form */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm sticky top-24">
              <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-blue-500" />
                Category Details
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-1 text-slate-700">Name</label>
                  <input
                    className="w-full border px-3 py-2 rounded-lg text-slate-900 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        name: e.target.value,
                        // Only auto-update slug if locked
                        slug: isSlugLocked 
                          ? e.target.value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '')
                          : prev.slug
                      }));
                    }}
                    required
                  />
                </div>
                
                {/* Slug Management */}
                <div className="space-y-1">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-slate-700">Slug</label>
                        <button
                        type="button"
                        onClick={() => setIsSlugLocked(!isSlugLocked)}
                        className="text-slate-400 hover:text-blue-600 transition-colors"
                        title={isSlugLocked ? "Unlock to edit" : "Lock to auto-generate"}
                        >
                        {isSlugLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                        </button>
                    </div>
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

                {/* Enhanced Logo Upload */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700">Logo</label>
                  <div className="relative group cursor-pointer border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-xl p-4 transition-all bg-slate-50 hover:bg-blue-50/50 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                    />
                    
                    {logoFile ? (
                        <div className="flex flex-col items-center">
                             <div className="w-24 h-24 mb-2 relative">
                                <img 
                                    src={URL.createObjectURL(logoFile)} 
                                    alt="Preview" 
                                    className="w-full h-full object-contain" 
                                />
                             </div>
                             <p className="text-sm text-green-600 font-medium truncate max-w-full px-2">{logoFile.name}</p>
                             <p className="text-xs text-slate-400 mt-1">Click to change</p>
                        </div>
                    ) : formData.logo_url ? (
                      <div className="flex flex-col items-center">
                        <div className="w-32 h-32 mb-3 relative group-hover:scale-105 transition-transform bg-white rounded-lg p-2 shadow-sm border border-slate-100">
                          <img src={formData.logo_url} alt="Current Logo" className="w-full h-full object-contain" />
                          <div className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                             <span className="text-white text-xs font-medium bg-black/50 px-2 py-1 rounded">Replace</span>
                          </div>
                        </div>
                        <p className="text-sm text-slate-500 font-medium">Current Logo</p>
                        <p className="text-xs text-slate-400 mt-1">Drag & drop or click to replace</p>
                      </div>
                    ) : (
                      <div className="py-8">
                        <div className="w-12 h-12 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Upload className="w-6 h-6" />
                        </div>
                        <p className="text-sm text-slate-600 font-medium">Upload Category Logo</p>
                        <p className="text-xs text-slate-400 mt-1">SVG, PNG, JPG (max 2MB)</p>
                      </div>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Question Ordering */}
          <div className="lg:col-span-2">
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold text-lg flex items-center gap-2">
                    <RefreshCw className="w-5 h-5 text-blue-500" />
                    Manage Question Order
                </h2>
                <div className="flex bg-white rounded-lg border border-slate-200 p-1 shadow-sm">
                  {['beginner', 'intermediate', 'advanced'].map((level) => (
                    <button
                      key={level}
                      onClick={() => setSelectedLevel(level)}
                      className={`px-4 py-1.5 text-xs font-medium rounded-md capitalize transition-all ${
                        selectedLevel === level
                          ? 'bg-blue-100 text-blue-700 shadow-sm'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {loadingQuestions ? (
                <div className="text-center py-20">
                    <RefreshCw className="w-8 h-8 text-slate-300 animate-spin mx-auto mb-2" />
                    <p className="text-slate-500">Loading questions...</p>
                </div>
              ) : questions.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
                  <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3">
                    <RefreshCw className="w-6 h-6" />
                  </div>
                  <p className="text-slate-900 font-medium">No questions found</p>
                  <p className="text-slate-500 text-sm">There are no {selectedLevel} questions in this category yet.</p>
                </div>
              ) : (
                <div>
                   <div className="flex items-center justify-between mb-2 px-3 text-xs text-slate-500 font-medium uppercase tracking-wider">
                      <span>Drag to Reorder</span>
                      <span>Sequence</span>
                   </div>
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={questions.map(q => q.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {questions.map((question) => (
                        <SortableItem
                          key={question.id}
                          id={question.id}
                          title={question.title}
                          slug={question.slug}
                          order={question.order}
                          answer={question.answer_json}
                        />
                      ))}
                    </SortableContext>
                  </DndContext>

                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={handleSaveOrder}
                      disabled={savingOrder}
                      className="px-6 py-2 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 disabled:opacity-50 flex items-center gap-2 shadow-sm transition-colors"
                    >
                      {savingOrder ? (
                        <>
                          <RefreshCw className="animate-spin" size={16} /> Saving...
                        </>
                      ) : (
                        <>
                          <Save size={16} /> Save New Order
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
