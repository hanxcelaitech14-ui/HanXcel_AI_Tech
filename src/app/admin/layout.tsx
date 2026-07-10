'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, usePathname } from 'next/navigation';
import type { User } from '@supabase/supabase-js';

const navGroups = [
  {
    label: 'Content',
    items: [
      { icon: '📝', label: 'Blog Posts', href: '/admin/blog' },
      { icon: '💼', label: 'Portfolio', href: '/admin/portfolio' },
      { icon: '🔧', label: 'Services', href: '/admin/services' },
      { icon: '🏭', label: 'Solutions', href: '/admin/solutions' },
      { icon: '📦', label: 'Products', href: '/admin/products' },
    ],
  },
  {
    label: 'People',
    items: [
      { icon: '👥', label: 'Team', href: '/admin/team' },
      { icon: '🏆', label: 'Milestones', href: '/admin/milestones' },
      { icon: '⭐', label: 'Testimonials', href: '/admin/testimonials' },
      { icon: '❓', label: 'FAQs', href: '/admin/faq' },
    ],
  },
  {
    label: 'Communication',
    items: [
      { icon: '📩', label: 'Inquiries', href: '/admin/inquiries' },
      { icon: '✉️', label: 'Messages', href: '/admin/messages' },
      { icon: '🤖', label: 'Chatbot & Logs', href: '/admin/chatbot' },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminTheme, setAdminTheme] = useState<'dark' | 'light'>('dark');
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user && pathname !== '/admin/login') {
        router.push('/admin/login');
      } else {
        setUser(data.user);
      }
      setLoading(false);
    });
  }, [pathname, router]);

  useEffect(() => {
    const saved = localStorage.getItem('hanxcel-admin-theme') as 'dark' | 'light' | null;
    if (saved) {
      setAdminTheme(saved);
      document.documentElement.setAttribute('data-theme', saved);
    }
  }, []);

  const toggleAdminTheme = () => {
    const next = adminTheme === 'dark' ? 'light' : 'dark';
    setAdminTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('hanxcel-admin-theme', next);
    localStorage.setItem('hanxcel-theme', next);
  };

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="admin-loading-screen">
        <div className="admin-loading-spinner" />
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (!user) return null;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  return (
    <div className="admin-layout">
      {sidebarOpen && (
        <div className="admin-sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <button
        className="admin-sidebar-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? '✕' : '☰'}
      </button>

      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-logo">
          <img src="/images/logo-icon.png" alt="Hanxcel AI" />
          <span>HanXcel Admin</span>
        </div>

        {/* Dashboard link */}
        <a
          href="/admin"
          className={`admin-nav-item ${pathname === '/admin' ? 'active' : ''}`}
          onClick={() => setSidebarOpen(false)}
        >
          <span className="admin-nav-icon">📊</span>
          Dashboard
        </a>

        {/* Grouped navigation */}
        {navGroups.map((group) => (
          <div key={group.label} className="admin-nav-group">
            <div className="admin-nav-group-label">{group.label}</div>
            {group.items.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`admin-nav-item ${pathname === item.href ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <span className="admin-nav-icon">{item.icon}</span>
                {item.label}
              </a>
            ))}
          </div>
        ))}

        {/* Bottom section */}
        <div className="admin-sidebar-bottom">
          <a
            href="/admin/settings"
            className={`admin-nav-item ${pathname === '/admin/settings' ? 'active' : ''}`}
            onClick={() => setSidebarOpen(false)}
          >
            <span className="admin-nav-icon">⚙️</span>
            Settings
          </a>
          <a
            href="/"
            className="admin-nav-item"
          >
            <span className="admin-nav-icon">🌐</span>
            View Website
          </a>
          <div className="admin-sidebar-divider" />
          <div className="admin-sidebar-footer">
            <button
              className="admin-theme-toggle-btn"
              onClick={toggleAdminTheme}
              title={`Switch to ${adminTheme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {adminTheme === 'dark' ? '☀️' : '🌙'}
              <span>{adminTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
            <button
              className="admin-logout-btn"
              onClick={handleLogout}
            >
              <span className="admin-nav-icon">🚪</span>
              Logout
            </button>
          </div>
        </div>
      </aside>

      <div className="admin-main">
        {children}
      </div>
    </div>
  );
}
