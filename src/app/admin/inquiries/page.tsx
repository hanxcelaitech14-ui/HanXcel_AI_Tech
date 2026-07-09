'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Inquiry {
  id: string;
  personal_details: { name?: string; email?: string; phone?: string; company?: string };
  project_info: { type?: string; budget?: string; timeline?: string };
  requirements: { description?: string; features?: string[] };
  additional_services: string[];
  status: string;
  notes: string;
  created_at: string;
}

const statusOptions = ['new', 'under_review', 'replied', 'assigned', 'completed'];

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [selected, setSelected] = useState<Inquiry | null>(null);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    const { data } = await supabase
      .from('project_inquiries')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setInquiries(data);
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('project_inquiries').update({ status }).eq('id', id);
    fetchInquiries();
  };

  return (
    <>
      <div className="admin-topbar">
        <h1>Project Inquiries</h1>
      </div>
      <div className="admin-content">
        <div className="admin-table-wrapper">
          <div className="admin-table-header">
            <h3>{inquiries.length} Inquiries</h3>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Company</th>
                <th>Project Type</th>
                <th>Budget</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map((inq) => (
                <tr key={inq.id}>
                  <td>
                    <div>{inq.personal_details?.name || '—'}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{inq.personal_details?.email}</div>
                  </td>
                  <td>{inq.personal_details?.company || '—'}</td>
                  <td>{inq.project_info?.type || '—'}</td>
                  <td>{inq.project_info?.budget || '—'}</td>
                  <td>
                    <select
                      className="form-select"
                      style={{ padding: '4px 8px', fontSize: '0.8rem', width: 'auto', background: 'var(--bg-primary)' }}
                      value={inq.status}
                      onChange={(e) => updateStatus(inq.id, e.target.value)}
                    >
                      {statusOptions.map((s) => (
                        <option key={s} value={s}>{s.replace('_', ' ')}</option>
                      ))}
                    </select>
                  </td>
                  <td>{new Date(inq.created_at).toLocaleDateString()}</td>
                  <td>
                    <button className="admin-btn admin-btn-edit" onClick={() => setSelected(inq)}>View</button>
                  </td>
                </tr>
              ))}
              {inquiries.length === 0 && (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40, color: 'var(--text-tertiary)' }}>No inquiries yet</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Detail Modal */}
        {selected && (
          <div className="admin-modal-overlay" onClick={() => setSelected(null)}>
            <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
              <div className="admin-modal-header">
                <h3>Inquiry Details</h3>
                <button className="admin-modal-close" onClick={() => setSelected(null)}>×</button>
              </div>
              <div className="admin-modal-body">
                <div className="review-section">
                  <h4>Personal Details</h4>
                  <div className="review-item"><span className="label">Name</span><span className="value">{selected.personal_details?.name || '—'}</span></div>
                  <div className="review-item"><span className="label">Email</span><span className="value">{selected.personal_details?.email || '—'}</span></div>
                  <div className="review-item"><span className="label">Phone</span><span className="value">{selected.personal_details?.phone || '—'}</span></div>
                  <div className="review-item"><span className="label">Company</span><span className="value">{selected.personal_details?.company || '—'}</span></div>
                </div>
                <div className="review-section">
                  <h4>Project Info</h4>
                  <div className="review-item"><span className="label">Type</span><span className="value">{selected.project_info?.type || '—'}</span></div>
                  <div className="review-item"><span className="label">Budget</span><span className="value">{selected.project_info?.budget || '—'}</span></div>
                  <div className="review-item"><span className="label">Timeline</span><span className="value">{selected.project_info?.timeline || '—'}</span></div>
                </div>
                <div className="review-section">
                  <h4>Requirements</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{selected.requirements?.description || '—'}</p>
                  {selected.requirements?.features && selected.requirements.features.length > 0 && (
                    <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {selected.requirements.features.map((f) => (
                        <span className="service-feature-tag" key={f}>{f}</span>
                      ))}
                    </div>
                  )}
                </div>
                {selected.additional_services?.length > 0 && (
                  <div className="review-section">
                    <h4>Additional Services</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {selected.additional_services.map((s) => (
                        <span className="service-feature-tag" key={s}>{s}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
