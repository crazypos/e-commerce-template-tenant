import { MapPin, Clock, Mail } from 'lucide-react';
import { Accordion } from '../components';

export function FaqPage() {
  return (
    <div className="min-h-screen bg-(--primary-light2) selection:bg-(--primary-light) selection:text-(--primary)">
      {/* Decorative Top Accent */}
      <div className="h-1 bg-gradient-to-r from-transparent via-(--primary-light)/30 to-transparent" />

      <main className="max-w-4xl mx-auto px-6 py-10">
        {/* Hero Section */}
        <header className="mb-20 text-center md:text-left">
          <div className="inline-block px-3 py-1 bg-(--primary-light)/10 rounded-full text-xs font-medium text-(--primary-light) mb-6 uppercase tracking-widest">
            Help & Support
          </div>
          <h1 className="font-serif text-5xl md:text-7xl italic text-(--primary) mb-8 leading-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-(--primary-dark) opacity-80 max-w-2xl leading-relaxed font-serif italic">
            Find answers to common questions about our cakes, ordering, transport, and pickup.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-12 md:gap-20">
          {/* FAQ Accordions */}
          <div className="space-y-2">
            <Accordion title="How long can I keep the cake in the fridge for?" defaultOpen>
              <p>We recommend finishing the cake within 48 hours.</p>
            </Accordion>

            <Accordion title="Do I need to refrigerate the cake?">
              <p>Yes! Please refrigerate the cake until serving. Our cakes can be served from the fridge without bringing them to room temperature.</p>
            </Accordion>

            <Accordion title="How do I transport the cake safely while driving?">
              <p>Place the cake on the floor of the car (front passenger seat floor is optimal) and drive smoothly around corners and over bumps. Do not place the cake on the car seats as they are not flat surfaces.</p>
            </Accordion>

            <Accordion title="How do I cancel the cake I ordered?">
              <p>Send us an email at <a href="mailto:ticocake@gmail.com" className="text-(--primary) font-medium underline decoration-(--primary-light)/50 hover:decoration-(--primary) transition-colors">ticocake@gmail.com</a> {`for us to cancel and refund your cake. Though we'd appreciate a minimum 48 hours' notice, we understand that things may come up suddenly, so please feel free to reach out as soon as you can.`}</p>
            </Accordion>

            <Accordion title="Do you make gluten-free cakes?">
              <p>Unfortunately, we cannot replicate the same taste and texture with our gluten-free recipe. Currently, only our macarons (except black sesame flavor) are gluten-free.</p>
            </Accordion>
          </div>

          {/* Important Info Sidebar */}
          <aside className="space-y-8">
            <section className="p-8 bg-white/50 border border-(--primary-light)/10 rounded-2xl">
              <h3 className="font-serif text-2xl italic text-(--primary) mb-6">Pickup Information</h3>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <MapPin className="w-5 h-5 text-(--primary-light) shrink-0 mt-1" />
                  <div>
                    <h4 className="font-serif font-bold text-(--primary-dark) mb-1">Location</h4>
                    <p className="text-sm text-(--primary-dark) opacity-80 leading-relaxed">
                      46 Greenview Ave<br/>
                      Rochedale South, QLD 4123
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Clock className="w-5 h-5 text-(--primary-light) shrink-0 mt-1" />
                  <div>
                    <h4 className="font-serif font-bold text-(--primary-dark) mb-1">Hours</h4>
                    <p className="text-sm text-(--primary-dark) opacity-80 leading-relaxed">
                      Tuesday to Saturday<br/>
                      10:30 AM – 4:00 PM<br/>
                      <span className="text-(--primary-dark) italic">Sunday & Monday Closed</span>
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Mail className="w-5 h-5 text-(--primary-light) shrink-0 mt-1" />
                  <div>
                    <h4 className="font-serif font-bold text-(--primary-dark) mb-1">Notifications</h4>
                    <p className="text-sm text-(--primary-dark) opacity-80 leading-relaxed">
                      You will receive a notification via email when your order updates.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <div>
              <p className="text-sm text-(--primary-dark) italic px-4">
                Still have questions? Reach out to us at <a href="mailto:ticocake@gmail.com" className="text-(--primary) font-serif font-bold hover:underline">ticocake@gmail.com</a>
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
