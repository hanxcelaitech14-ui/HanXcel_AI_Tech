'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import ScrollReveal from './ScrollReveal';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  photo_url: string | null;
}

const roleIcons: Record<string, string> = {
  'CEO & Founder': '👔',
  'CTO': '🧑‍💻',
  'Lead Developer': '⚡',
  'AI Research Lead': '🧠',
};

export default function Company() {
  const [team, setTeam] = useState<TeamMember[]>([]);

  useEffect(() => {
    supabase
      .from('team_members')
      .select('*')
      .order('sort_order')
      .then(({ data }) => {
        if (data) setTeam(data);
      });
  }, []);

  return (
    <section className="section" id="company">
      <div className="container">
        <ScrollReveal>
          <div className="section-header">
            <span className="section-badge">✦ Our Company</span>
            <h2 className="section-title">Meet the Team Behind Hanxcel AI</h2>
            <p className="section-subtitle">
              A passionate team of engineers, researchers, and innovators building the future of technology.
            </p>
          </div>
        </ScrollReveal>

        <div className="team-grid">
          {team.map((m, i) => (
            <ScrollReveal key={m.id} delay={Math.min(i + 1, 4) as 1 | 2 | 3 | 4}>
              <div className="team-card">
                <div className="team-avatar">
                  {m.photo_url ? (() => {
                    const url = m.photo_url;
                    const hash = url.split('#')[1];
                    const cleanUrl = url.split('#')[0];
                    const params = new URLSearchParams(hash || '');
                    const fit = params.get('fit') || 'cover';
                    const pos = params.get('pos') || 'center';

                    return (
                      <img 
                        src={cleanUrl} 
                        alt={m.name} 
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: fit as any, 
                          objectPosition: pos, 
                          borderRadius: '50%' 
                        }} 
                      />
                    );
                  })() : (
                    roleIcons[m.role] || '👤'
                  )}
                </div>
                <h3 className="team-name">{m.name}</h3>
                <div className="team-role">{m.role}</div>
                <p className="team-bio">{m.bio}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
