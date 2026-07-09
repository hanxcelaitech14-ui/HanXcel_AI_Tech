import ScrollReveal from './ScrollReveal';

export default function WhyUs() {
  const features = [
    { icon: '🤖', title: 'AI First', desc: 'Every solution we build is powered by artificial intelligence — from predictive analytics to computer vision and NLP.' },
    { icon: '☁️', title: 'Cloud Native', desc: 'Built for the cloud from day one. Our solutions leverage AWS, Azure, and modern serverless architectures for maximum scalability.' },
    { icon: '🛡️', title: 'Enterprise Security', desc: 'End-to-end encryption, OWASP compliance, and regular audits ensure your data and applications remain fortress-secure.' },
    { icon: '⚡', title: 'High Performance', desc: 'Optimized for speed and efficiency. Our solutions handle millions of requests with sub-second response times.' },
    { icon: '📈', title: 'Scalable Architecture', desc: 'Microservices, containerization, and auto-scaling ensure your applications grow seamlessly with your business.' },
    { icon: '🎯', title: 'Dedicated Support', desc: '24/7 monitoring, proactive maintenance, and a dedicated team ensuring your systems run flawlessly at all times.' },
  ];

  return (
    <section className="section" id="why-us">
      <div className="container">
        <ScrollReveal>
          <div className="section-header">
            <span className="section-badge">✦ Why Choose Us</span>
            <h2 className="section-title">Why Hanxcel AI Technologies?</h2>
            <p className="section-subtitle">
              Six pillars that make us the preferred technology partner for enterprises worldwide.
            </p>
          </div>
        </ScrollReveal>

        <div className="features-grid">
          {features.map((f, i) => (
            <ScrollReveal key={f.title} delay={Math.min(i + 1, 4) as 1 | 2 | 3 | 4}>
              <div className="feature-card">
                <div className="feature-card-inner">
                  <span className="feature-icon">{f.icon}</span>
                  <h3 className="feature-title">{f.title}</h3>
                  <p className="feature-desc">{f.desc}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
