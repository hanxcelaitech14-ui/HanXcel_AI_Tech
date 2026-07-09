import { supabase } from '@/lib/supabase';
import Navbar from '@/components/public/Navbar';
import ParticleBackground from '@/components/public/ParticleBackground';
import Footer from '@/components/public/Footer';
import Link from 'next/link';

interface Props {
  params: Promise<{ id: string }>;
}

const categoryIcons: Record<string, string> = {
  ai: '🤖',
  web: '🌐',
  mobile: '📱',
  iot: '📡',
};

export default async function ProjectDetailPage({ params }: Props) {
  const { id } = await params;

  const { data: project } = await supabase
    .from('portfolio')
    .select('*')
    .eq('id', id)
    .single();

  if (!project) {
    return (
      <>
        <ParticleBackground />
        <Navbar />
        <div className="container" style={{ paddingTop: 160, paddingBottom: 80, textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 16, background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--text-secondary) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Project Not Found</h1>
          <p style={{ color: 'var(--text-tertiary)', marginBottom: 32 }}>The project you are looking for could not be found.</p>
          <Link href="/projects" className="btn btn-primary">← View All Projects</Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <ParticleBackground />
      <Navbar />

      <main style={{ paddingTop: 140, paddingBottom: 100 }}>
        <div className="container">
          <Link href="/#portfolio" className="blog-back" style={{ marginBottom: 30, display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--color-primary)', fontWeight: 600 }}>
            ← Back to Portfolio
          </Link>

          <div style={{ display: 'grid', gridTemplateColumns: '3fr 1.2fr', gap: 48, marginTop: 10 }} className="project-detail-layout">
            {/* Left Column - Main content */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <span style={{ padding: '6px 16px', background: 'rgba(0, 212, 255, 0.15)', border: '1px solid rgba(0, 212, 255, 0.25)', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
                  {project.category}
                </span>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-tertiary)' }}>Case Study</span>
              </div>

              <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, marginBottom: 24, lineHeight: 1.2 }}>
                {project.title}
              </h1>

              {/* Cover Image Frame */}
              <div className="blog-post-cover" style={{ height: 400, borderRadius: 'var(--radius-xl)', overflow: 'hidden', border: '1px solid var(--glass-border)', boxShadow: 'var(--shadow-lg)', marginBottom: 40, background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {project.image_url ? (
                  <img src={project.image_url.split('#')[0]} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: '8rem' }}>{categoryIcons[project.category] || '📦'}</span>
                )}
              </div>

              <div className="blog-post-content" style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.8 }}>
                <h2>Project Overview</h2>
                <p style={{ marginBottom: 24 }}>{project.description}</p>

                <h2>The Challenge</h2>
                <p style={{ marginBottom: 24 }}>
                  The client, {project.client}, faced challenges in scaling their operations and ensuring peak performance. 
                  They required a custom, high-speed, and secure digital solution integrated with modern stack technologies 
                  to streamline their processes and enable real-time analytical monitoring.
                </p>

                <h2>Our Solution</h2>
                <p style={{ marginBottom: 24 }}>
                  Hanxcel AI Technologies designed and implemented a tailor-made system incorporating {project.technology.join(', ')}. 
                  We built robust backend database connectors, responsive modern user interfaces, and custom visual analytics dashboards, 
                  allowing the client to monitor critical performance stats with 99.9% uptime.
                </p>

                <h2>Key Results</h2>
                <ul style={{ paddingLeft: 24, marginBottom: 24, listStyleType: 'disc' }}>
                  <li style={{ marginBottom: 8 }}>Drastically improved system workflow efficiency and data handling operations.</li>
                  <li style={{ marginBottom: 8 }}>Seamless integration with existing enterprise tools.</li>
                  <li style={{ marginBottom: 8 }}>Highly scalable cloud architecture prepared for future data growth.</li>
                </ul>
              </div>
            </div>

            {/* Right Column - Sidebar info card */}
            <div>
              <div style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-lg)', padding: 32, position: 'sticky', top: 100, backdropFilter: 'blur(20px)' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: 20, color: 'var(--text-primary)' }}>Project Details</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>Client</span>
                    <strong style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>{project.client}</strong>
                  </div>

                  <div>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>Category</span>
                    <strong style={{ fontSize: '1rem', color: 'var(--text-primary)', textTransform: 'uppercase' }}>{project.category}</strong>
                  </div>

                  <div>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>Technologies Used</span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {project.technology.map((tech: string) => (
                        <span key={tech} style={{ fontSize: '0.75rem', padding: '4px 10px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--glass-border)', borderRadius: '4px', color: 'var(--text-secondary)' }}>
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {project.link && (
                    <div style={{ marginTop: 10 }}>
                      <a href={project.link} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ width: '100%', textAlign: 'center', fontSize: '0.85rem' }}>
                        Visit Live Site ↗
                      </a>
                    </div>
                  )}

                  <div style={{ marginTop: project.link ? 10 : 20, borderTop: '1px solid var(--glass-border)', paddingTop: 20 }}>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 16 }}>Need a similar digital solution built for your business?</p>
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
