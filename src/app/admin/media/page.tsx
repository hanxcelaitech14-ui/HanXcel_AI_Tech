'use client';
import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';

interface MediaFile {
  name: string;
  id: string;
  metadata: { mimetype?: string; size?: number };
  created_at: string;
  bucket_id: string;
}

const buckets = ['blog-images', 'portfolio-images', 'team-photos', 'media-library'];

export default function AdminMedia() {
  const [activeBucket, setActiveBucket] = useState('media-library');
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchFiles();
  }, [activeBucket]);

  const fetchFiles = async () => {
    const { data } = await supabase.storage.from(activeBucket).list('', {
      limit: 100,
      sortBy: { column: 'created_at', order: 'desc' },
    });
    if (data) setFiles(data as unknown as MediaFile[]);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fileName = `${Date.now()}_${file.name}`;
    await supabase.storage.from(activeBucket).upload(fileName, file);
    setUploading(false);
    fetchFiles();
  };

  const handleDelete = async (name: string) => {
    if (confirm(`Delete ${name}?`)) {
      await supabase.storage.from(activeBucket).remove([name]);
      fetchFiles();
    }
  };

  const getPublicUrl = (name: string) => {
    const { data } = supabase.storage.from(activeBucket).getPublicUrl(name);
    return data.publicUrl;
  };

  const isImage = (name: string) => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(name);

  return (
    <>
      <div className="admin-topbar">
        <h1>Media Library</h1>
        <div className="admin-topbar-actions">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleUpload}
            style={{ display: 'none' }}
            accept="image/*,.pdf,.doc,.docx"
          />
          <button
            className="btn btn-primary"
            style={{ padding: '8px 20px', fontSize: '0.85rem' }}
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : '+ Upload File'}
          </button>
        </div>
      </div>
      <div className="admin-content">
        {/* Bucket Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {buckets.map((b) => (
            <button
              key={b}
              className={`solution-tab ${activeBucket === b ? 'active' : ''}`}
              onClick={() => setActiveBucket(b)}
            >
              {b.replace('-', ' ')}
            </button>
          ))}
        </div>

        {/* Files Grid */}
        <div className="media-grid">
          {files.filter((f) => f.name !== '.emptyFolderPlaceholder').map((f) => (
            <div className="media-item" key={f.name} title={f.name}>
              {isImage(f.name) ? (
                <img
                  src={getPublicUrl(f.name)}
                  alt={f.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                '📄'
              )}
              <div className="media-item-name">
                {f.name}
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(f.name); }}
                  style={{ float: 'right', color: '#ff5f57', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
          {files.filter((f) => f.name !== '.emptyFolderPlaceholder').length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 60, color: 'var(--text-tertiary)' }}>
              <div style={{ fontSize: '3rem', marginBottom: 16 }}>📁</div>
              <p>No files in this bucket. Upload your first file above.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
