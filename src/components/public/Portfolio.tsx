'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import ScrollReveal from './ScrollReveal';
import Link from 'next/link';

interface PortfolioItem {
  id: string;
  title: string;
  client: string;
  technology: string[];
  category: string;
  description: string;
  image_url: string | null;
}

const categoryIcons: Record<string, string> = {
  ai: '🤖',
  web: '🌐',
  mobile: '📱',
  iot: '📡',
};

export default function Portfolio() {
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
    <section className="section" id="portfolio">
      <div className="container">
        <ScrollReveal>
          <div className="section-header">
            <span className="section-badge">✦ Portfolio</span>
            <h2 className="section-title">Our Featured Projects</h2>
            <p className="section-subtitle">
              Real-world solutions that delivered measurable results for our clients.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="portfolio-filters">
            {categories.map((c) => (
              <button
                key={c}
                className={`portfolio-filter ${filter === c ? 'active' : ''}`}
                onClick={() => setFilter(c)}
              >
                {c === 'all' ? 'All Projects' : c.toUpperCase()}
              </button>
            ))}
          </div>
        </ScrollReveal>

        <div className="portfolio-grid">
          {filtered.map((p, i) => (
            <ScrollReveal key={p.id} delay={Math.min((i % 3) + 1, 3) as 1 | 2 | 3}>
              <div className="portfolio-card">
                <div className="portfolio-image">
                  {p.image_url ? (() => {
                    const url = p.image_url;
                    const hash = url.split('#')[1];
                    const cleanUrl = url.split('#')[0];
                    const params = new URLSearchParams(hash || '');
                    const fit = params.get('fit') || 'cover';
                    const pos = params.get('pos') || 'center';

                    return (
                      <img 
                        src={cleanUrl} 
                        alt={p.title} 
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: fit as any, 
                          objectPosition: pos 
                        }} 
                      />
                    );
                  })() : (
                    categoryIcons[p.category] || '📦'
                  )}
                  <div className="portfolio-overlay">
                    <Link href={`/projects/${p.id}`} className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '0.85rem' }}>
                      View Details
                    </Link>
                  </div>
                </div>
                <div className="portfolio-body">
                  <h3 className="portfolio-title">{p.title}</h3>
                  <p className="portfolio-client">{p.client}</p>
                  <div className="portfolio-tech">
                    {p.technology.map((t) => (
                      <span className="portfolio-tech-tag" key={t}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
