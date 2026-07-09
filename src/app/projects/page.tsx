'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/public/Navbar';
import ParticleBackground from '@/components/public/ParticleBackground';
import Footer from '@/components/public/Footer';
import Link from 'next/link';

interface PortfolioItem {
  id: string;
  title: string;
  client: string;
  technology: string[];
  category: string;
  description: string;
  image_url: string | null;
  link: string | null;
}

const categoryIcons: Record<string, string> = {
  ai: '🤖',
  web: '🌐',
  mobile: '📱',
  iot: '📡',
};

export default function AllProjectsPage() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    supabase
      .from('portfolio')
      .select('*')
      .order('sort_order')
      .then(({ data }) => {
        if (data) setItems(data);
      });
  }, []);

  const categories = ['all', ...Array.from(new Set(items.map((p) => p.category)))];
  const filtered = filter === 'all' ? items : items.filter((p) => p.category === filter);

  return (
    <>
      <ParticleBackground />
      <Navbar />
      
      <main style={{ paddingTop: 140, paddingBottom: 100 }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: 48 }}>
            <span className="section-badge">✦ Showcase</span>
            <h1 className="section-title" style={{ fontSize: '3rem', fontWeight: 800 }}>Our Projects & Case Studies</h1>
            <p className="section-subtitle">
              Explore the complete catalog of digital solutions we have built for enterprises worldwide.
            </p>
          </div>

          <div className="portfolio-filters" style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 40 }}>
            {categories.map((c) => (
              <button
                key={c}
                className={`portfolio-filter ${filter === c ? 'active' : ''}`}
                onClick={() => setFilter(c)}
                style={{
                  padding: '10px 24px',
                  borderRadius: '9999px',
                  border: '1px solid var(--glass-border)',
                  background: filter === c ? 'var(--color-primary)' : 'var(--glass-bg)',
                  color: filter === c ? 'var(--bg-primary)' : 'var(--text-primary)',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  transition: 'all var(--transition-normal)'
                }}
              >
                {c === 'all' ? 'All Projects' : c.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="portfolio-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 30 }}>
            {filtered.map((p) => (
              <Link href={`/projects/${p.id}`} key={p.id} style={{ display: 'block', height: '100%' }}>
                <div className="portfolio-card" style={{ height: '100%', display: 'flex', flexDirection: 'column', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-lg)', background: 'var(--glass-bg)', overflow: 'hidden', transition: 'all var(--transition-normal)' }}>
                  <div className="portfolio-image" style={{ height: 220, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.02)' }}>
                    {p.image_url ? (
                      <img 
                        src={p.image_url.split('#')[0]} 
                        alt={p.title} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                    ) : (
                      <span style={{ fontSize: '4rem' }}>{categoryIcons[p.category] || '📦'}</span>
                    )}
                    <span className="blog-category-badge" style={{ position: 'absolute', top: 16, left: 16, padding: '4px 14px', background: 'rgba(0, 212, 255, 0.2)', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-primary)' }}>
                      {p.category.toUpperCase()}
                    </span>
                  </div>
                  <div className="portfolio-body" style={{ padding: 24, flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3 className="portfolio-title" style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: 8, color: 'var(--text-primary)' }}>{p.title}</h3>
                    <p className="portfolio-client" style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', marginBottom: 12 }}>Client: {p.client}</p>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 20 }}>{p.description}</p>
                    <div className="portfolio-tech" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 'auto' }}>
                      {p.technology.map((t) => (
                        <span className="portfolio-tech-tag" key={t} style={{ fontSize: '0.75rem', padding: '4px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '4px', color: 'var(--text-secondary)' }}>{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
