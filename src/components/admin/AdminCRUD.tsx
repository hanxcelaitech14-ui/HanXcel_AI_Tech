'use client';
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

interface Column {
  key: string;
  label: string;
  render?: (val: unknown, row: Record<string, unknown>) => React.ReactNode;
}

interface Field {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'checkbox' | 'tags' | 'image';
  options?: string[];
  placeholder?: string;
}

interface AdminCRUDProps {
  title: string;
  table: string;
  columns: Column[];
  fields: Field[];
  orderBy?: string;
  searchField?: string;
}

export default function AdminCRUD({ title, table, columns, fields, orderBy = 'created_at', searchField }: AdminCRUDProps) {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);
  const [form, setForm] = useState<Record<string, unknown>>({});
  const [uploading, setUploading] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    let query = supabase.from(table).select('*').order(orderBy, { ascending: orderBy === 'sort_order' });
    if (search && searchField) {
      query = query.ilike(searchField, `%${search}%`);
    }
    const { data } = await query;
    if (data) setItems(data);
  }, [table, orderBy, search, searchField]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const openCreate = () => {
    setEditing(null);
    const defaultForm: Record<string, unknown> = {};
    fields.forEach((f) => {
      if (f.type === 'checkbox') defaultForm[f.key] = false;
      else if (f.type === 'tags') defaultForm[f.key] = [];
      else defaultForm[f.key] = '';
    });
    setForm(defaultForm);
    setShowModal(true);
  };

  const openEdit = (item: Record<string, unknown>) => {
    setEditing(item);
    const editForm: Record<string, unknown> = {};
    fields.forEach((f) => {
      editForm[f.key] = item[f.key] ?? (f.type === 'tags' ? [] : f.type === 'checkbox' ? false : '');
    });
    setForm(editForm);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (editing) {
      await supabase.from(table).update(form).eq('id', editing.id as string);
    } else {
      await supabase.from(table).insert(form);
    }
    setShowModal(false);
    fetchItems();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      await supabase.from(table).delete().eq('id', id);
      fetchItems();
    }
  };

  const updateField = (key: string, value: unknown) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const handleFileUpload = async (key: string, file: File) => {
    setUploading(key);
    const ext = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const filePath = `uploads/${fileName}`;

    const { error } = await supabase.storage
      .from('media-library')
      .upload(filePath, file, { cacheControl: '3600', upsert: false });

    if (!error) {
      const { data: urlData } = supabase.storage
        .from('media-library')
        .getPublicUrl(filePath);
      updateField(key, urlData.publicUrl);
    } else {
      alert('Upload failed: ' + error.message);
    }
    setUploading(null);
  };

  return (
    <>
      <div className="admin-topbar">
        <h1>{title}</h1>
        <div className="admin-topbar-actions">
          <button className="btn btn-primary" style={{ padding: '8px 20px', fontSize: '0.85rem' }} onClick={openCreate}>
            + Add New
          </button>
        </div>
      </div>
      <div className="admin-content">
        <div className="admin-table-wrapper">
          <div className="admin-table-header">
            <h3>{items.length} {title}</h3>
            {searchField && (
              <input
                className="admin-search"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            )}
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                {columns.map((c) => <th key={c.key}>{c.label}</th>)}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id as string}>
                  {columns.map((c) => (
                    <td key={c.key}>
                      {c.render ? c.render(item[c.key], item) : String(item[c.key] ?? '—')}
                    </td>
                  ))}
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="admin-btn admin-btn-edit" onClick={() => openEdit(item)}>Edit</button>
                      <button className="admin-btn admin-btn-delete" onClick={() => handleDelete(item.id as string)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td colSpan={columns.length + 1} style={{ textAlign: 'center', padding: 40, color: 'var(--text-tertiary)' }}>No items found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>{editing ? 'Edit' : 'Create'} {title.replace(/s$/, '')}</h3>
              <button className="admin-modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="admin-modal-body">
              {fields.map((f) => (
                <div className="form-group" key={f.key}>
                  <label className="form-label">{f.label}</label>
                  {f.type === 'text' && (
                    <input className="form-input" value={form[f.key] as string || ''} onChange={(e) => updateField(f.key, e.target.value)} placeholder={f.placeholder} />
                  )}
                  {f.type === 'textarea' && (
                    <textarea className="form-textarea" value={form[f.key] as string || ''} onChange={(e) => updateField(f.key, e.target.value)} placeholder={f.placeholder} />
                  )}
                  {f.type === 'select' && (
                    <select className="form-select" value={form[f.key] as string || ''} onChange={(e) => updateField(f.key, e.target.value)}>
                      {f.options?.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  )}
                  {f.type === 'checkbox' && (
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <input type="checkbox" checked={form[f.key] as boolean || false} onChange={(e) => updateField(f.key, e.target.checked)} />
                      {f.label}
                    </label>
                  )}
                  {f.type === 'tags' && (
                    <input className="form-input" value={(form[f.key] as string[])?.join(', ') || ''} onChange={(e) => updateField(f.key, e.target.value.split(',').map((s) => s.trim()).filter(Boolean))} placeholder="Comma-separated values" />
                  )}
                  {f.type === 'image' && (() => {
                    const currentUrl = form[f.key] as string || '';
                    const getHashParams = (url: string) => {
                      const hash = url.split('#')[1];
                      const params = new URLSearchParams(hash || '');
                      return {
                        fit: params.get('fit') || 'cover',
                        pos: params.get('pos') || 'center',
                      };
                    };
                    const updateHashParams = (url: string, newParams: { fit?: string; pos?: string }) => {
                      const baseUrl = url.split('#')[0];
                      const hash = url.split('#')[1];
                      const params = new URLSearchParams(hash || '');
                      if (newParams.fit) params.set('fit', newParams.fit);
                      if (newParams.pos) params.set('pos', newParams.pos);
                      return `${baseUrl}#${params.toString()}`;
                    };
                    const { fit, pos } = getHashParams(currentUrl);

                    return (
                      <div>
                        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                          <input
                            className="form-input"
                            value={currentUrl}
                            onChange={(e) => updateField(f.key, e.target.value)}
                            placeholder={f.placeholder || 'Image URL or upload below'}
                            style={{ flex: 1 }}
                          />
                          <label
                            className="btn btn-outline"
                            style={{ padding: '8px 16px', fontSize: '0.82rem', cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 6 }}
                          >
                            {uploading === f.key ? '⏳ Uploading...' : '📁 Upload'}
                            <input
                              type="file"
                              accept="image/*"
                              style={{ display: 'none' }}
                              disabled={uploading === f.key}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleFileUpload(f.key, file);
                                e.target.value = '';
                              }}
                            />
                          </label>
                        </div>
                        {currentUrl && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            <div style={{ display: 'flex', gap: 16, alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: 12, borderRadius: 8, border: '1px solid var(--glass-border)' }}>
                              <div style={{ flex: 1 }}>
                                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Frame Fit:</label>
                                <select 
                                  className="form-select" 
                                  style={{ padding: '6px 10px', fontSize: '0.8rem', height: 'auto' }}
                                  value={fit} 
                                  onChange={(e) => updateField(f.key, updateHashParams(currentUrl, { fit: e.target.value }))}
                                >
                                  <option value="cover">Cover (Fill & Crop)</option>
                                  <option value="contain">Contain (Show Whole)</option>
                                  <option value="fill">Fill (Stretch)</option>
                                </select>
                              </div>
                              <div style={{ flex: 1 }}>
                                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Focus Position:</label>
                                <select 
                                  className="form-select" 
                                  style={{ padding: '6px 10px', fontSize: '0.8rem', height: 'auto' }}
                                  value={pos} 
                                  onChange={(e) => updateField(f.key, updateHashParams(currentUrl, { pos: e.target.value }))}
                                >
                                  <option value="center">Center</option>
                                  <option value="top">Top</option>
                                  <option value="bottom">Bottom</option>
                                  <option value="left">Left</option>
                                  <option value="right">Right</option>
                                </select>
                              </div>
                            </div>
                            <div style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid var(--glass-border)', display: 'inline-block', width: 200, height: 120, background: '#141428' }}>
                              <img
                                src={currentUrl}
                                alt="Preview"
                                style={{ width: '100%', height: '100%', objectFit: fit as any, objectPosition: pos, display: 'block' }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              ))}
            </div>
            <div className="admin-modal-footer">
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}>Save</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
