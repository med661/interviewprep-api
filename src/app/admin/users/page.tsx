'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Users, Search } from 'lucide-react';
import Loader from '@/components/Loader';

interface UserStat {
  userId: string;
  email: string;
  joinedAt: string;
  bookmarks: number;
  mastered: number;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/dashboard/users');
      setUsers(res.data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((u) =>
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.userId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold flex items-center gap-3 text-slate-900 dark:text-white">
          <Users className="text-blue-600" />
          Users Activity
        </h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 text-slate-900 bg-white border-gray-300"
          />
        </div>
      </div>

      {loading ? (
        <Loader className="py-20" />
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border dark:border-slate-700 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-slate-900 border-b dark:border-slate-700">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">User Email</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Joined</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300 text-center">Saved Questions</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300 text-center">Mastered Questions</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-slate-700">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    No users found matching your search.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.userId} className="hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                      {user.email}
                      <div className="text-xs text-gray-400 font-mono mt-0.5">{user.userId}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {new Date(user.joinedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-center font-medium text-slate-900 dark:text-white">
                      {user.bookmarks}
                    </td>
                    <td className="px-6 py-4 text-center font-medium text-slate-900 dark:text-white">
                      {user.mastered}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
