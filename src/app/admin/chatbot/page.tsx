'use client';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import AdminCRUD from '@/components/admin/AdminCRUD';

interface Conversation {
  id: string;
  session_id: string;
  question: string;
  answer: string;
  created_at: string;
}

export default function AdminChatbot() {
  const [activeTab, setActiveTab] = useState<'logs' | 'knowledge'>('logs');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().split('T')[0]);
  const [searchQuery, setSearchQuery] = useState('');

  // Report Settings
  const [reportEmail, setReportEmail] = useState('');
  const [reportTime, setReportTime] = useState('18:00');
  const [smtpEmail, setSmtpEmail] = useState('');
  const [smtpPassword, setSmtpPassword] = useState('');
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState('');

  const fetchConversations = useCallback(async () => {
    setLoading(true);
    const startOfDay = `${dateFilter}T00:00:00.000Z`;
    const endOfDay = `${dateFilter}T23:59:59.999Z`;

    const { data } = await supabase
      .from('chatbot_conversations')
      .select('*')
      .gte('created_at', startOfDay)
      .lte('created_at', endOfDay)
      .order('created_at', { ascending: false });

    setConversations(data || []);
    setLoading(false);
  }, [dateFilter]);

  useEffect(() => {
    // Fetch report settings
    const fetchSettings = async () => {
      const { data } = await supabase
        .from('site_settings')
        .select('key, value')
        .in('key', ['chatbot_report_email', 'chatbot_report_time', 'smtp_email', 'smtp_password']);

      if (data) {
        data.forEach((row) => {
          const val = typeof row.value === 'string' ? row.value.replace(/^"|"$/g, '') : '';
          if (row.key === 'chatbot_report_email') setReportEmail(val);
          if (row.key === 'chatbot_report_time') setReportTime(val || '18:00');
          if (row.key === 'smtp_email') setSmtpEmail(val);
          if (row.key === 'smtp_password') setSmtpPassword(val);
        });
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    if (activeTab === 'logs') {
      fetchConversations();
    }
  }, [activeTab, fetchConversations]);

  // Auto email timer
  useEffect(() => {
    if (!reportEmail || !reportTime) return;

    const checkTime = () => {
      const now = new Date();
      const [hours, minutes] = reportTime.split(':').map(Number);
      if (now.getHours() === hours && now.getMinutes() === minutes) {
        // Send the report
        fetch('/api/chatbot-report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ date: new Date().toISOString().split('T')[0] }),
        }).catch(console.error);
      }
    };

    const interval = setInterval(checkTime, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [reportEmail, reportTime]);

  const handleSaveSettings = async () => {
    setSettingsSaving(true);
    setSettingsSaved('');

    const settingsToSave = [
      { key: 'chatbot_report_email', value: reportEmail },
      { key: 'chatbot_report_time', value: reportTime },
      { key: 'smtp_email', value: smtpEmail },
      { key: 'smtp_password', value: smtpPassword },
    ];

    for (const s of settingsToSave) {
      await supabase.from('site_settings').upsert(
        { key: s.key, value: s.value, updated_at: new Date().toISOString() },
        { onConflict: 'key' }
      );
    }

    setSettingsSaving(false);
    setSettingsSaved('Settings saved!');
    setTimeout(() => setSettingsSaved(''), 3000);
  };

  const handleSendNow = async () => {
    setSendingEmail(true);
    setEmailStatus('');

    try {
      const res = await fetch('/api/chatbot-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: dateFilter, email: reportEmail }),
      });
      const data = await res.json();
      if (data.success) {
        setEmailStatus(`✓ ${data.message} (${data.totalConversations} conversations)`);
      } else {
        setEmailStatus(`✗ ${data.error}`);
      }
    } catch (err: any) {
      setEmailStatus(`✗ ${err.message}`);
    } finally {
      setSendingEmail(false);
      setTimeout(() => setEmailStatus(''), 8000);
    }
  };

  const handleDownload = () => {
    window.open(`/api/chatbot-report?date=${dateFilter}`, '_blank');
  };

  const handleDeleteConversation = async (id: string) => {
    await supabase.from('chatbot_conversations').delete().eq('id', id);
    setConversations((prev) => prev.filter((c) => c.id !== id));
  };

  const handleClearAll = async () => {
    if (!confirm(`Delete all conversations for ${dateFilter}? This cannot be undone.`)) return;
    const startOfDay = `${dateFilter}T00:00:00.000Z`;
    const endOfDay = `${dateFilter}T23:59:59.999Z`;
    await supabase
      .from('chatbot_conversations')
      .delete()
      .gte('created_at', startOfDay)
      .lte('created_at', endOfDay);
    setConversations([]);
  };

  const filteredConversations = searchQuery
    ? conversations.filter(
        (c) =>
          c.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : conversations;

  // Group by session
  const grouped: Record<string, Conversation[]> = {};
  filteredConversations.forEach((c) => {
    if (!grouped[c.session_id]) grouped[c.session_id] = [];
    grouped[c.session_id].push(c);
  });

  return (
    <>
      <div className="admin-topbar">
        <h1>Chatbot AI</h1>
        <div className="admin-topbar-actions">
          <div style={{ display: 'flex', gap: 4, background: 'var(--glass-bg)', borderRadius: 8, padding: 3, border: '1px solid var(--glass-border)' }}>
            <button
              onClick={() => setActiveTab('logs')}
              style={{
                padding: '6px 16px',
                fontSize: '0.82rem',
                fontWeight: 600,
                borderRadius: 6,
                border: 'none',
                cursor: 'pointer',
                background: activeTab === 'logs' ? 'var(--color-primary)' : 'transparent',
                color: activeTab === 'logs' ? 'white' : 'var(--text-secondary)',
                transition: 'all 0.2s',
              }}
            >
              💬 Chat Logs
            </button>
            <button
              onClick={() => setActiveTab('knowledge')}
              style={{
                padding: '6px 16px',
                fontSize: '0.82rem',
                fontWeight: 600,
                borderRadius: 6,
                border: 'none',
                cursor: 'pointer',
                background: activeTab === 'knowledge' ? 'var(--color-primary)' : 'transparent',
                color: activeTab === 'knowledge' ? 'white' : 'var(--text-secondary)',
                transition: 'all 0.2s',
              }}
            >
              🧠 Knowledge Base
            </button>
          </div>
        </div>
      </div>

      <div className="admin-content">
        {activeTab === 'logs' && (
          <>
            {/* Report Settings Card */}
            <div className="admin-table-wrapper" style={{ marginBottom: 24 }}>
              <div className="admin-table-header">
                <h3>📧 Report Settings</h3>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  {settingsSaved && <span style={{ color: '#28c840', fontSize: '0.82rem' }}>{settingsSaved}</span>}
                  <button
                    className="btn btn-primary"
                    style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                    onClick={handleSaveSettings}
                    disabled={settingsSaving}
                  >
                    {settingsSaving ? 'Saving...' : 'Save Settings'}
                  </button>
                </div>
              </div>
              <div style={{ padding: 20 }}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Gmail Address (Sender)</label>
                    <input
                      className="form-input"
                      type="email"
                      value={smtpEmail}
                      onChange={(e) => setSmtpEmail(e.target.value)}
                      placeholder="yourname@gmail.com"
                    />
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: 4, display: 'block' }}>
                      Gmail account used to send report emails
                    </span>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Gmail App Password</label>
                    <input
                      className="form-input"
                      type="password"
                      value={smtpPassword}
                      onChange={(e) => setSmtpPassword(e.target.value)}
                      placeholder="xxxx xxxx xxxx xxxx"
                    />
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: 4, display: 'block' }}>
                      <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noopener" style={{ color: 'var(--color-primary)' }}>Generate App Password</a> — requires 2-Step Verification enabled
                    </span>
                  </div>
                </div>
                <div className="form-row" style={{ marginTop: 12 }}>
                  <div className="form-group">
                    <label className="form-label">Recipient Email</label>
                    <input
                      className="form-input"
                      type="email"
                      value={reportEmail}
                      onChange={(e) => setReportEmail(e.target.value)}
                      placeholder="admin@company.com"
                    />
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: 4, display: 'block' }}>
                      Daily chatbot Q&A report will be sent to this email
                    </span>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Auto-Send Time (24hr)</label>
                    <input
                      className="form-input"
                      type="time"
                      value={reportTime}
                      onChange={(e) => setReportTime(e.target.value)}
                    />
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: 4, display: 'block' }}>
                      Report auto-sends daily at this time (when admin panel is open)
                    </span>
                  </div>
                </div>
                {emailStatus && (
                  <div style={{
                    marginTop: 12,
                    padding: '10px 14px',
                    borderRadius: 8,
                    fontSize: '0.84rem',
                    background: emailStatus.startsWith('✓') ? 'rgba(40, 200, 64, 0.1)' : 'rgba(255, 95, 87, 0.1)',
                    color: emailStatus.startsWith('✓') ? '#28c840' : '#ff5f57',
                    border: `1px solid ${emailStatus.startsWith('✓') ? 'rgba(40, 200, 64, 0.2)' : 'rgba(255, 95, 87, 0.2)'}`,
                  }}>
                    {emailStatus}
                  </div>
                )}
              </div>
            </div>

            {/* Chat Logs Controls */}
            <div className="admin-table-wrapper" style={{ marginBottom: 24 }}>
              <div className="admin-table-header">
                <h3>💬 Chat Logs — {dateFilter}</h3>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-tertiary)' }}>
                    {filteredConversations.length} Q&A • {Object.keys(grouped).length} sessions
                  </span>
                </div>
              </div>
              <div style={{ padding: '16px 20px', display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', borderBottom: '1px solid var(--glass-border)' }}>
                <input
                  className="form-input"
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  style={{ maxWidth: 180 }}
                />
                <input
                  className="form-input"
                  type="text"
                  placeholder="Search questions or answers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ flex: 1, minWidth: 200 }}
                />
                <button
                  className="btn btn-primary"
                  style={{ padding: '8px 14px', fontSize: '0.8rem' }}
                  onClick={handleDownload}
                  title="Download report as HTML document"
                >
                  📥 Download
                </button>
                <button
                  className="btn btn-primary"
                  style={{ padding: '8px 14px', fontSize: '0.8rem', background: '#7c3aed' }}
                  onClick={handleSendNow}
                  disabled={sendingEmail || !reportEmail}
                  title="Send report email now"
                >
                  {sendingEmail ? '📤 Sending...' : '📤 Send Email'}
                </button>
                {conversations.length > 0 && (
                  <button
                    className="btn"
                    style={{ padding: '8px 14px', fontSize: '0.8rem', background: 'rgba(255, 95, 87, 0.1)', color: '#ff5f57', border: '1px solid rgba(255, 95, 87, 0.2)' }}
                    onClick={handleClearAll}
                  >
                    🗑️ Clear All
                  </button>
                )}
              </div>

              {/* Conversation List */}
              <div style={{ padding: 20 }}>
                {loading ? (
                  <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-tertiary)' }}>
                    Loading conversations...
                  </div>
                ) : filteredConversations.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-tertiary)' }}>
                    <div style={{ fontSize: 32, marginBottom: 12 }}>💬</div>
                    <p>No chatbot conversations found for {dateFilter}</p>
                  </div>
                ) : (
                  Object.entries(grouped).map(([sessionId, convos], sIdx) => (
                    <div key={sessionId} style={{ marginBottom: 28 }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        marginBottom: 12,
                        padding: '8px 12px',
                        background: 'var(--glass-bg)',
                        borderRadius: 8,
                        border: '1px solid var(--glass-border)',
                      }}>
                        <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-primary)' }}>
                          Session {sIdx + 1}
                        </span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>
                          {sessionId.slice(0, 25)}... • {convos.length} Q&A
                        </span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', marginLeft: 'auto' }}>
                          {new Date(convos[0].created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      {convos.map((c) => (
                        <div key={c.id} style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr auto',
                          gap: 12,
                          padding: '12px 14px',
                          marginBottom: 6,
                          background: 'var(--bg-secondary)',
                          borderRadius: 8,
                          border: '1px solid var(--glass-border)',
                          fontSize: '0.84rem',
                          alignItems: 'start',
                        }}>
                          <div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--color-primary)', fontWeight: 600, marginBottom: 4, textTransform: 'uppercase' }}>Question</div>
                            <div style={{ color: 'var(--text-primary)', lineHeight: 1.5 }}>{c.question}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: '0.7rem', color: '#28c840', fontWeight: 600, marginBottom: 4, textTransform: 'uppercase' }}>AI Answer</div>
                            <div style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>{c.answer}</div>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>
                              {new Date(c.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <button
                              onClick={() => handleDeleteConversation(c.id)}
                              title="Delete this entry"
                              style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '0.75rem',
                                color: '#ff5f57',
                                padding: '2px 6px',
                                borderRadius: 4,
                                opacity: 0.6,
                                transition: 'opacity 0.2s',
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                              onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.6')}
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}

        {activeTab === 'knowledge' && (
          <AdminCRUD
            title="Chatbot AI Knowledge Base"
            table="chatbot_context"
            orderBy="created_at"
            searchField="title"
            columns={[
              { key: 'title', label: 'Topic / Title' },
              { key: 'content', label: 'Knowledge Content', render: (val) => (val as string)?.slice(0, 100) + '...' },
              { key: 'created_at', label: 'Created At', render: (val) => new Date(val as string).toLocaleDateString() },
            ]}
            fields={[
              { key: 'title', label: 'Topic Title', type: 'text', placeholder: 'e.g. Service Offerings, pricing info...' },
              { key: 'content', label: 'Knowledge / Context Details', type: 'textarea', placeholder: 'Insert company details for the AI chatbot to learn from...' },
            ]}
          />
        )}
      </div>
    </>
  );
}
