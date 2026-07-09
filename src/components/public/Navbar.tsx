'use client';
import { useEffect, useState } from 'react';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { label: 'Home', href: '#hero' },
    { label: 'About', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Solutions', href: '#solutions' },
    { label: 'Products', href: '#products' },
    { label: 'Portfolio', href: '#portfolio' },
    { label: 'Blog', href: '#blog' },
    { label: 'Company', href: '#company' },
    { label: 'Contact', href: '#contact' },
  ];

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-inner">
          <a href="#hero" className="navbar-logo">
            <img src="/images/logo-icon.png" alt="Hanxcel AI" className="navbar-logo-img" />
            <span>HanXcel AI</span>
          </a>

          <div className="navbar-links">
            {links.map((l) => (
              <a key={l.href} href={l.href}>{l.label}</a>
            ))}
            <a href="#project" className="btn btn-primary navbar-cta">Start Your Project</a>
            <ThemeToggle />
          </div>

          <button
            className={`navbar-toggle ${mobileOpen ? 'active' : ''}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      <div className={`mobile-overlay ${mobileOpen ? 'open' : ''}`} onClick={closeMobile} />
      <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
          <ThemeToggle />
        </div>
        {links.map((l) => (
          <a key={l.href} href={l.href} onClick={closeMobile}>{l.label}</a>
        ))}
        <a href="#project" className="btn btn-primary" style={{ marginTop: 24, width: '100%' }} onClick={closeMobile}>
          Start Your Project
        </a>
      </div>
    </>
  );
}
