'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { LayoutDashboard, FileQuestion, MessageSquare, AlertTriangle, Users } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Loader from '@/components/Loader';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [savedStats, setSavedStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, savedRes] = await Promise.all([
          api.get('/dashboard/stats'),
          api.get('/dashboard/saved-by-category')
        ]);
        setStats(statsRes.data);
        setSavedStats(savedRes.data);
      } catch (err) {
        // Error handled globally or ignored
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <Loader className="py-20" />;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8 text-slate-900">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Questions"
          value={stats.questions}
          icon={<FileQuestion className="text-blue-500" size={24} />}
        />
        <StatCard
          title="Categories"
          value={stats.categories}
          icon={<LayoutDashboard className="text-indigo-500" size={24} />}
        />
        <StatCard
          title="Total Reports"
          value={stats.reports.total}
          icon={<AlertTriangle className="text-orange-500" size={24} />}
        />
        <StatCard
          title="Pending Reports"
          value={stats.reports.pending}
          icon={<MessageSquare className="text-yellow-500" size={24} />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Saved Questions Chart */}
        <div className="bg-white p-6 rounded-lg shadow lg:col-span-2">
          <h3 className="text-lg font-bold mb-4 text-slate-900">Most Saved Questions by Category</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={savedStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="savedCount" fill="#4f46e5" name="Saved Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Reports Breakdown */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-bold mb-4 text-slate-900">Reports Status</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-slate-600 font-medium">Pending</span>
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-bold">
                {stats.reports.pending}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-slate-600 font-medium">Resolved</span>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">
                {stats.reports.resolved}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-slate-600 font-medium">Ignored</span>
              <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-bold">
                {stats.reports.ignored}
              </span>
            </div>
          </div>
        </div>

        {/* Top Reporters */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center gap-2 mb-4">
            <Users className="text-slate-400" size={20} />
            <h3 className="text-lg font-bold text-slate-900">Top Reporters</h3>
          </div>
          <div className="overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3 text-sm font-medium text-slate-500">Email</th>
                  <th className="pb-3 text-sm font-medium text-slate-500 text-right">Reports</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {stats.topReporters.map((reporter: any, index: number) => (
                  <tr key={index}>
                    <td className="py-3 text-sm text-slate-700">{reporter.email}</td>
                    <td className="py-3 text-sm text-slate-900 font-bold text-right">{reporter.count}</td>
                  </tr>
                ))}
                {stats.topReporters.length === 0 && (
                  <tr>
                    <td colSpan={2} className="py-4 text-center text-slate-500 text-sm">
                      No reporters yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-slate-900">{value}</h3>
      </div>
      <div className="p-3 bg-gray-50 rounded-full">{icon}</div>
    </div>
  );
}