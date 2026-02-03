'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { RefreshCw, Trash2, Search, Database, Clock, FileJson } from 'lucide-react';
import Loader from '@/components/Loader';

interface RedisKey {
  key: string;
}

interface KeyDetail {
  key: string;
  type: string;
  value: any;
  ttl: number;
}

export default function RedisAdminPage() {
  const [keys, setKeys] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [pattern, setPattern] = useState('*');
  const [selectedKey, setSelectedKey] = useState<KeyDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchKeys = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/redis/keys', {
        params: { pattern: pattern || '*' }
      });
      setKeys(res.data.keys.sort());
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKeys();
  }, []);

  const handleKeyClick = async (key: string) => {
    setDetailLoading(true);
    setSelectedKey(null);
    try {
      const res = await api.get(`/admin/redis/value/${encodeURIComponent(key)}`);
      setSelectedKey(res.data);
    } catch (err) {
    } finally {
      setDetailLoading(false);
    }
  };

  const handleDelete = async (key: string) => {
    if (!confirm(`Are you sure you want to delete key: ${key}?`)) return;
    try {
      await api.delete(`/admin/redis/${encodeURIComponent(key)}`);
      setKeys(keys.filter(k => k !== key));
      if (selectedKey?.key === key) setSelectedKey(null);
    } catch (err) {
      alert('Failed to delete key');
    }
  };

  const formatValue = (value: any) => {
    if (typeof value === 'object') {
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Redis Data Explorer</h1>
        <button 
          onClick={fetchKeys} 
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw size={16} />
          Refresh Keys
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Keys List */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[calc(100vh-12rem)]">
          <div className="p-4 border-b border-slate-200 bg-slate-50">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search pattern (e.g. user:*)"
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchKeys()}
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {loading ? (
              <div className="flex justify-center p-8">
                <RefreshCw className="animate-spin text-slate-400" />
              </div>
            ) : keys.length === 0 ? (
              <div className="text-center text-slate-500 p-8 text-sm">
                No keys found
              </div>
            ) : (
              keys.map(key => (
                <div 
                  key={key}
                  onClick={() => handleKeyClick(key)}
                  className={`
                    p-3 rounded-lg cursor-pointer text-sm font-mono break-all hover:bg-slate-100 transition-colors flex items-center justify-between group
                    ${selectedKey?.key === key ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'text-slate-700'}
                  `}
                >
                  <span>{key}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(key); }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-600 transition-opacity"
                    title="Delete Key"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
          <div className="p-2 border-t border-slate-200 text-xs text-slate-500 text-center bg-slate-50">
            {keys.length} keys found
          </div>
        </div>

        {/* Right Column: Value Detail */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-[calc(100vh-12rem)] flex flex-col">
          {detailLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader size="lg" />
            </div>
          ) : selectedKey ? (
            <div className="flex flex-col h-full">
              <div className="p-6 border-b border-slate-200 bg-slate-50">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <h2 className="text-lg font-bold font-mono text-slate-900 break-all">
                    {selectedKey.key}
                  </h2>
                  <button
                    onClick={() => handleDelete(selectedKey.key)}
                    className="flex items-center gap-2 px-3 py-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors shrink-0"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
                
                <div className="flex gap-4 text-sm">
                  <div className="flex items-center gap-2 px-3 py-1 bg-white rounded border border-slate-200 text-slate-600">
                    <Database size={14} />
                    <span className="uppercase font-bold text-xs">{selectedKey.type}</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-white rounded border border-slate-200 text-slate-600">
                    <Clock size={14} />
                    <span className="font-mono">{selectedKey.ttl === -1 ? 'No Expiry' : `${selectedKey.ttl}s`}</span>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-auto p-0 relative">
                 <div className="absolute top-4 right-4 z-10">
                    <div className="flex items-center gap-2 px-2 py-1 bg-slate-100 rounded text-xs text-slate-500">
                        <FileJson size={12} />
                        {typeof selectedKey.value === 'object' ? 'JSON/Structure' : 'String'}
                    </div>
                 </div>
                <pre className="p-6 text-sm font-mono text-slate-800 whitespace-pre-wrap h-full overflow-auto">
                  {formatValue(selectedKey.value)}
                </pre>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8">
              <Database className="w-16 h-16 mb-4 opacity-20" />
              <p>Select a key to view its value</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
