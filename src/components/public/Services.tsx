'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import ScrollReveal from './ScrollReveal';

interface Service {
  id: string;
  title: string;
  icon: string;
  description: string;
  features: string[];
  is_featured: boolean;
}

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    supabase
      .from('services')
      .select('*')
      .order('sort_order')
      .then(({ data }) => {
        if (data) setServices(data);
      });
  }, []);

  const fallback: Service[] = [
    { id: '1', title: 'Artificial Intelligence', icon: '🤖', description: 'Enterprise-grade AI solutions.', features: ['LLM Integration', 'Computer Vision', 'NLP', 'Predictive Analytics'], is_featured: true },
    { id: '2', title: 'Web Development', icon: '🌐', description: 'Full-stack web applications.', features: ['React & Next.js', 'E-Commerce', 'API Development'], is_featured: false },
    { id: '3', title: 'Mobile Applications', icon: '📱', description: 'Native and cross-platform apps.', features: ['React Native', 'Flutter', 'iOS & Android'], is_featured: false },
    { id: '4', title: 'Cloud Solutions', icon: '☁️', description: 'Scalable cloud infrastructure.', features: ['AWS & Azure', 'Kubernetes', 'CI/CD'], is_featured: false },
    { id: '5', title: 'IoT Solutions', icon: '📡', description: 'End-to-end IoT ecosystems.', features: ['MQTT', 'ESP32', 'Real-time Dashboards'], is_featured: false },
    { id: '6', title: 'UI/UX Design', icon: '🎨', description: 'Human-centered design.', features: ['User Research', 'Prototyping', 'Design Systems'], is_featured: false },
    { id: '7', title: 'Automation', icon: '⚡', description: 'Intelligent process automation.', features: ['RPA', 'Workflow Automation', 'Document Processing'], is_featured: false },
    { id: '8', title: 'Enterprise Software', icon: '🏢', description: 'Custom enterprise solutions.', features: ['ERP', 'CRM', 'HRMS'], is_featured: false },
  ];

  const data = services.length > 0 ? services : fallback;

  return (
    <section className="section" id="services">
      <div className="container">
        <ScrollReveal>
          <div className="section-header">
            <span className="section-badge">✦ Our Services</span>
            <h2 className="section-title">Comprehensive Technology Solutions</h2>
            <p className="section-subtitle">
              End-to-end digital services designed to transform your business with cutting-edge technology.
            </p>
          </div>
        </ScrollReveal>

        <div className="services-grid">
          {data.map((s, i) => (
            <ScrollReveal key={s.id} delay={Math.min((i % 4) + 1, 4) as 1 | 2 | 3 | 4}>
              <div className={`service-card ${s.is_featured ? 'featured' : ''}`}>
                <span className="service-icon">{s.icon}</span>
                <h3 className="service-title">{s.title}</h3>
                <p className="service-desc">{s.description}</p>
                <div className="service-features">
                  {s.features.map((f) => (
                    <span className="service-feature-tag" key={f}>{f}</span>
                  ))}
                </div>
                <a href="#contact" className="service-link">
                  Learn More →
                </a>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
