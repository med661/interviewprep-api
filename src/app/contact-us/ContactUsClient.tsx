'use client';

import { useState } from 'react';
import api from '@/lib/api';
import { Loader2 } from 'lucide-react';

export default function ContactUsClient() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      await api.post('/contact', formData);
      setSubmitted(true);
    } catch (err) {
      setError('Failed to send message. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-foreground">Contact Us</h1>
        
        <div className="grid md:grid-cols-2 gap-12">
          <div className="prose prose-lg dark:prose-invert">
            <p>
              Have a question, feedback, or suggestion? We'd love to hear from you! 
              Fill out the form or reach out to us directly via email.
            </p>
            
            <h3>Email Us</h3>
            <p>
              <a href="mailto:support@interviewprep.com">support@interviewprep.com</a>
            </p>

            <h3>Business Hours</h3>
            <p>
              Monday - Friday: 9:00 AM - 5:00 PM (EST)<br />
              Weekend: Closed
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            {submitted ? (
              <div className="text-center py-12 animate-in fade-in zoom-in-95 duration-500">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                   <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                   </svg>
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Message Sent!</h3>
                <p className="text-slate-600 dark:text-slate-300 mb-6">
                  Thank you for reaching out. We'll get back to you as soon as possible.
                </p>
                <button 
                  onClick={() => {
                     setSubmitted(false);
                     setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
                  }}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm">
                        {error}
                    </div>
                )}
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">Name</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required 
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none transition-all text-foreground"
                    placeholder="Your Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">Email</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required 
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none transition-all text-foreground"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">Subject</label>
                    <select 
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none transition-all text-foreground"
                    >
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Support">Support</option>
                        <option value="Feedback">Feedback</option>
                        <option value="Business">Business</option>
                    </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">Message</label>
                  <textarea 
                    rows={5} 
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required 
                    minLength={10}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none transition-all text-foreground resize-none"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
