'use client';
import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import ScrollReveal from './ScrollReveal';

interface Milestone {
  id: string;
  year: string;
  title: string;
  description: string;
}

export default function About() {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    supabase
      .from('milestones')
      .select('*')
      .order('sort_order')
      .then(({ data }) => {
        if (data) setMilestones(data);
      });
  }, []);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollTop > 10);
    setCanScrollRight(el.scrollTop < el.scrollHeight - el.clientHeight - 10);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) el.addEventListener('scroll', checkScroll);
    return () => el?.removeEventListener('scroll', checkScroll);
  }, [milestones]);

  const scroll = (dir: 'up' | 'down') => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ top: dir === 'down' ? 200 : -200, behavior: 'smooth' });
  };

  const values = [
    { icon: '🚀', title: 'Innovation', desc: 'Pushing boundaries with cutting-edge tech' },
    { icon: '🤝', title: 'Partnership', desc: 'Your success is our success' },
    { icon: '🛡️', title: 'Integrity', desc: 'Transparent and ethical practices' },
    { icon: '⚡', title: 'Excellence', desc: 'Delivering quality without compromise' },
  ];

  return (
    <section className="section" id="about">
      <div className="container">
        <ScrollReveal>
          <div className="section-header">
            <span className="section-badge">✦ About Us</span>
            <h2 className="section-title">Building the Future of Enterprise Technology</h2>
            <p className="section-subtitle">
              From our founding vision to global impact — discover the story behind Hanxcel AI Technologies.
            </p>
          </div>
        </ScrollReveal>

        <div className="about-grid">
          <ScrollReveal>
            <div className="about-story">
              <h3>Our Story</h3>
              <p>
                Hanxcel AI Technologies Pvt. Ltd. was born from a simple yet powerful belief: every business
                deserves access to world-class AI and technology solutions. Founded by a team of passionate
                engineers and AI researchers, we set out to bridge the gap between cutting-edge innovation
                and practical business applications.
              </p>
              <p>
                <strong>Our Mission:</strong> To empower organizations with intelligent, scalable, and
                secure digital solutions that drive measurable business impact.
              </p>
              <p>
                <strong>Our Vision:</strong> To be the most trusted AI technology partner for enterprises
                worldwide, making intelligent automation accessible to every industry.
              </p>

              <div className="about-values">
                {values.map((v) => (
                  <div className="about-value-item" key={v.title}>
                    <span className="value-icon">{v.icon}</span>
                    <div className="value-title">{v.title}</div>
                    <div className="value-desc">{v.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={2}>
            <div className="timeline-wrapper">
              {/* Scroll Controls */}
              {canScrollLeft && (
                <button className="timeline-scroll-btn timeline-scroll-up" onClick={() => scroll('up')} aria-label="Scroll up">
                  ↑
                </button>
              )}

              <div className="timeline-scrollable" ref={scrollRef}>
                <div className="timeline">
                  {milestones.map((item) => (
                    <div className="timeline-item" key={item.id}>
                      <div className="timeline-year">{item.year}</div>
                      <div className="timeline-title">{item.title}</div>
                      <div className="timeline-desc">{item.description}</div>
                    </div>
                  ))}
                </div>
              </div>

              {canScrollRight && (
                <button className="timeline-scroll-btn timeline-scroll-down" onClick={() => scroll('down')} aria-label="Scroll down">
                  ↓
                </button>
              )}

              {milestones.length > 4 && (
                <div className="timeline-fade-hint">Scroll to see more ↓</div>
              )}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
