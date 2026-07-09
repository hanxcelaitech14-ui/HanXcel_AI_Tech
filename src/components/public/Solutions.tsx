'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import ScrollReveal from './ScrollReveal';

interface Solution {
  id: string;
  title: string;
  industry: string;
  description: string;
  image_url: string | null;
  steps: { title: string; desc: string }[];
}

const industryIcons: Record<string, string> = {
  Healthcare: '🏥',
  Finance: '💰',
  Manufacturing: '🏭',
  Logistics: '🚚',
  Education: '🎓',
  Retail: '🛒',
};

export default function Solutions() {
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    supabase
      .from('solutions')
      .select('*')
      .order('sort_order')
      .then(({ data }) => {
        if (data) setSolutions(data);
      });
  }, []);

  const fallback: Solution[] = [
    { id: '1', title: 'Healthcare AI', industry: 'Healthcare', description: 'Transforming healthcare with AI.', image_url: null, steps: [{ title: 'AI Diagnosis', desc: 'ML-powered detection' }, { title: 'Patient Management', desc: 'Smart scheduling' }, { title: 'Hospital Automation', desc: 'Workflow optimization' }, { title: 'Analytics', desc: 'Real-time insights' }] },
  ];

  const data = solutions.length > 0 ? solutions : fallback;
  const current = data[active];

  if (!current) return null;

  return (
    <section className="section" id="solutions">
      <div className="container">
        <ScrollReveal>
          <div className="section-header">
            <span className="section-badge">✦ Industry Solutions</span>
            <h2 className="section-title">Tailored Solutions for Every Industry</h2>
            <p className="section-subtitle">
              Deep domain expertise combined with cutting-edge technology to solve industry-specific challenges.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="solutions-tabs">
            {data.map((s, i) => (
              <button
                key={s.id}
                className={`solution-tab ${i === active ? 'active' : ''}`}
                onClick={() => setActive(i)}
              >
                {industryIcons[s.industry] || '🏢'} {s.industry}
              </button>
            ))}
          </div>
        </ScrollReveal>

        <div className="solution-content">
          <div className="solution-info">
            <h3>{current.title}</h3>
            <p>{current.description}</p>
            <div className="solution-steps">
              {(current.steps as { title: string; desc: string }[]).map((step, i) => (
                <div className="solution-step" key={i}>
                  <div className="solution-step-num">{i + 1}</div>
                  <div>
                    <div className="solution-step-title">{step.title}</div>
                    <div className="solution-step-desc">{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="solution-visual">
            <div className="solution-illustration">
              {current.image_url ? (() => {
                const url = current.image_url;
                const hash = url.split('#')[1];
                const cleanUrl = url.split('#')[0];
                const params = new URLSearchParams(hash || '');
                const fit = params.get('fit') || 'cover';
                const pos = params.get('pos') || 'center';

                return (
                  <img 
                    src={cleanUrl} 
                    alt={current.title} 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: fit as any, 
                      objectPosition: pos, 
                      borderRadius: 'var(--radius-lg)' 
                    }} 
                  />
                );
              })() : (
                industryIcons[current.industry] || '🏢'
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
