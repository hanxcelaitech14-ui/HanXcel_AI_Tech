'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { validateEmail } from '@/lib/validateEmail';
import ScrollReveal from './ScrollReveal';

const stepLabels = ['Personal', 'Project', 'Requirements', 'Files', 'Services', 'Review'];

export default function ProjectForm() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [personal, setPersonal] = useState({ name: '', email: '', phone: '', company: '' });
  const [project, setProject] = useState({ type: 'Web Application', budget: '', timeline: '' });
  const [requirements, setRequirements] = useState({ description: '', features: [] as string[] });
  const [services, setServices] = useState<string[]>([]);
  const [emailError, setEmailError] = useState('');

  const featureOptions = ['AI/ML Integration', 'User Authentication', 'Payment Gateway', 'Real-time Chat', 'Dashboard/Analytics', 'Mobile App', 'API Development', 'Cloud Hosting'];
  const serviceOptions = ['UI/UX Design', 'SEO Optimization', 'Maintenance & Support', 'DevOps Setup', 'Security Audit', 'Training & Documentation'];

  const nextStep = () => {
    // Validate email on Personal step before proceeding
    if (step === 0) {
      if (!personal.name.trim()) return;
      const emailCheck = validateEmail(personal.email);
      if (!emailCheck.valid) {
        setEmailError(emailCheck.error);
        return;
      }
      setEmailError('');
    }
    setStep((s) => Math.min(s + 1, 5));
  };
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  const toggleFeature = (f: string) => {
    setRequirements((r) => ({
      ...r,
      features: r.features.includes(f) ? r.features.filter((x) => x !== f) : [...r.features, f],
    }));
  };

  const toggleService = (s: string) => {
    setServices((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);
  };

  const handleSubmit = async () => {
    setLoading(true);
    await supabase.from('project_inquiries').insert({
      personal_details: personal,
      project_info: project,
      requirements: requirements,
      additional_services: services,
    });
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section className="section" id="project">
        <div className="container">
          <div className="form-success">
            <div className="success-icon">🎉</div>
            <h3>Project Inquiry Submitted!</h3>
            <p>Thank you for choosing Hanxcel AI. Our team will review your inquiry and get back to you within 24 hours.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section" id="project">
      <div className="container">
        <ScrollReveal>
          <div className="section-header">
            <span className="section-badge">✦ Start Your Project</span>
            <h2 className="section-title">Let&apos;s Build Something Amazing</h2>
            <p className="section-subtitle">
              Tell us about your project and we&apos;ll create a tailored solution for your business.
            </p>
          </div>
        </ScrollReveal>

        <div className="form-wizard">
          {/* Progress */}
          <div className="form-progress">
            <div className="form-progress-bar" style={{ width: `${(step / 5) * 90}%` }} />
            {stepLabels.map((label, i) => (
              <div
                key={label}
                className={`form-step-indicator ${i === step ? 'active' : ''} ${i < step ? 'completed' : ''}`}
              >
                <div className="form-step-dot">{i < step ? '✓' : i + 1}</div>
                <div className="form-step-label">{label}</div>
              </div>
            ))}
          </div>

          {/* Step 0: Personal */}
          {step === 0 && (
            <div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input className="form-input" value={personal.name} onChange={(e) => setPersonal({ ...personal, name: e.target.value })} placeholder="John Doe" />
                </div>
                <div className="form-group">
                  <label className="form-label">Email *</label>
                  <input className="form-input" type="email" value={personal.email} onChange={(e) => { setPersonal({ ...personal, email: e.target.value }); setEmailError(''); }} placeholder="john@company.com" style={emailError ? { borderColor: '#ff5f57' } : {}} />
                  {emailError && <span style={{ color: '#ff5f57', fontSize: '0.82rem', marginTop: 4, display: 'block' }}>{emailError}</span>}
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input className="form-input" value={personal.phone} onChange={(e) => setPersonal({ ...personal, phone: e.target.value })} placeholder="+91 98765 43210" />
                </div>
                <div className="form-group">
                  <label className="form-label">Company</label>
                  <input className="form-input" value={personal.company} onChange={(e) => setPersonal({ ...personal, company: e.target.value })} placeholder="Company Name" />
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Project */}
          {step === 1 && (
            <div>
              <div className="form-group">
                <label className="form-label">Project Type *</label>
                <select className="form-select" value={project.type} onChange={(e) => setProject({ ...project, type: e.target.value })}>
                  <option>Web Application</option>
                  <option>Mobile Application</option>
                  <option>AI/ML Solution</option>
                  <option>IoT Platform</option>
                  <option>Enterprise Software</option>
                  <option>Cloud Migration</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Budget Range</label>
                  <select className="form-select" value={project.budget} onChange={(e) => setProject({ ...project, budget: e.target.value })}>
                    <option value="">Select budget</option>
                    <option>₹1L - ₹5L</option>
                    <option>₹5L - ₹15L</option>
                    <option>₹15L - ₹50L</option>
                    <option>₹50L+</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Timeline</label>
                  <select className="form-select" value={project.timeline} onChange={(e) => setProject({ ...project, timeline: e.target.value })}>
                    <option value="">Select timeline</option>
                    <option>1-3 Months</option>
                    <option>3-6 Months</option>
                    <option>6-12 Months</option>
                    <option>Ongoing</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Requirements */}
          {step === 2 && (
            <div>
              <div className="form-group">
                <label className="form-label">Project Description *</label>
                <textarea className="form-textarea" value={requirements.description} onChange={(e) => setRequirements({ ...requirements, description: e.target.value })} placeholder="Describe your project, goals, and any specific requirements..." />
              </div>
              <div className="form-group">
                <label className="form-label">Required Features</label>
                <div className="checkbox-group">
                  {featureOptions.map((f) => (
                    <label className={`checkbox-item ${requirements.features.includes(f) ? 'checked' : ''}`} key={f}>
                      <input type="checkbox" checked={requirements.features.includes(f)} onChange={() => toggleFeature(f)} />
                      {f}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Files */}
          {step === 3 && (
            <div>
              <div className="form-group">
                <label className="form-label">Upload Reference Files (Optional)</label>
                <div className="upload-area">
                  <div className="upload-icon">📁</div>
                  <div className="upload-text">Drag & drop files here or click to browse</div>
                  <div className="upload-subtext">PDF, DOC, images up to 10MB each</div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Services */}
          {step === 4 && (
            <div>
              <div className="form-group">
                <label className="form-label">Additional Services</label>
                <div className="checkbox-group">
                  {serviceOptions.map((s) => (
                    <label className={`checkbox-item ${services.includes(s) ? 'checked' : ''}`} key={s}>
                      <input type="checkbox" checked={services.includes(s)} onChange={() => toggleService(s)} />
                      {s}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Review */}
          {step === 5 && (
            <div>
              <div className="review-section">
                <h4>Personal Details</h4>
                <div className="review-item"><span className="label">Name</span><span className="value">{personal.name || '—'}</span></div>
                <div className="review-item"><span className="label">Email</span><span className="value">{personal.email || '—'}</span></div>
                <div className="review-item"><span className="label">Phone</span><span className="value">{personal.phone || '—'}</span></div>
                <div className="review-item"><span className="label">Company</span><span className="value">{personal.company || '—'}</span></div>
              </div>
              <div className="review-section">
                <h4>Project Information</h4>
                <div className="review-item"><span className="label">Type</span><span className="value">{project.type}</span></div>
                <div className="review-item"><span className="label">Budget</span><span className="value">{project.budget || '—'}</span></div>
                <div className="review-item"><span className="label">Timeline</span><span className="value">{project.timeline || '—'}</span></div>
              </div>
              <div className="review-section">
                <h4>Requirements</h4>
                <div className="review-item"><span className="label">Features</span><span className="value">{requirements.features.join(', ') || '—'}</span></div>
              </div>
              {services.length > 0 && (
                <div className="review-section">
                  <h4>Additional Services</h4>
                  <div className="review-item"><span className="label">Selected</span><span className="value">{services.join(', ')}</span></div>
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="form-buttons">
            {step > 0 ? (
              <button className="btn btn-outline" onClick={prevStep}>← Previous</button>
            ) : <div />}
            {step < 5 ? (
              <button className="btn btn-primary" onClick={nextStep}>Next →</button>
            ) : (
              <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Inquiry ✦'}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
