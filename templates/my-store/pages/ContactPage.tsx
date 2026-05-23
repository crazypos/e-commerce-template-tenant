/* eslint-disable @next/next/no-img-element */
'use client';

import { Mail, Phone, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';
import { MotionDiv, MotionH1, MotionP, TextField, TextArea, Button } from '../components';
import { useContact } from '@/src/hooks/useContact';

export function ContactPage() {
  const { isSubmitting, isSubmitted, submitContact, reset } = useContact();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitContact(new FormData(e.currentTarget as HTMLFormElement));
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden bg-(--primary-light)/10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-(--primary-light2)/50" />
        <div className="relative z-10 text-center px-4">
          <MotionH1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-serif text-4xl md:text-6xl italic text-(--primary) mb-4"
          >
            Get in Touch
          </MotionH1>
          <MotionP
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-(--primary-dark) text-lg max-w-2xl mx-auto"
          >
            Have a question about our cakes or want to discuss a special order? We&apos;d love to hear from you.
          </MotionP>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Contact Form */}
          <MotionDiv
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-(--primary-light)/10"
          >
            {isSubmitted ? (
              <div className="text-center py-12">
                <div className="flex justify-center mb-6">
                  <CheckCircle2 className="w-16 h-16 text-green-500" />
                </div>
                <h3 className="font-serif text-3xl italic text-(--primary) mb-4">Message Sent!</h3>
                <p className="text-(--primary-dark) mb-8">
                  Thank you for reaching out. We&apos;ll get back to you as soon as possible.
                </p>
                <Button onClick={reset} variant="secondary">
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TextField
                    label="Full Name"
                    placeholder="John Doe"
                    required
                    className="flex-1"
                    name="name"
                  />
                  <TextField
                    label="Email Address"
                    type="email"
                    placeholder="john@example.com"
                    required
                    className="flex-1"
                    name="email"
                  />
                </div>
                <TextField
                  label="Phone Number (Optional)"
                  type="tel"
                  placeholder="+61 000 000 000"
                  name="phone"
                />
                <TextArea
                  label="Your Message"
                  placeholder="Tell us what you're looking for..."
                  required
                  rows={5}
                  name="message"
                />
                <Button
                  type="submit"
                  size="lg"
                  className="w-full md:w-auto"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                  {!isSubmitting && <Send className="ml-2 w-4 h-4" />}
                </Button>
              </form>
            )}
          </MotionDiv>

          {/* Contact Info & Map */}
          <div className="space-y-8">
            <MotionDiv
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            >
              <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-(--primary-light)/10">
                <div className="w-10 h-10 bg-(--primary-light)/20 rounded-full flex items-center justify-center mb-4 text-(--primary)">
                  <MapPin className="w-5 h-5" />
                </div>
                <h4 className="font-medium text-(--primary) mb-2">Our Location</h4>
                <p className="text-sm text-(--primary-dark) leading-relaxed">
                  46 Greenview Ave,<br />
                  Rochedale South, QLD 4123
                </p>
              </div>

              <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-(--primary-light)/10">
                <div className="w-10 h-10 bg-(--primary-light)/20 rounded-full flex items-center justify-center mb-4 text-(--primary)">
                  <Clock className="w-5 h-5" />
                </div>
                <h4 className="font-medium text-(--primary) mb-2">Opening Hours</h4>
                <p className="text-sm text-(--primary-dark) leading-relaxed">
                  Tue - Sat: 10:30am - 4:00pm<br />
                  Sun - Mon: Closed
                </p>
              </div>

              <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-(--primary-light)/10">
                <div className="w-10 h-10 bg-(--primary-light)/20 rounded-full flex items-center justify-center mb-4 text-(--primary)">
                  <Phone className="w-5 h-5" />
                </div>
                <h4 className="font-medium text-(--primary) mb-2">Phone</h4>
                <p className="text-sm text-(--primary-dark) leading-relaxed">
                  +61 480245055
                </p>
              </div>

              <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-(--primary-light)/10">
                <div className="w-10 h-10 bg-(--primary-light)/20 rounded-full flex items-center justify-center mb-4 text-(--primary)">
                  <Mail className="w-5 h-5" />
                </div>
                <h4 className="font-medium text-(--primary) mb-2">Email</h4>
                <p className="text-sm text-(--primary-dark) leading-relaxed">
                  ticocake@gmail.com
                </p>
              </div>
            </MotionDiv>

            {/* Map Placeholder/Embed */}
            <MotionDiv
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="aspect-video w-full rounded-3xl overflow-hidden border-4 border-white shadow-lg bg-gray-100 relative group"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3536.567!2d153.116!3d-27.585!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b915bb!2s46%20Greenview%20Ave%2C%20Rochedale%20South%20QLD%204123!5e0!3m2!1sen!2sau!4v1620000000000!5m2!1sen!2sau"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                title="Tico Bakery Location"
                className="filter grayscale group-hover:grayscale-0 transition-all duration-500"
              />
            </MotionDiv>
          </div>
        </div>
      </section>

      {/* Social Links Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="text-center">
          <h3 className="font-serif text-2xl italic text-(--primary) mb-8">Follow our sweet journey</h3>
          <div className="flex justify-center gap-8">
            <a href="https://www.instagram.com/tico.bakery" target="_blank" rel="noopener noreferrer" className="text-(--primary) hover:!text-(--primary-light) transition-colors flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-(--primary-light)/10 overflow-hidden">
                <img src="/IG Logo.png" alt="Instagram" className="w-full h-full object-cover p-2" />
              </div>
              <span className="text-sm font-medium">Instagram</span>
            </a>
            <a href="https://www.facebook.com/ticobakery" target="_blank" rel="noopener noreferrer" className="text-(--primary) hover:!text-(--primary-light) transition-colors flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-(--primary-light)/10 overflow-hidden">
                <img src="/facebook logo.png" alt="Facebook" className="w-full h-full object-cover p-2" />
              </div>
              <span className="text-sm font-medium">Facebook</span>
            </a>
            <a href="https://xhslink.com/m/3nYgUVMXA2a" target="_blank" rel="noopener noreferrer" className="text-(--primary) hover:!text-(--primary-light) transition-colors flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-(--primary-light)/10 overflow-hidden">
                <img src="/XiaohongshuLOGO.png" alt="Red Note" className="w-full h-full object-cover p-2" />
              </div>
              <span className="text-sm font-medium">Red Note</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
