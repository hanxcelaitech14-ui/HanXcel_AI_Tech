'use client';
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import ScrollReveal from './ScrollReveal';

interface Testimonial {
  id: string;
  client_name: string;
  company: string;
  content: string;
  rating: number;
}

export default function Testimonials() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    supabase
      .from('testimonials')
      .select('*')
      .order('sort_order')
      .then(({ data }) => {
        if (data) setItems(data);
      });
  }, []);

  const next = useCallback(() => {
    if (items.length > 0) setActive((a) => (a + 1) % items.length);
  }, [items.length]);

  useEffect(() => {
    if (items.length <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [items.length, next]);

  if (items.length === 0) return null;

  return (
    <section className="section" id="testimonials">
      <div className="container">
        <ScrollReveal>
          <div className="section-header">
            <span className="section-badge">✦ Testimonials</span>
            <h2 className="section-title">What Our Clients Say</h2>
            <p className="section-subtitle">
              Trusted by enterprises across the globe to deliver transformative digital solutions.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="testimonials-carousel">
            <div
              className="testimonials-track"
              style={{ transform: `translateX(-${active * 100}%)` }}
            >
              {items.map((t) => (
                <div className="testimonial-card" key={t.id}>
                  <div className="testimonial-stars">
                    {'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}
                  </div>
                  <p className="testimonial-content">&ldquo;{t.content}&rdquo;</p>
                  <div className="testimonial-author">{t.client_name}</div>
                  <div className="testimonial-company">{t.company}</div>
                </div>
              ))}
            </div>

            <div className="testimonial-dots">
              {items.map((_, i) => (
                <button
                  key={i}
                  className={`testimonial-dot ${i === active ? 'active' : ''}`}
                  onClick={() => setActive(i)}
                  aria-label={`Testimonial ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
