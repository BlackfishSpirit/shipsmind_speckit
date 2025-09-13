"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Phone, Mail } from "lucide-react";
import { useState } from "react";

export function CTASection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email field
    if (!formData.email || !formData.email.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }

    if (!formData.name.trim()) {
      alert('Please enter your name');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Send email using a service like EmailJS or form handler
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          to: 'admin@shipsmind.com'
        }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <section id="contact" className="py-24 bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          {/* Main CTA Content */}
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-6">
            Ready to See What AI Can Do for You?
          </h2>
          

          {/* Contact Form */}
          <div className="mt-10">
            <div className="bg-white rounded-xl p-8 max-w-lg mx-auto text-left shadow-2xl">
              {submitStatus === 'success' ? (
                <div className="text-center py-8">
                  <div className="mb-4">
                    <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Thank you!</h3>
                  <p className="text-gray-600">We'll be in touch within 24 hours to discuss how we can help automate your business.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Full Name *</label>
                    <input 
                      type="text" 
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500" 
                      placeholder="Jane Doe"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email Address *</label>
                    <input 
                      type="email" 
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500" 
                      placeholder="jane.doe@example.com"
                    />
                  </div>
                  <div className="mb-6">
                    <label htmlFor="message" className="block text-gray-700 font-medium mb-2">What's your biggest operational challenge?</label>
                    <textarea 
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={4} 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500" 
                      placeholder="e.g., 'We spend too much time manually entering order data.'"
                    />
                  </div>
                  {submitStatus === 'error' && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-600 text-sm">There was an error sending your message. Please try again or email us directly at admin@shipsmind.com</p>
                    </div>
                  )}
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-brand-600 text-white font-semibold rounded-full px-8 py-3 hover:bg-brand-700 transition-all text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Sending...' : "Let's get started"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <svg
          className="absolute left-[max(50%,25rem)] top-0 h-[64rem] w-[128rem] -translate-x-1/2 stroke-brand-500/20 [mask-image:radial-gradient(64rem_64rem_at_top,white,transparent)]"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="cta-pattern"
              width={200}
              height={200}
              x="50%"
              y={-1}
              patternUnits="userSpaceOnUse"
            >
              <path d="M100 200V.5M.5 .5H200" fill="none" />
            </pattern>
          </defs>
          <rect
            width="100%"
            height="100%"
            strokeWidth={0}
            fill="url(#cta-pattern)"
          />
        </svg>
      </div>

      {/* Decorative Elements */}
      <div className="absolute -top-4 -left-4 h-24 w-24 bg-brand-400/20 rounded-full"></div>
      <div className="absolute -bottom-8 -right-8 h-32 w-32 bg-brand-400/10 rounded-full"></div>
    </section>
  );
}