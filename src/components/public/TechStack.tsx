'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import ScrollReveal from './ScrollReveal';

interface TechItem {
  id: string;
  name: string;
  icon: string;
  category: string;
}

const categoryLabels: Record<string, string> = {
  frontend: '🖥️ Frontend',
  backend: '⚙️ Backend',
  cloud: '☁️ Cloud & DevOps',
  ai: '🧠 AI & Machine Learning',
  iot: '📡 IoT & Hardware',
};

const categoryOrder = ['frontend', 'backend', 'cloud', 'ai', 'iot'];

export default function TechStack() {
  const [techs, setTechs] = useState<TechItem[]>([]);

  useEffect(() => {
    supabase
      .from('tech_stack')
      .select('*')
      .order('sort_order')
      .then(({ data }) => {
        if (data) setTechs(data);
      });
  }, []);

  const grouped = categoryOrder.map((cat) => ({
    category: cat,
    label: categoryLabels[cat],
    items: techs.filter((t) => t.category === cat),
  })).filter((g) => g.items.length > 0);

  return (
    <section className="section" id="tech-stack">
      <div className="container">
        <ScrollReveal>
          <div className="section-header">
            <span className="section-badge">✦ Technology Stack</span>
            <h2 className="section-title">Powered by Modern Technologies</h2>
            <p className="section-subtitle">
              We use the best tools and frameworks to deliver exceptional results.
            </p>
          </div>
        </ScrollReveal>

        <div className="tech-categories">
          {grouped.map((group, gi) => (
            <ScrollReveal key={group.category} delay={Math.min(gi + 1, 4) as 1 | 2 | 3 | 4}>
              <>
                {gi > 0 && (
                  <div className="tech-connector">
                    <div className="tech-connector-line" />
                  </div>
                )}
                <div className="tech-category">
                  <span className="tech-category-label">{group.label}</span>
                  <div className="tech-items">
                    {group.items.map((t) => (
                      <div className="tech-item" key={t.id}>
                        <span className="tech-item-icon">{t.icon}</span>
                        <span className="tech-item-name">{t.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
