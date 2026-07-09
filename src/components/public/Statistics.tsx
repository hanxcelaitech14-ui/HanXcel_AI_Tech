'use client';
import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface StatItem {
  id: string;
  label: string;
  value: number;
  suffix: string;
  icon: string;
  sort_order: number;
}

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 2000;
          const steps = 60;
          const increment = target / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div ref={ref} className="stat-number">
      {count}{suffix}
    </div>
  );
}

export default function Statistics() {
  const [stats, setStats] = useState<StatItem[]>([]);

  useEffect(() => {
    supabase
      .from('statistics')
      .select('*')
      .order('sort_order')
      .then(({ data }) => {
        if (data) setStats(data);
      });
  }, []);

  const fallback: StatItem[] = [
    { id: '1', label: 'Projects Delivered', value: 150, suffix: '+', icon: '📊', sort_order: 1 },
    { id: '2', label: 'Happy Clients', value: 50, suffix: '+', icon: '😊', sort_order: 2 },
    { id: '3', label: 'Countries Served', value: 12, suffix: '+', icon: '🌍', sort_order: 3 },
    { id: '4', label: 'Technologies Used', value: 25, suffix: '+', icon: '⚙️', sort_order: 4 },
    { id: '5', label: 'Team Members', value: 30, suffix: '+', icon: '👨‍💻', sort_order: 5 },
    { id: '6', label: 'Years Experience', value: 5, suffix: '+', icon: '🏆', sort_order: 6 },
  ];

  const data = stats.length > 0 ? stats : fallback;

  return (
    <section className="section stats-section" id="stats">
      <div className="container">
        <div className="stats-grid">
          {data.map((s) => (
            <div className="stat-item" key={s.id}>
              <span className="stat-icon">{s.icon}</span>
              <AnimatedCounter target={s.value} suffix={s.suffix} />
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
