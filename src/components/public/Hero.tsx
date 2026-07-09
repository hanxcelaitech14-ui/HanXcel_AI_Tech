'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Hero() {
  const chartBars = [30, 50, 40, 70, 55, 80, 65, 90, 75, 95, 85, 60];

  const [companyName, setCompanyName] = useState('Hanxcel AI Technologies Pvt. Ltd.');
  const [tagline, setTagline] = useState('Engineering Intelligent Digital Solutions for the Future');

  useEffect(() => {
    supabase.from('site_settings').select('key, value').eq('key', 'company').single().then(({ data }) => {
      if (data?.value) {
        if (data.value.name) setCompanyName(data.value.name);
        if (data.value.tagline) setTagline(data.value.tagline);
      }
    });
  }, []);

  // Split tagline into words to apply gradient to middle portion
  const words = tagline.split(' ');
  const midStart = Math.floor(words.length / 3);
  const midEnd = Math.ceil((words.length * 2) / 3);
  const beforeGradient = words.slice(0, midStart).join(' ');
  const gradientText = words.slice(midStart, midEnd).join(' ');
  const afterGradient = words.slice(midEnd).join(' ');

  return (
    <section className="hero" id="hero">
      <div className="hero-bg">
        <div className="mesh-gradient mesh-1" />
        <div className="mesh-gradient mesh-2" />
        <div className="mesh-gradient mesh-3" />
      </div>

      <div className="container">
        <div className="hero-content">
          <div className="hero-text">
            <h1>
              {beforeGradient}{beforeGradient ? ' ' : ''}
              <span className="gradient-text">{gradientText}</span>
              {afterGradient ? ' ' : ''}{afterGradient}
            </h1>
            <p>
              {companyName} builds enterprise-grade AI, software,
              IoT, and cloud solutions that accelerate digital transformation for
              businesses worldwide.
            </p>
            <div className="hero-buttons">
              <a href="#project" className="btn btn-primary">
                Start Your Project ✦
              </a>
              <a href="#services" className="btn btn-outline">
                Explore Services →
              </a>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-dashboard">
              <div className="hero-dashboard-header">
                <span /><span /><span />
              </div>
              <div className="hero-dashboard-body">
                <div className="hero-stat-card">
                  <div className="stat-label">AI Accuracy</div>
                  <div className="stat-value">98.5%</div>
                  <div className="stat-bar">
                    <div className="stat-bar-fill" style={{ '--bar-width': '98%' } as React.CSSProperties} />
                  </div>
                </div>
                <div className="hero-stat-card">
                  <div className="stat-label">Cloud Uptime</div>
                  <div className="stat-value">99.9%</div>
                  <div className="stat-bar">
                    <div className="stat-bar-fill" style={{ '--bar-width': '99%' } as React.CSSProperties} />
                  </div>
                </div>
                <div className="hero-stat-card">
                  <div className="stat-label">IoT Devices</div>
                  <div className="stat-value">5,200</div>
                  <div className="stat-bar">
                    <div className="stat-bar-fill" style={{ '--bar-width': '72%' } as React.CSSProperties} />
                  </div>
                </div>
                <div className="hero-stat-card">
                  <div className="stat-label">Data Processed</div>
                  <div className="stat-value">14TB</div>
                  <div className="stat-bar">
                    <div className="stat-bar-fill" style={{ '--bar-width': '85%' } as React.CSSProperties} />
                  </div>
                </div>
                <div className="hero-chart">
                  {chartBars.map((h, i) => (
                    <div
                      key={i}
                      className="chart-bar"
                      style={{ '--bar-height': `${h}%`, animationDelay: `${i * 0.1}s` } as React.CSSProperties}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="floating-card fc-1">
              <div className="fc-icon">🤖</div>
              <div className="fc-label">ML Model</div>
              <div className="fc-value">Deployed ✓</div>
            </div>
            <div className="floating-card fc-2">
              <div className="fc-icon">📊</div>
              <div className="fc-label">Analytics</div>
              <div className="fc-value">+42% Growth</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
