'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import ScrollReveal from './ScrollReveal';

interface Product {
  id: string;
  title: string;
  description: string;
  features: string[];
  technologies: string[];
  image_url: string | null;
  status: string;
}

const productIcons: Record<string, string> = {
  'Fleet Management Platform': '🚛',
  'AI Attendance System': '👤',
  'Smart Surveillance': '📹',
  'Industrial IoT Platform': '🏭',
};

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    supabase
      .from('products')
      .select('*')
      .order('sort_order')
      .then(({ data }) => {
        if (data) setProducts(data);
      });
  }, []);

  const statusLabel: Record<string, string> = {
    live: 'Live',
    beta: 'Beta',
    coming_soon: 'Coming Soon',
  };

  return (
    <section className="section" id="products">
      <div className="container">
        <ScrollReveal>
          <div className="section-header">
            <span className="section-badge">✦ Our Products</span>
            <h2 className="section-title">Ready-to-Deploy Product Suite</h2>
            <p className="section-subtitle">
              Battle-tested products built with enterprise-grade AI, ready for immediate deployment.
            </p>
          </div>
        </ScrollReveal>

        <div className="products-grid">
          {products.map((p, i) => (
            <ScrollReveal key={p.id} delay={Math.min(i + 1, 4) as 1 | 2 | 3 | 4}>
              <div className="product-card">
                <div className="product-image">
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
                    productIcons[p.title] || '📦'
                  )}
                  <span className={`product-status ${p.status}`}>
                    {statusLabel[p.status] || p.status}
                  </span>
                </div>
                <div className="product-body">
                  <h3 className="product-title">{p.title}</h3>
                  <p className="product-desc">{p.description}</p>
                  <ul className="product-features">
                    {p.features.slice(0, 4).map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                  <div className="product-tech-tags">
                    {p.technologies.map((t) => (
                      <span className="product-tech-tag" key={t}>{t}</span>
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
