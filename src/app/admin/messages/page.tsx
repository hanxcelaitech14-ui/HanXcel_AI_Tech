'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Message {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selected, setSelected] = useState<Message | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    const { data } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setMessages(data);
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('contact_submissions').update({ status }).eq('id', id);
    fetchMessages();
  };

  const deleteMessage = async (id: string) => {
    if (confirm('Delete this message?')) {
      await supabase.from('contact_submissions').delete().eq('id', id);
      fetchMessages();
    }
  };

  return (
    <>
      <div className="admin-topbar">
        <h1>Contact Messages</h1>
      </div>
      <div className="admin-content">
        <div className="admin-table-wrapper">
          <div className="admin-table-header">
            <h3>{messages.length} Messages</h3>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Subject</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((m) => (
                <tr key={m.id}>
                  <td>{m.name}</td>
                  <td>{m.email}</td>
                  <td>{m.subject || '—'}</td>
                  <td>
                    <select
                      className="form-select"
                      style={{ padding: '4px 8px', fontSize: '0.8rem', width: 'auto', background: 'var(--bg-primary)' }}
                      value={m.status}
                      onChange={(e) => updateStatus(m.id, e.target.value)}
                    >
                      <option value="new">New</option>
                      <option value="read">Read</option>
                      <option value="replied">Replied</option>
                    </select>
                  </td>
                  <td>{new Date(m.created_at).toLocaleDateString()}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="admin-btn admin-btn-edit" onClick={() => setSelected(m)}>View</button>
                      <button className="admin-btn admin-btn-delete" onClick={() => deleteMessage(m.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {messages.length === 0 && (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: 'var(--text-tertiary)' }}>No messages yet</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {selected && (
          <div className="admin-modal-overlay" onClick={() => setSelected(null)}>
            <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
              <div className="admin-modal-header">
                <h3>Message from {selected.name}</h3>
                <button className="admin-modal-close" onClick={() => setSelected(null)}>×</button>
              </div>
              <div className="admin-modal-body">
                <div className="review-section">
                  <h4>Contact Information</h4>
                  <div className="review-item"><span className="label">Name</span><span className="value">{selected.name}</span></div>
                  <div className="review-item"><span className="label">Email</span><span className="value">{selected.email}</span></div>
                  <div className="review-item"><span className="label">Phone</span><span className="value">{selected.phone || '—'}</span></div>
                  <div className="review-item"><span className="label">Date</span><span className="value">{new Date(selected.created_at).toLocaleString()}</span></div>
                </div>
                <div className="review-section">
                  <h4>Message</h4>
                  <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                    {selected.message}
                  </p>
                </div>
              </div>
              <div className="admin-modal-footer">
                <a href={`mailto:${selected.email}?subject=Re: ${selected.subject || 'Your inquiry'}`} className="btn btn-primary" style={{ fontSize: '0.85rem', padding: '8px 20px' }}>
                  Reply via Email
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
