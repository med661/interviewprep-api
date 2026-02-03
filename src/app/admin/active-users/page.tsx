'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Activity, Clock, User, Shield } from 'lucide-react';
import Loader from '@/components/Loader';

interface ActiveUser {
  id: string;
  email: string;
  role: string;
  loginAt: string;
}

export default function ActiveUsersPage() {
  const [users, setUsers] = useState<ActiveUser[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/admin/login');
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/admin/active-users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        localStorage.removeItem('token');
        router.push('/admin/login');
        return;
      }

      if (!res.ok) {
        throw new Error(`API Error: ${res.statusText}`);
      }

      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      setUsers([]); // Ensure it's always an array on error
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getTimeAgo = (dateString: string) => {
    const diff = new Date().getTime() - new Date(dateString).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Active Sessions</h1>
          <p className="text-gray-500 mt-1">Currently authenticated users (Last 7 days)</p>
        </div>
        <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full flex items-center gap-2 font-medium">
          <Activity size={18} />
          {users.length} Active
        </div>
      </div>

      {loading ? (
        <Loader className="py-12" />
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 font-semibold text-gray-700">User</th>
                  <th className="px-6 py-4 font-semibold text-gray-700">Role</th>
                  <th className="px-6 py-4 font-semibold text-gray-700">Login Time</th>
                  <th className="px-6 py-4 font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                      No active sessions found
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={`${user.role}-${user.id}`} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                            <User size={20} />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{user.email}</div>
                            <div className="text-xs text-gray-500 font-mono">ID: {user.id.substring(0, 8)}...</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                          user.role === 'admin' 
                            ? 'bg-purple-100 text-purple-700 border-purple-200' 
                            : 'bg-gray-100 text-gray-700 border-gray-200'
                        }`}>
                          <Shield size={12} />
                          {user.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock size={16} />
                          <span title={formatDate(user.loginAt)}>
                            {getTimeAgo(user.loginAt)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                          Online
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
