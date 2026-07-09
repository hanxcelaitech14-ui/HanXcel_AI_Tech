import { supabase } from '@/lib/supabase';
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
      <div className="container" style={{ paddingTop: 160, paddingBottom: 80, textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 16, background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--text-secondary) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Post Not Found</h1>
        <p style={{ color: 'var(--text-tertiary)', marginBottom: 32, maxWidth: 450 }}>The blog post you are looking for might have been removed or its URL might have changed.</p>
        <Link href="/" className="btn btn-primary">← Back to Home</Link>
      </div>
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

  return (
    <div className="container" style={{ paddingBottom: 100 }}>
      <Link href="/#blog" className="blog-back">← Back to Blog</Link>
      
      <article className="blog-post" style={{ paddingTop: 20 }}>
        <header className="blog-post-header">
          {category && (
            <span className="blog-post-category">{category.name}</span>
          )}
          <h1 className="blog-post-title" style={{ marginTop: 12, marginBottom: 20 }}>{post.title}</h1>
          <div className="blog-post-meta" style={{ marginBottom: 40 }}>
            {post.published_at &&
              new Date(post.published_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
          </div>
        </header>

        {post.cover_image && (
          <div className="blog-post-cover">
            <img src={post.cover_image} alt={post.title} />
          </div>
        )}

        <div
          className="blog-post-content"
          dangerouslySetInnerHTML={{ __html: renderContent(post.content || '') }}
        />
      </article>
    </div>
  );
}
