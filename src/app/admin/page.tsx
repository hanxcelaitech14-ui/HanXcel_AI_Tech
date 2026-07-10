'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    blog: 0, portfolio: 0, services: 0, messages: 0, inquiries: 0, team: 0,
  });
  const [recentMessages, setRecentMessages] = useState<{ id: string; name: string; email: string; subject: string; status: string; created_at: string }[]>([]);
  const [recentInquiries, setRecentInquiries] = useState<{ id: string; personal_details: { name?: string; company?: string }; project_info: { type?: string }; status: string; created_at: string }[]>([]);

  // Drag and drop states for cards and panels
  const [cardOrder, setCardOrder] = useState<string[]>(['Blog Posts', 'Projects', 'Services', 'Messages', 'Inquiries', 'Team Members']);
  const [panelOrder, setPanelOrder] = useState<string[]>(['messages', 'inquiries']);
  const [draggedCard, setDraggedCard] = useState<string | null>(null);
  const [draggedPanel, setDraggedPanel] = useState<string | null>(null);

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

    // Load custom layouts from localStorage if available
    const savedCardOrder = localStorage.getItem('hanxcel-admin-stat-order');
    if (savedCardOrder) {
      try {
        setCardOrder(JSON.parse(savedCardOrder));
      } catch (e) {
        // use default
      }
    }

    const savedPanelOrder = localStorage.getItem('hanxcel-admin-panel-order');
    if (savedPanelOrder) {
      try {
        setPanelOrder(JSON.parse(savedPanelOrder));
      } catch (e) {
        // use default
      }
    }

    fetchStats();
    fetchRecent();
  }, []);

  // Card Drag Handlers
  const handleCardDragStart = (e: React.DragEvent, label: string) => {
    setDraggedCard(label);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleCardDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleCardDrop = (e: React.DragEvent, targetLabel: string) => {
    e.preventDefault();
    if (!draggedCard || draggedCard === targetLabel) return;

    const newOrder = [...cardOrder];
    const draggedIdx = newOrder.indexOf(draggedCard);
    const targetIdx = newOrder.indexOf(targetLabel);

    newOrder.splice(draggedIdx, 1);
    newOrder.splice(targetIdx, 0, draggedCard);

    setCardOrder(newOrder);
    localStorage.setItem('hanxcel-admin-stat-order', JSON.stringify(newOrder));
  };

  const handleCardDragEnd = () => {
    setDraggedCard(null);
  };

  // Panel Drag Handlers
  const handlePanelDragStart = (e: React.DragEvent, panelId: string) => {
    setDraggedPanel(panelId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handlePanelDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handlePanelDrop = (e: React.DragEvent, targetPanelId: string) => {
    e.preventDefault();
    if (!draggedPanel || draggedPanel === targetPanelId) return;

    const newOrder = [...panelOrder];
    const draggedIdx = newOrder.indexOf(draggedPanel);
    const targetIdx = newOrder.indexOf(targetPanelId);

    newOrder.splice(draggedIdx, 1);
    newOrder.splice(targetIdx, 0, draggedPanel);

    setPanelOrder(newOrder);
    localStorage.setItem('hanxcel-admin-panel-order', JSON.stringify(newOrder));
  };

  const handlePanelDragEnd = () => {
    setDraggedPanel(null);
  };

  const statCards = [
    { icon: '📝', value: stats.blog, label: 'Blog Posts' },
    { icon: '💼', value: stats.portfolio, label: 'Projects' },
    { icon: '🔧', value: stats.services, label: 'Services' },
    { icon: '✉️', value: stats.messages, label: 'Messages' },
    { icon: '📩', value: stats.inquiries, label: 'Inquiries' },
    { icon: '👥', value: stats.team, label: 'Team Members' },
  ];

  // Sort stat cards according to custom order
  const orderedCards = [...statCards].sort((a, b) => {
    return cardOrder.indexOf(a.label) - cardOrder.indexOf(b.label);
  });

  const panels = {
    messages: (
      <div 
        key="messages" 
        className={`admin-table-wrapper ${draggedPanel === 'messages' ? 'dragging' : ''}`}
        draggable
        onDragStart={(e) => handlePanelDragStart(e, 'messages')}
        onDragOver={handlePanelDragOver}
        onDrop={(e) => handlePanelDrop(e, 'messages')}
        onDragEnd={handlePanelDragEnd}
        style={{ cursor: 'grab', transition: 'transform var(--transition-fast), opacity var(--transition-fast)' }}
      >
        <div className="admin-table-header" style={{ cursor: 'move' }}>
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
    ),
    inquiries: (
      <div 
        key="inquiries" 
        className={`admin-table-wrapper ${draggedPanel === 'inquiries' ? 'dragging' : ''}`}
        draggable
        onDragStart={(e) => handlePanelDragStart(e, 'inquiries')}
        onDragOver={handlePanelDragOver}
        onDrop={(e) => handlePanelDrop(e, 'inquiries')}
        onDragEnd={handlePanelDragEnd}
        style={{ cursor: 'grab', transition: 'transform var(--transition-fast), opacity var(--transition-fast)' }}
      >
        <div className="admin-table-header" style={{ cursor: 'move' }}>
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
    )
  };

  return (
    <>
      <div className="admin-topbar">
        <h1>Dashboard</h1>
        <div className="admin-topbar-actions">
          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Welcome, Admin</span>
        </div>
      </div>
      <div className="admin-content">
        {/* Stat Cards Row */}
        <div className="admin-stats-grid">
          {orderedCards.map((s) => (
            <div 
              className={`admin-stat-card ${draggedCard === s.label ? 'dragging' : ''}`} 
              key={s.label}
              draggable
              onDragStart={(e) => handleCardDragStart(e, s.label)}
              onDragOver={handleCardDragOver}
              onDrop={(e) => handleCardDrop(e, s.label)}
              onDragEnd={handleCardDragEnd}
              style={{ cursor: 'grab', transition: 'transform var(--transition-fast), opacity var(--transition-fast)' }}
            >
              <span className="stat-icon">{s.icon}</span>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Movable bottom grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }} className="admin-panels-grid">
          {panelOrder.map(panelId => panels[panelId as 'messages' | 'inquiries'])}
        </div>
      </div>
    </>
  );
}

