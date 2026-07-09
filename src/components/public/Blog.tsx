'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import ScrollReveal from './ScrollReveal';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image: string | null;
  published_at: string;
  blog_categories: { name: string; slug: string } | null;
}

const categoryIcons: Record<string, string> = {
  ai: '🤖',
  cloud: '☁️',
  iot: '📡',
  cybersecurity: '🛡️',
  'web-development': '🌐',
};

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    supabase
      .from('blog_posts')
      .select('id, title, slug, excerpt, cover_image, published_at, blog_categories(name, slug)')
      .eq('published', true)
      .order('published_at', { ascending: false })
      .limit(6)
      .then(({ data }) => {
        if (data) setPosts(data as unknown as BlogPost[]);
      });
  }, []);

  return (
    <section className="section" id="blog">
      <div className="container">
        <ScrollReveal>
          <div className="section-header">
            <span className="section-badge">✦ Blog & Insights</span>
            <h2 className="section-title">Latest from Our Blog</h2>
            <p className="section-subtitle">
              Insights, tutorials, and thought leadership from our engineering team.
            </p>
          </div>
        </ScrollReveal>

        <div className="blog-grid">
          {posts.map((p, i) => (
            <ScrollReveal key={p.id} delay={Math.min((i % 3) + 1, 3) as 1 | 2 | 3}>
              <a href={`/blog/${p.slug}`} style={{ display: 'block', height: '100%' }}>
                <div className="blog-card">
                  <div className="blog-image">
                    {p.cover_image ? (() => {
                      const url = p.cover_image;
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
                      categoryIcons[p.blog_categories?.slug || ''] || '📝'
                    )}
                    <span className="blog-category-badge">
                      {p.blog_categories?.name || 'General'}
                    </span>
                  </div>
                  <div className="blog-body">
                    <div className="blog-date">
                      {p.published_at
                        ? new Date(p.published_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })
                        : ''}
                    </div>
                    <h3 className="blog-title">{p.title}</h3>
                    <p className="blog-excerpt">{p.excerpt}</p>
                    <span className="blog-read-more">Read More →</span>
                  </div>
                </div>
              </a>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
