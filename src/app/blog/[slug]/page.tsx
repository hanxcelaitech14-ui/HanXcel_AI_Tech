import { supabase } from '@/lib/supabase';
import Navbar from '@/components/public/Navbar';
import ParticleBackground from '@/components/public/ParticleBackground';
import Footer from '@/components/public/Footer';
import Link from 'next/link';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  const { data: post } = await supabase
    .from('blog_posts')
    .select('*, blog_categories(name, slug)')
    .eq('slug', decodedSlug)
    .eq('published', true)
    .single();

  if (!post) {
    return (
      <>
        <ParticleBackground />
        <Navbar />
        <div className="container" style={{ paddingTop: 160, paddingBottom: 80, textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 16, background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--text-secondary) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Post Not Found</h1>
          <p style={{ color: 'var(--text-tertiary)', marginBottom: 32, maxWidth: 450 }}>The blog post you are looking for might have been removed or its URL might have changed.</p>
          <Link href="/" className="btn btn-primary">← Back to Home</Link>
        </div>
        <Footer />
      </>
    );
  }

  const category = post.blog_categories as { name: string; slug: string } | null;

  // Comprehensive markdown-to-HTML parser for rich styling
  const renderContent = (content: string) => {
    if (!content) return '';
    
    // 1. Normalize literal \n characters (common in DB entries) to actual newlines
    let text = content.replace(/\\n/g, '\n');
    
    // 2. Parse inline styling (bold, italic)
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // 3. Process block elements line-by-line
    const lines = text.split('\n');
    let inList = false;
    const htmlLines: string[] = [];
    
    for (let line of lines) {
      const trimmed = line.trim();
      
      // Handle list items
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        if (!inList) {
          htmlLines.push('<ul>');
          inList = true;
        }
        htmlLines.push(`<li>${trimmed.slice(2)}</li>`);
        continue;
      } else {
        if (inList) {
          htmlLines.push('</ul>');
          inList = false;
        }
      }
      
      // Handle headers and blocks
      if (trimmed.startsWith('# ')) {
        htmlLines.push(`<h1>${trimmed.slice(2)}</h1>`);
      } else if (trimmed.startsWith('## ')) {
        htmlLines.push(`<h2>${trimmed.slice(3)}</h2>`);
      } else if (trimmed.startsWith('### ')) {
        htmlLines.push(`<h3>${trimmed.slice(4)}</h3>`);
      } else if (trimmed.startsWith('#### ')) {
        htmlLines.push(`<h4>${trimmed.slice(5)}</h4>`);
      } else if (trimmed.startsWith('##### ')) {
        htmlLines.push(`<h5>${trimmed.slice(6)}</h5>`);
      } else if (trimmed === '') {
        // Render spacing for empty line breaks
        htmlLines.push('<br/>');
      } else {
        htmlLines.push(`<p>${trimmed}</p>`);
      }
    }
    
    if (inList) {
      htmlLines.push('</ul>');
    }
    
    return htmlLines.join('\n');
  };

  const readingTime = Math.max(1, Math.ceil((post.content || '').split(/\s+/).length / 200));

  return (
    <>
      <ParticleBackground />
      <Navbar />

      <main style={{ paddingTop: 140, paddingBottom: 100 }}>
        <div className="container">
          <Link href="/#blog" className="blog-back" style={{ marginBottom: 30, display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--color-primary)', fontWeight: 600 }}>
            ← Back to Blog
          </Link>

          <div style={{ display: 'grid', gridTemplateColumns: '3fr 1.2fr', gap: 48, marginTop: 10 }} className="project-detail-layout">
            {/* Left Column - Main content */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                {category && (
                  <span style={{ padding: '6px 16px', background: 'rgba(0, 212, 255, 0.15)', border: '1px solid rgba(0, 212, 255, 0.25)', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
                    {category.name}
                  </span>
                )}
                <span style={{ fontSize: '0.9rem', color: 'var(--text-tertiary)' }}>Blog Post</span>
              </div>

              <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, marginBottom: 24, lineHeight: 1.2 }}>
                {post.title}
              </h1>

              {/* Cover Image Frame */}
              {post.cover_image && (
                <div className="blog-post-cover" style={{ height: 400, borderRadius: 'var(--radius-xl)', overflow: 'hidden', border: '1px solid var(--glass-border)', boxShadow: 'var(--shadow-lg)', marginBottom: 40, background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={post.cover_image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}

              <div className="blog-post-content" style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.8 }} dangerouslySetInnerHTML={{ __html: renderContent(post.content || '') }} />
            </div>

            {/* Right Column - Sidebar info card */}
            <div>
              <div style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-lg)', padding: 32, position: 'sticky', top: 100, backdropFilter: 'blur(20px)' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: 20, color: 'var(--text-primary)' }}>Article Details</h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>Published</span>
                    <strong style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>
                      {post.published_at &&
                        new Date(post.published_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                    </strong>
                  </div>

                  <div>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>Category</span>
                    <strong style={{ fontSize: '1rem', color: 'var(--text-primary)', textTransform: 'uppercase' }}>
                      {category ? category.name : 'General'}
                    </strong>
                  </div>

                  <div>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>Reading Time</span>
                    <strong style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>{readingTime} min read</strong>
                  </div>

                  <div style={{ marginTop: 10, borderTop: '1px solid var(--glass-border)', paddingTop: 20 }}>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 16 }}>
                      Ready to build advanced AI and software engineering solutions?
                    </p>
                    <Link href="/#project" className="btn btn-primary" style={{ width: '100%', fontSize: '0.85rem', textAlign: 'center' }}>
                      Start Your Project
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

