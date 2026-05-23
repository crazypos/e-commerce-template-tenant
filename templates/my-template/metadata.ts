import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://ticobakery.example.com'),
  title: {
    default: 'CrazyPOS E Commerce',
    template: '%s | CrazyPOS E Commerce',
  },
  description:
    'Discover amazing products at great prices. Fast shipping, easy checkout, and exceptional customer service.',
  openGraph: {
    title: 'CrazyPOS E Commerce',
    description:
      'Discover amazing products at great prices. Fast shipping, easy checkout, and exceptional customer service.',
    url: 'https://ticobakery.example.com',
    siteName: 'CrazyPOS E Commerce',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'CrazyPOS E Commerce',
      },
    ],
    locale: 'en_AU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CrazyPOS E Commerce',
    description:
      'Discover amazing products at great prices. Fast shipping, easy checkout, and exceptional customer service.',
    images: ['/og-image.jpg'],
  },
};

export const pageMetadata: Record<string, { title: string; description: string }> = {
  faq: {
    title: 'FAQ',
    description: 'Frequently asked questions about ordering, shipping, and returns.',
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const jsonLd: Record<string, any> = {};
