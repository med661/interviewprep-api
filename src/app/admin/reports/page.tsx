'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Check, X, AlertTriangle, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import Loader from '@/components/Loader';

export default function AdminReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, last_page: 1 });

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await api.get('/reports', {
        params: {
          page,
          status: status === 'all' ? undefined : status,
          limit: 10,
        },
      });
      
      const reportsData = res.data.data || (Array.isArray(res.data) ? res.data : []);
      const metaData = res.data.meta || { total: reportsData.length, last_page: 1 };

      setReports(reportsData);
      setMeta({
        total: metaData.total,
        last_page: metaData.totalPages || metaData.last_page || 1,
      });
    } catch (err) {
      setReports([]); // Fallback to empty array
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [page, status]);

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.patch(`/reports/${id}`, { status });
      fetchReports(); // Refresh list
    } catch (err) {
      alert('Failed to update status');
    }
  };

  if (loading) {
    return <Loader className="py-20" />;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Issue Reports</h1>
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 bg-white"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="resolved">Resolved</option>
          <option value="ignored">Ignored</option>
        </select>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Question</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reported By</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {reports.map((report) => (
              <tr key={report.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs font-bold rounded-full uppercase ${
                      report.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : report.status === 'resolved'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {report.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-slate-900 truncate max-w-[200px]">
                      {report.question.title}
                    </span>
                    <Link
                      href={`/admin/questions/${report.question.slug}/edit`}
                      className="text-blue-600 hover:text-blue-800"
                      target="_blank"
                    >
                      <ExternalLink size={14} />
                    </Link>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">{report.email}</td>
                <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate" title={report.reason}>
                  {report.reason}
                </td>
                <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">
                  {new Date(report.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right whitespace-nowrap space-x-2">
                  {report.status === 'pending' && (
                    <>
                      <button
                        onClick={() => updateStatus(report.id, 'resolved')}
                        className="text-green-600 hover:text-green-900 bg-green-50 p-1.5 rounded"
                        title="Mark as Resolved"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={() => updateStatus(report.id, 'ignored')}
                        className="text-gray-400 hover:text-gray-600 bg-gray-50 p-1.5 rounded"
                        title="Ignore"
                      >
                        <X size={16} />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {reports.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  No reports found. Good job!
                </td>
              </tr>
            )}
          </tbody>
        </table>
        
        {meta.last_page > 1 && (
          <div className="px-6 py-4 bg-gray-50 border-t flex items-center justify-between">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 border rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-gray-700">
              Page {page} of {meta.last_page}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))}
              disabled={page === meta.last_page}
              className="px-4 py-2 border rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}