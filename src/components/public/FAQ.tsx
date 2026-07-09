'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import ScrollReveal from './ScrollReveal';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export default function FAQ() {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from('faqs')
      .select('*')
      .order('sort_order')
      .then(({ data }) => {
        if (data) setFaqs(data);
      });
  }, []);

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="section" id="faq">
      <div className="container">
        <ScrollReveal>
          <div className="section-header">
            <span className="section-badge">✦ FAQ</span>
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-subtitle">
              Everything you need to know about working with Hanxcel AI Technologies.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="faq-list">
            {faqs.map((faq) => (
              <div
                className={`faq-item ${openId === faq.id ? 'open' : ''}`}
                key={faq.id}
              >
                <button
                  className="faq-question"
                  onClick={() => toggle(faq.id)}
                >
                  <span>{faq.question}</span>
                  <span className="faq-icon">+</span>
                </button>
                <div className="faq-answer">
                  <div className="faq-answer-inner">{faq.answer}</div>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
