'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [companyName, setCompanyName] = useState('Hanxcel AI Technologies Pvt. Ltd.');

  useEffect(() => {
    supabase.from('site_settings').select('key, value').eq('key', 'company').single().then(({ data }) => {
      if (data?.value?.name) setCompanyName(data.value.name);
    });
  }, []);
  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // Simple email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email }]);

      if (error) {
        if (error.code === '23505') { // Postgres code for unique constraint violation
          setStatus('success'); // Soft handle: they are already subscribed
          setMessage('You are already subscribed!');
        } else {
          throw error;
        }
      } else {
        setStatus('success');
        setMessage('Thank you for subscribing!');
        setEmail('');
      }
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="navbar-logo">
              <img src="/images/logo-icon.png" alt="Hanxcel AI" style={{ height: 32 }} />
              <span style={{ background: 'linear-gradient(135deg, #00D4FF, #7B61FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                HanXcel AI
              </span>
            </div>
            <p>
              Engineering intelligent digital solutions for enterprises worldwide.
              AI, Cloud, IoT, and Software — we build the technology that powers
              your business transformation.
            </p>
            <form onSubmit={handleSubscribe} className="footer-newsletter" style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', gap: 8, width: '100%' }}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === 'loading'}
                  style={{ flex: 1 }}
                />
                <button type="submit" disabled={status === 'loading'}>
                  {status === 'loading' ? '...' : 'Subscribe'}
                </button>
              </div>
              {message && (
                <span style={{
                  fontSize: '0.8rem',
                  color: status === 'success' ? 'var(--color-primary)' : '#ff6b6b',
                  marginTop: 4,
                  display: 'block'
                }}>
                  {message}
                </span>
              )}
            </form>
          </div>

          <div className="footer-column">
            <h4>Company</h4>
            <a href="#about">About Us</a>
            <a href="#company">Our Team</a>
            <a href="#portfolio">Portfolio</a>
            <a href="#blog">Blog</a>
            <a href="#">Careers</a>
          </div>

          <div className="footer-column">
            <h4>Services</h4>
            <a href="#services">AI Solutions</a>
            <a href="#services">Web Development</a>
            <a href="#services">Mobile Apps</a>
            <a href="#services">Cloud & DevOps</a>
            <a href="#services">IoT Solutions</a>
          </div>

          <div className="footer-column">
            <h4>Products</h4>
            <a href="#products">Fleet Management</a>
            <a href="#products">AI Attendance</a>
            <a href="#products">Smart Surveillance</a>
            <a href="#products">IoT Platform</a>
          </div>

          <div className="footer-column">
            <h4>Support</h4>
            <a href="#contact">Contact Us</a>
            <a href="#faq">FAQs</a>
            <a href="#">Documentation</a>
            <a href="#">API Reference</a>
            <a href="#">Status Page</a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} {companyName}. All rights reserved.</span>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <div className="system-status">
              <span className="status-dot" />
              <span>All Systems Operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
