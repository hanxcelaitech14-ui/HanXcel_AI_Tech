'use client';
import { useState } from 'react';
import ScrollReveal from './ScrollReveal';

interface FlowStep {
  id: number;
  title: string;
  icon: string;
  short: string;
  detail: string;
}

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

  const flowSteps: FlowStep[] = [
    {
      id: 0,
      title: 'Discovery',
      icon: '🔍',
      short: 'Requirement gathering & alignment',
      detail: 'We collaborate closely with stakeholders to define project objectives, identify target audiences, outline key features, and align on initial success metrics.',
    },
    {
      id: 1,
      title: 'Research',
      icon: '🔬',
      short: 'Market, user & feasibility analysis',
      detail: 'Our team studies competitor solutions, performs user behavior analysis, and runs technical feasibility checks to ensure a solid system foundation.',
    },
    {
      id: 2,
      title: 'UI/UX',
      icon: '🎨',
      short: 'Prototyping & user journey design',
      detail: 'We craft comprehensive wireframes and high-fidelity interactive user interfaces, optimizing user flows, accessibility, and visual aesthetics.',
    },
    {
      id: 3,
      title: 'Planning',
      icon: '📅',
      short: 'Architecture & sprint scheduling',
      detail: 'We map out the database schema, system architecture diagram, API endpoints, deployment plan, and define agile sprint backlog tasks.',
    },
    {
      id: 4,
      title: 'Development',
      icon: '💻',
      short: 'Scalable coding & AI integration',
      detail: 'Our developers build frontend elements and backend business logic, integrating AI modules, optimizing algorithms, and ensuring clean code.',
    },
    {
      id: 5,
      title: 'Git & GitHub',
      icon: '🐙',
      short: 'Version control & security check',
      detail: 'Code changes are tracked using git branches. We conduct automated unit test validation, code quality checks, and secret scans via pull requests.',
    },
    {
      id: 6,
      title: 'Testing',
      icon: '🧪',
      short: 'Quality check & bug verification',
      detail: 'We perform end-to-end user testing across multiple devices, screen widths, and browser contexts, finding and squashing bugs for a stable build.',
    },
    {
      id: 7,
      title: 'Deployment',
      icon: '🚀',
      short: 'Zero-downtime production release',
      detail: 'The release build is validated on a staging environment before being pushed live to production servers with automated zero-downtime pipelines.',
    },
    {
      id: 8,
      title: 'Client Review',
      icon: '🤝',
      short: 'Interactive walkthrough & approval',
      detail: 'We host interactive demo sessions with stakeholders to walk through completed features, collect feedback, and prepare final launches.',
    },
    {
      id: 9,
      title: 'Maintenance',
      icon: '🔧',
      short: 'Updates & continuous monitoring',
      detail: 'Post-launch, we monitor application health, apply security updates, scale servers, optimize database performance, and resolve compatibility updates.',
    },
  ];

  const [activeFlowStep, setActiveFlowStep] = useState<number>(0);

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
          <div className="process-timeline" style={{ marginBottom: '80px' }}>
            {steps.map((s, i) => (
              <div className="process-step" key={i}>
                <div className="process-step-icon">{s.icon}</div>
                <div className="process-step-title">{s.title}</div>
                <div className="process-step-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* Detailed Vertical Flow Chart Section */}
        <ScrollReveal>
          <div className="flow-section">
            <div className="flow-header">
              <h3 className="flow-section-title">Interactive Lifecycle Flowchart</h3>
              <p className="flow-section-subtitle">Click on any step of our engineering lifecycle to explore details</p>
            </div>

            <div className="flow-layout">
              {/* Left Column: Interactive flow list */}
              <div className="flow-list">
                {flowSteps.map((step, index) => (
                  <div key={step.id} className="flow-step-wrapper">
                    <button
                      className={`flow-step-button ${activeFlowStep === index ? 'active' : ''}`}
                      onClick={() => setActiveFlowStep(index)}
                      aria-expanded={activeFlowStep === index}
                    >
                      <div className="flow-step-num">{index + 1}</div>
                      <div className="flow-step-btn-content">
                        <span className="flow-step-btn-title">
                          <span style={{ marginRight: '8px' }}>{step.icon}</span>
                          {step.title}
                        </span>
                        <span className="flow-step-btn-short">{step.short}</span>
                      </div>
                    </button>
                    {index < flowSteps.length - 1 && (
                      <div className="flow-connector">
                        <span className="flow-connector-line">│</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Right Column: Static / Animated Detail Card */}
              <div className="flow-detail-card-container">
                <div className="flow-detail-card glass-card">
                  <div className="flow-detail-icon">{flowSteps[activeFlowStep].icon}</div>
                  <div className="flow-detail-badge">Step {activeFlowStep + 1} of 10</div>
                  <h4 className="flow-detail-title">{flowSteps[activeFlowStep].title}</h4>
                  <p className="flow-detail-short">{flowSteps[activeFlowStep].short}</p>
                  <div className="flow-detail-divider" />
                  <p className="flow-detail-desc">{flowSteps[activeFlowStep].detail}</p>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

