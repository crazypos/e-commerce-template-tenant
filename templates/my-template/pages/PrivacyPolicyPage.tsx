export function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-(--primary-light2) selection:bg-(--primary-light) selection:text-(--primary)">
      <div className="h-1 bg-gradient-to-r from-transparent via-(--primary-light)/30 to-transparent" />

      <main className="max-w-4xl mx-auto px-6 py-10">
        <header className="mb-20 text-center md:text-left">
          <div className="inline-block px-3 py-1 bg-(--primary-light)/10 rounded-full text-xs font-medium text-(--primary-light) mb-6 uppercase tracking-widest">
            Last Updated: March 24, 2024
          </div>
          <h1 className="font-serif text-5xl md:text-7xl italic text-(--primary) mb-8 leading-tight">
            Privacy Policy
          </h1>
          <p className="text-lg text-(--primary-dark) opacity-80 max-w-2xl leading-relaxed font-serif italic">
            At Tico Bakery, your privacy is as important to us as the quality of our ingredients.
            This policy outlines how we protect and handle your personal journey with us.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-12 md:gap-20">
          <aside className="space-y-4 hidden md:block border-r border-(--primary-light)/10 pr-12">
            <nav className="sticky top-32 space-y-6 text-sm">
              <p className="font-serif italic font-bold text-(--primary)">Quick Links</p>
              <div className="flex flex-col gap-4 text-(--primary-light)">
                <a href="#collection" className="hover:text-(--primary) transition-colors">Information Collection</a>
                <a href="#usage" className="hover:text-(--primary) transition-colors">Data Usage</a>
                <a href="#marketing" className="hover:text-(--primary) transition-colors">Marketing Preferences</a>
                <a href="#security" className="hover:text-(--primary) transition-colors">Security Measures</a>
              </div>
            </nav>
          </aside>

          <article className="prose prose-stone max-w-none text-(--primary-dark) space-y-16">
            <section id="collection">
              <h2 className="font-serif text-3xl italic text-(--primary) mb-6 flex items-center gap-4">
                <span className="text-sm not-italic opacity-40 font-sans font-normal underline decoration-(--primary-light)">01</span>
                Information We Collect
              </h2>
              <div className="space-y-4 leading-relaxed opacity-90">
                <p>We collect information that helps us serve you better. This includes:</p>
                <ul className="list-disc list-inside space-y-2 marker:text-(--primary-light)">
                  <li>Personal identifiers (Name, Email, Phone Number)</li>
                  <li>Delivery and pickup preferences</li>
                  <li>Order history and dietary requirements</li>
                  <li>Device information for a better browsing experience</li>
                </ul>
              </div>
            </section>

            <section id="usage">
              <h2 className="font-serif text-3xl italic text-(--primary) mb-6 flex items-center gap-4">
                <span className="text-sm not-italic opacity-40 font-sans font-normal underline decoration-(--primary-light)">02</span>
                How We Use Your Data
              </h2>
              <p className="leading-relaxed opacity-90">
                Your data is used strictly to fulfill your orders, manage your Tico Rewards account, and improve our bakery services. We utilize encryption for all sensitive transactions and never sell your personal information to third parties.
              </p>
            </section>

            <section id="marketing">
              <h2 className="font-serif text-3xl italic text-(--primary) mb-6 flex items-center gap-4">
                <span className="text-sm not-italic opacity-40 font-sans font-normal underline decoration-(--primary-light)">03</span>
                Marketing & Subscriptions
              </h2>
              <p className="leading-relaxed opacity-90">
                If you opt-in to our sweet updates, we&apos;ll send you newsletters about seasonal releases and special events. You can unsubscribe at any time via the link in our emails or through your account settings.
              </p>
            </section>

            <section id="security">
              <h2 className="font-serif text-3xl italic text-(--primary) mb-6 flex items-center gap-4">
                <span className="text-sm not-italic opacity-40 font-sans font-normal underline decoration-(--primary-light)">04</span>
                Our Commitment to Security
              </h2>
              <div className="p-8 bg-white/50 border border-(--primary-light)/10 rounded-2xl italic font-serif text-center">
                {`"We treat your data with the same careful attention we give to our hand-piped decorations."`}
              </div>
              <p className="mt-6 leading-relaxed opacity-90">
                We implement robust physical, electronic, and managerial procedures to safeguard and secure the information we collect online.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-3xl italic text-(--primary) mb-6 flex items-center gap-4">
                <span className="text-sm not-italic opacity-40 font-sans font-normal underline decoration-(--primary-light)">05</span>
                Changes to This Policy
              </h2>
              <p className="leading-relaxed opacity-90">
                We may update our Privacy Policy to reflect changes in our practices. We will notify you of any significant changes by posting the new policy on this page.
              </p>
            </section>
          </article>
        </div>

        <footer className="mt-32 pt-12 border-t border-(--primary-light)/10 text-center">
          <p className="text-sm text-(--primary-light) italic">
            Questions? Reach out to us at <span className="text-(--primary) font-serif font-bold">ticocake@gmail.com</span>
          </p>
        </footer>
      </main>
    </div>
  );
}
