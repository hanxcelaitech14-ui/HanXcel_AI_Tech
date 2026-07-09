'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Settings {
  company: {
    name: string;
    tagline: string;
    email: string;
    phone: string;
    address: string;
    business_hours: string;
  };
  social: {
    linkedin: string;
    twitter: string;
    github: string;
    instagram: string;
  };
  seo: {
    title: string;
    description: string;
    keywords: string;
  };
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<Settings>({
    company: { name: '', tagline: '', email: '', phone: '', address: '', business_hours: '' },
    social: { linkedin: '', twitter: '', github: '', instagram: '' },
    seo: { title: '', description: '', keywords: '' },
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase.from('site_settings').select('*');
      if (data) {
        const mapped: Record<string, unknown> = {};
        data.forEach((row: { key: string; value: unknown }) => {
          mapped[row.key] = row.value;
        });
        setSettings({
          company: (mapped.company as Settings['company']) || settings.company,
          social: (mapped.social as Settings['social']) || settings.social,
          seo: (mapped.seo as Settings['seo']) || settings.seo,
        });
      }
    };
    fetchSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const updates = [
      { key: 'company', value: settings.company },
      { key: 'social', value: settings.social },
      { key: 'seo', value: settings.seo },
    ];

    for (const u of updates) {
      await supabase
        .from('site_settings')
        .upsert({ key: u.key, value: u.value, updated_at: new Date().toISOString() }, { onConflict: 'key' });
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const updateCompany = (key: string, val: string) => {
    setSettings((s) => ({ ...s, company: { ...s.company, [key]: val } }));
  };
  const updateSocial = (key: string, val: string) => {
    setSettings((s) => ({ ...s, social: { ...s.social, [key]: val } }));
  };
  const updateSEO = (key: string, val: string) => {
    setSettings((s) => ({ ...s, seo: { ...s.seo, [key]: val } }));
  };

  return (
    <>
      <div className="admin-topbar">
        <h1>Website Settings</h1>
        <div className="admin-topbar-actions">
          {saved && <span style={{ color: '#28c840', fontSize: '0.9rem' }}>✓ Saved</span>}
          <button
            className="btn btn-primary"
            style={{ padding: '8px 20px', fontSize: '0.85rem' }}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
      <div className="admin-content">
        {/* Company Information */}
        <div className="admin-table-wrapper" style={{ marginBottom: 24 }}>
          <div className="admin-table-header">
            <h3>🏢 Company Information</h3>
          </div>
          <div style={{ padding: 24 }}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Company Name</label>
                <input className="form-input" value={settings.company.name} onChange={(e) => updateCompany('name', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Tagline</label>
                <input className="form-input" value={settings.company.tagline} onChange={(e) => updateCompany('tagline', e.target.value)} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-input" value={settings.company.email} onChange={(e) => updateCompany('email', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input className="form-input" value={settings.company.phone} onChange={(e) => updateCompany('phone', e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Address</label>
              <input className="form-input" value={settings.company.address} onChange={(e) => updateCompany('address', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Business Hours</label>
              <input className="form-input" value={settings.company.business_hours} onChange={(e) => updateCompany('business_hours', e.target.value)} />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="admin-table-wrapper" style={{ marginBottom: 24 }}>
          <div className="admin-table-header">
            <h3>🔗 Social Links</h3>
          </div>
          <div style={{ padding: 24 }}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">LinkedIn</label>
                <input className="form-input" value={settings.social.linkedin} onChange={(e) => updateSocial('linkedin', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Twitter / X</label>
                <input className="form-input" value={settings.social.twitter} onChange={(e) => updateSocial('twitter', e.target.value)} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">GitHub</label>
                <input className="form-input" value={settings.social.github} onChange={(e) => updateSocial('github', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Instagram</label>
                <input className="form-input" value={settings.social.instagram} onChange={(e) => updateSocial('instagram', e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        {/* SEO */}
        <div className="admin-table-wrapper">
          <div className="admin-table-header">
            <h3>🔍 SEO Settings</h3>
          </div>
          <div style={{ padding: 24 }}>
            <div className="form-group">
              <label className="form-label">Default Page Title</label>
              <input className="form-input" value={settings.seo.title} onChange={(e) => updateSEO('title', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Meta Description</label>
              <textarea className="form-textarea" value={settings.seo.description} onChange={(e) => updateSEO('description', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Keywords</label>
              <input className="form-input" value={settings.seo.keywords} onChange={(e) => updateSEO('keywords', e.target.value)} placeholder="Comma-separated keywords" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
