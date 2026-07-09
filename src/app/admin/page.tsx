'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    blog: 0, portfolio: 0, services: 0, messages: 0, inquiries: 0, team: 0,
  });
  const [recentMessages, setRecentMessages] = useState<{ id: string; name: string; email: string; subject: string; status: string; created_at: string }[]>([]);
  const [recentInquiries, setRecentInquiries] = useState<{ id: string; personal_details: { name?: string; company?: string }; project_info: { type?: string }; status: string; created_at: string }[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      const [blog, portfolio, services, messages, inquiries, team] = await Promise.all([
        supabase.from('blog_posts').select('id', { count: 'exact', head: true }),
        supabase.from('portfolio').select('id', { count: 'exact', head: true }),
        supabase.from('services').select('id', { count: 'exact', head: true }),
        supabase.from('contact_submissions').select('id', { count: 'exact', head: true }),
        supabase.from('project_inquiries').select('id', { count: 'exact', head: true }),
        supabase.from('team_members').select('id', { count: 'exact', head: true }),
      ]);
      setStats({
        blog: blog.count || 0,
        portfolio: portfolio.count || 0,
        services: services.count || 0,
        messages: messages.count || 0,
        inquiries: inquiries.count || 0,
        team: team.count || 0,
      });
    };

    const fetchRecent = async () => {
      const { data: msgs } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      if (msgs) setRecentMessages(msgs);

      const { data: inqs } = await supabase
        .from('project_inquiries')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      if (inqs) setRecentInquiries(inqs);
    };

    fetchStats();
    fetchRecent();
  }, []);

  const statCards = [
    { icon: '📝', value: stats.blog, label: 'Blog Posts' },
    { icon: '💼', value: stats.portfolio, label: 'Projects' },
    { icon: '🔧', value: stats.services, label: 'Services' },
    { icon: '✉️', value: stats.messages, label: 'Messages' },
    { icon: '📩', value: stats.inquiries, label: 'Inquiries' },
    { icon: '👥', value: stats.team, label: 'Team Members' },
  ];

  return (
    <>
      <div className="admin-topbar">
        <h1>Dashboard</h1>
        <div className="admin-topbar-actions">
          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Welcome, Admin</span>
        </div>
      </div>
      <div className="admin-content">
        <div className="admin-stats-grid">
          {statCards.map((s) => (
            <div className="admin-stat-card" key={s.label}>
              <span className="stat-icon">{s.icon}</span>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {/* Recent Messages */}
          <div className="admin-table-wrapper">
            <div className="admin-table-header">
              <h3>Recent Messages</h3>
              <a href="/admin/messages" style={{ color: 'var(--color-primary)', fontSize: '0.85rem' }}>View All →</a>
            </div>
            <table className="admin-table">
              <thead>
                <tr><th>Name</th><th>Subject</th><th>Status</th></tr>
              </thead>
              <tbody>
                {recentMessages.map((m) => (
                  <tr key={m.id}>
                    <td>{m.name}</td>
                    <td>{m.subject || '—'}</td>
                    <td><span className={`admin-badge ${m.status}`}>{m.status}</span></td>
                  </tr>
                ))}
                {recentMessages.length === 0 && (
                  <tr><td colSpan={3} style={{ textAlign: 'center', color: 'var(--text-tertiary)' }}>No messages yet</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Recent Inquiries */}
          <div className="admin-table-wrapper">
            <div className="admin-table-header">
              <h3>Project Inquiries</h3>
              <a href="/admin/inquiries" style={{ color: 'var(--color-primary)', fontSize: '0.85rem' }}>View All →</a>
            </div>
            <table className="admin-table">
              <thead>
                <tr><th>Client</th><th>Project</th><th>Status</th></tr>
              </thead>
              <tbody>
                {recentInquiries.map((inq) => (
                  <tr key={inq.id}>
                    <td>{inq.personal_details?.name || '—'}</td>
                    <td>{inq.project_info?.type || '—'}</td>
                    <td><span className={`admin-badge ${inq.status}`}>{inq.status.replace('_', ' ')}</span></td>
                  </tr>
                ))}
                {recentInquiries.length === 0 && (
                  <tr><td colSpan={3} style={{ textAlign: 'center', color: 'var(--text-tertiary)' }}>No inquiries yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
