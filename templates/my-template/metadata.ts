import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://example.com'),
  title: {
    default: 'My Store',
    template: '%s | My Store',
  },
  description:
    'Welcome to My Store. Discover amazing products at great prices.',
  openGraph: {
    title: 'My Store',
    description:
      'Welcome to My Store. Discover amazing products at great prices.',
    url: 'https://example.com',
    siteName: 'My Store',
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
