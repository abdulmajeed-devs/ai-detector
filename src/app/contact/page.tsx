'use client';

import { useState } from 'react';
import { Mail, MessageSquare, User, Send, CheckCircle2 } from 'lucide-react';
import Header from '@/components/Header';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Demo form - just show success message
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <MessageSquare className="w-12 h-12 text-blue-600" />
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900">Contact Us</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Have questions or feedback? We'd love to hear from you!
          </p>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-blue-100">
          {submitted ? (
            <div className="text-center py-12">
              <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Thank You!</h2>
              <p className="text-lg text-gray-700 mb-2">Your message has been received.</p>
              <p className="text-gray-600">We'll get back to you as soon as possible.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-lg font-semibold text-gray-800 mb-2">
                  <User className="w-5 h-5 inline-block mr-2 text-blue-600" />
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="John Doe"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-lg font-semibold text-gray-800 mb-2">
                  <Mail className="w-5 h-5 inline-block mr-2 text-blue-600" />
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="john@example.com"
                />
              </div>

              {/* Subject */}
              <div>
                <label htmlFor="subject" className="block text-lg font-semibold text-gray-800 mb-2">
                  <MessageSquare className="w-5 h-5 inline-block mr-2 text-blue-600" />
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500 focus:border-blue-500 transition-all"
                >
                  <option value="">Select a subject...</option>
                  <option value="general">General Inquiry</option>
                  <option value="support">Technical Support</option>
                  <option value="feedback">Feedback</option>
                  <option value="partnership">Partnership Opportunity</option>
                  <option value="bug">Report a Bug</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-lg font-semibold text-gray-800 mb-2">
                  <MessageSquare className="w-5 h-5 inline-block mr-2 text-blue-600" />
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={8}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all"
                  placeholder="Tell us how we can help you..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-8 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Send className="w-6 h-6" />
                Send Message
              </button>
            </form>
          )}
        </div>

        {/* Additional Info */}
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-100">
            <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Mail className="w-6 h-6 text-blue-600" />
              Email Support
            </h3>
            <p className="text-gray-700 leading-relaxed">
              For urgent matters or detailed inquiries, you can reach us directly at our support email.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-purple-100">
            <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-purple-600" />
              Response Time
            </h3>
            <p className="text-gray-700 leading-relaxed">
              We typically respond to inquiries within 24-48 hours during business days.
            </p>
          </div>
        </div>

        {/* Privacy Note */}
        <div className="mt-8 bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
          <p className="text-sm text-blue-900">
            <strong>Privacy Note:</strong> Your contact information will only be used to respond to your inquiry. 
            We never share your information with third parties. See our{' '}
            <a href="/privacy" className="underline hover:text-blue-700">Privacy Policy</a> for more details.
          </p>
        </div>
      </div>
    </div>
    </>
  );
}
