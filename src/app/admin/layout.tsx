'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, X, LayoutDashboard, FolderTree, FileQuestion, AlertTriangle, LogOut, Users, Database, Activity, Mail, HeartHandshake, Briefcase } from 'lucide-react';
import ScrollToTop from '@/components/ScrollToTop';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token && pathname !== '/admin/login') {
      router.push('/admin/login');
    } else if (token) {
      // Decode token to check role (simple client-side check)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.role !== 'admin') {
          // If user is not admin, redirect to home or show unauthorized
          router.push('/'); 
        } else {
          setAuthorized(true);
        }
      } catch (e) {
        localStorage.removeItem('token');
        router.push('/admin/login');
      }
    } else {
      setAuthorized(true); // Allow login page
    }
  }, [pathname, router]);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (!authorized) {
    return null;
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-gray-900 text-white flex items-center justify-between px-4 z-50">
        <h2 className="text-xl font-bold">Admin Panel</h2>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2">
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed top-0 left-0 bottom-0 w-64 bg-gray-900 text-white p-6 z-50 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <h2 className="text-2xl font-bold mb-10 hidden lg:block">Admin Panel</h2>
        
        {/* Mobile Header Spacer */}
        <div className="h-16 lg:hidden mb-4"></div>

        <nav className="space-y-2">
          <NavLink href="/admin/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" active={pathname === '/admin/dashboard'} />
          <NavLink href="/admin/users" icon={<Users size={20} />} label="Users" active={pathname.startsWith('/admin/users')} />
          <NavLink href="/admin/active-users" icon={<Activity size={20} />} label="Active Sessions" active={pathname.startsWith('/admin/active-users')} />
          <NavLink href="/admin/categories" icon={<FolderTree size={20} />} label="Categories" active={pathname.startsWith('/admin/categories')} />
          <NavLink href="/admin/questions" icon={<FileQuestion size={20} />} label="Questions" active={pathname.startsWith('/admin/questions')} />
          <NavLink href="/admin/contributors" icon={<HeartHandshake size={20} />} label="Contributors" active={pathname.startsWith('/admin/contributors')} />
          <NavLink href="/admin/partners" icon={<Briefcase size={20} />} label="Partners" active={pathname.startsWith('/admin/partners')} />
          <NavLink href="/admin/messages" icon={<Mail size={20} />} label="Messages" active={pathname.startsWith('/admin/messages')} />
          <NavLink href="/admin/reports" icon={<AlertTriangle size={20} />} label="Reports" active={pathname.startsWith('/admin/reports')} />
          <NavLink href="/admin/redis" icon={<Database size={20} />} label="Redis Cache" active={pathname.startsWith('/admin/redis')} />

          <button
            onClick={() => {
              localStorage.removeItem('token');
              router.push('/admin/login');
            }}
            className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-gray-800 hover:text-red-300 rounded-lg w-full text-left mt-8 transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main id="admin-main-content" className="flex-1 p-4 lg:p-8 pt-20 lg:pt-8 overflow-auto w-full">
        {children}
      </main>
      <ScrollToTop containerId="admin-main-content" />
    </div>
  );
}

function NavLink({ href, icon, label, active }: { href: string; icon: React.ReactNode; label: string; active: boolean }) {
  return (
    <Link 
      href={href} 
      className={`
        flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
        ${active ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}
      `}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </Link>
  );
}
