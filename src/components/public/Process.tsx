import ScrollReveal from './ScrollReveal';

export default function Process() {
  const steps = [
    { icon: '🔍', title: 'Discovery', desc: 'Understanding your needs' },
    { icon: '📋', title: 'Research', desc: 'Market & tech analysis' },
    { icon: '🎨', title: 'Design', desc: 'UI/UX prototyping' },
    { icon: '💻', title: 'Development', desc: 'Agile engineering' },
    { icon: '🧪', title: 'Testing', desc: 'Quality assurance' },
    { icon: '🚀', title: 'Deployment', desc: 'Production launch' },
    { icon: '🛠️', title: 'Support', desc: '24/7 maintenance' },
  ];

  return (
    <section className="section" id="process">
      <div className="container">
        <ScrollReveal>
          <div className="section-header">
            <span className="section-badge">✦ Our Process</span>
            <h2 className="section-title">How We Build Your Vision</h2>
            <p className="section-subtitle">
              A proven 7-step development methodology that ensures quality, transparency, and on-time delivery.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="process-timeline">
            {steps.map((s, i) => (
              <div className="process-step" key={i}>
                <div className="process-step-icon">{s.icon}</div>
                <div className="process-step-title">{s.title}</div>
                <div className="process-step-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
