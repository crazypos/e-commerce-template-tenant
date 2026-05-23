'use client';

import { useState, useEffect } from 'react';
import { getCurrentAgreement } from '@/src/actions/agreements';

export function TermsContent() {
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [agreementTitle, setAgreementTitle] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getCurrentAgreement('terms', 'terms_conditions')
      .then((data) => {
        if (data.agreement?.html_content) {
          setHtmlContent(data.agreement.html_content);
          setAgreementTitle(data.agreement.title || null);
        }
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  if (!loaded) {
    return (
      <div className="min-h-screen bg-(--primary-light2) flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="text-sm">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-(--primary-light2) selection:bg-(--primary-light) selection:text-(--primary)">
      <div className="h-1 bg-gradient-to-r from-transparent via-(--primary-light)/30 to-transparent" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {htmlContent ? (
          <>
            {agreementTitle && (
              <h1 className="font-serif text-5xl md:text-7xl italic text-(--primary) mb-12 leading-tight">
                {agreementTitle}
              </h1>
            )}
            <div
              className="prose prose-stone max-w-none text-(--primary-dark) leading-relaxed [&_p]:leading-[2] [&_a]:text-(--primary) [&_a]:underline"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          </>
        ) : (
          <StaticFallback />
        )}
      </main>
    </div>
  );
}

function StaticFallback() {
  return (
    <>
      <header className="mb-20 text-center md:text-left">
        <h1 className="font-serif text-5xl md:text-7xl italic text-(--primary) mb-8 leading-tight">
          Terms & Conditions
        </h1>
        <p className="text-lg text-(--primary-dark) opacity-80 max-w-2xl leading-relaxed font-serif italic">
          These terms govern your use of our services. By using our platform, you agree to these terms.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-12 md:gap-20">
        <aside className="space-y-4 hidden md:block border-r border-(--primary-light)/10 pr-12">
          <nav className="sticky top-32 space-y-6 text-sm">
            <p className="font-serif italic font-bold text-(--primary)">The Essentials</p>
            <div className="flex flex-col gap-4 text-(--primary-light)">
              <a href="#orders" className="hover:text-(--primary) transition-colors">
                Orders & Payments
              </a>
              <a href="#account" className="hover:text-(--primary) transition-colors">
                Account & Registration
              </a>
              <a href="#cancellation" className="hover:text-(--primary) transition-colors">
                Cancellations & Refunds
              </a>
              <a href="#limitation" className="hover:text-(--primary) transition-colors">
                Limitation of Liability
              </a>
            </div>
          </nav>
        </aside>

        <article className="prose prose-stone max-w-none text-(--primary-dark) space-y-16">
          <section id="orders">
            <h2 className="font-serif text-3xl italic text-(--primary) mb-6 flex items-center gap-4">
              <span className="text-sm not-italic opacity-40 font-sans font-normal underline decoration-(--primary-light)">
                01
              </span>
              Orders & Payments
            </h2>
            <p className="leading-relaxed opacity-90">
              All orders are subject to acceptance and availability. Prices are as displayed at the time of ordering and
              include applicable taxes. Full or partial payment may be required to confirm your order.
            </p>
          </section>

          <section id="account">
            <h2 className="font-serif text-3xl italic text-(--primary) mb-6 flex items-center gap-4">
              <span className="text-sm not-italic opacity-40 font-sans font-normal underline decoration-(--primary-light)">
                02
              </span>
              Account & Registration
            </h2>
            <p className="leading-relaxed opacity-90">
              You are responsible for maintaining the confidentiality of your account credentials. All activities under
              your account are your responsibility. Please notify us immediately of any unauthorised use.
            </p>
          </section>

          <section id="cancellation">
            <h2 className="font-serif text-3xl italic text-(--primary) mb-6 flex items-center gap-4">
              <span className="text-sm not-italic opacity-40 font-sans font-normal underline decoration-(--primary-light)">
                03
              </span>
              Cancellations & Refunds
            </h2>
            <p className="leading-relaxed opacity-90">
              Cancellation and refund policies vary by product and service. Please refer to the specific terms provided
              at the time of purchase. Certain made-to-order items may be non-refundable.
            </p>
          </section>

          <section id="limitation">
            <h2 className="font-serif text-3xl italic text-(--primary) mb-6 flex items-center gap-4">
              <span className="text-sm not-italic opacity-40 font-sans font-normal underline decoration-(--primary-light)">
                04
              </span>
              Limitation of Liability
            </h2>
            <p className="leading-relaxed opacity-90">
              To the maximum extent permitted by law, our liability for any claim arising from your use of our services
              is limited to the amount you paid for the applicable product or service. We are not liable for indirect,
              incidental, or consequential damages.
            </p>
          </section>
        </article>
      </div>
    </>
  );
}
