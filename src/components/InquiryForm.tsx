import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, CheckCircle, Loader2 } from 'lucide-react';

export default function InquiryForm() {
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.subject || !formData.message) return;

    setIsSubmitting(true);

    const subjectLine = formData.subject;
    const bodyContent = `Name: ${formData.name}\n\nMessage:\n${formData.message}`;
    const mailtoUrl = `mailto:kineticlogiclabs@gmail.com?subject=${encodeURIComponent(subjectLine)}&body=${encodeURIComponent(bodyContent)}`;

    const link = document.createElement('a');
    link.href = mailtoUrl;
    link.click();

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1200);
  };

  const handleReset = () => {
    setFormData({
      name: '',
      subject: '',
      message: '',
    });
    setSubmitted(false);
  };

  return (
    <div className="glass-sheet rounded-xl shadow-md p-8 md:p-10 w-full" id="contact-form-card">
      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Full Name */}
            <div className="space-y-2">
              <label htmlFor="full-name" className="font-mono text-[10px] text-charcoal-muted tracking-widest font-bold uppercase block">
                Full Name
              </label>
              <input
                type="text"
                id="full-name"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Your full name"
                className="w-full px-4 py-3.5 rounded-lg bg-bone-light/50 border border-accent-blue/15 text-charcoal font-mono text-sm focus:outline-none focus:ring-1 focus:ring-accent-blue/30 focus:border-accent-blue/40 placeholder-charcoal-muted/50 transition-colors"
              />
            </div>

            {/* Subject */}
            <div className="space-y-2">
              <label htmlFor="subject" className="font-mono text-[10px] text-charcoal-muted tracking-widest font-bold uppercase block">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                required
                value={formData.subject}
                onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                placeholder="Topic or subject of inquiry"
                className="w-full px-4 py-3.5 rounded-lg bg-bone-light/50 border border-accent-blue/15 text-charcoal font-mono text-sm focus:outline-none focus:ring-1 focus:ring-accent-blue/30 focus:border-accent-blue/40 placeholder-charcoal-muted/50 transition-colors"
              />
            </div>

            {/* Message */}
            <div className="space-y-2">
              <label htmlFor="message" className="font-mono text-[10px] text-charcoal-muted tracking-widest font-bold uppercase block">
                Message
              </label>
              <textarea
                id="message"
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Tell us about your project or technical challenge..."
                className="w-full px-4 py-3.5 rounded-lg bg-bone-light/50 border border-accent-blue/15 text-charcoal font-mono text-sm h-36 resize-none focus:outline-none focus:ring-1 focus:ring-accent-blue/30 focus:border-accent-blue/40 placeholder-charcoal-muted/50 transition-colors"
              />
            </div>

            {/* Send Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-accent-blue hover:bg-opacity-95 disabled:bg-accent-blue/70 text-bone-light border border-accent-blue/30 font-mono text-xs font-bold tracking-widest uppercase py-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer active:translate-y-px"
              id="btn-send-response"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>SENDING...</span>
                </>
              ) : (
                <>
                  <span>SEND RESPONSE</span>
                  <Send className="w-4 h-4 transform rotate-12" />
                </>
              )}
            </button>
          </motion.form>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-8 space-y-5"
          >
            <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-accent-blue/10 text-accent-blue border border-accent-blue/20">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h4 className="text-xl font-mono font-bold text-charcoal tracking-tight uppercase">
                Response Sent
              </h4>
              <p className="font-serif text-sm text-charcoal-muted max-w-sm mx-auto leading-relaxed">
                Thank you, <strong className="text-charcoal font-medium">{formData.name}</strong>. Your message regarding <span className="font-mono text-xs font-semibold text-accent-blue">{formData.subject}</span> has been securely dispatched.
              </p>
            </div>

            <button
              onClick={handleReset}
              className="px-5 py-2.5 text-xs font-mono tracking-wider uppercase bg-bone-warm hover:bg-bone-shadow text-charcoal-light rounded-lg transition-colors duration-250 cursor-pointer border border-accent-blue/5"
            >
              Send Another Response
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
