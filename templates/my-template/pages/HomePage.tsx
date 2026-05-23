'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ProductCard } from '../components';
import type { HomePageData } from '@/src/config/template';

const CATEGORIES = [
  { id: 0, name: 'All' },
  { id: 1, name: 'Apple' },
  { id: 2, name: 'Samsung' },
  { id: 3, name: 'Google' },
  { id: 4, name: 'Huawei' },
  { id: 5, name: 'OPPO' },
  { id: 6, name: 'Xiaomi' },
];

const BANNERS = [
  {
    gradient: 'from-blue-600 via-blue-500 to-indigo-500',
    title: 'Premium Phone Accessories',
    subtitle: 'Cases, chargers, cables & more at wholesale prices',
    link: '/category/all',
  },
  {
    gradient: 'from-indigo-600 via-purple-600 to-pink-500',
    title: 'Shop Latest Tech',
    subtitle: 'Discover top brands at unbeatable prices',
    link: '/category/all',
  },
];

const FEATURED_CATEGORIES = [
  {
    name: 'Phone Cases',
    gradient: 'from-blue-400 via-blue-500 to-blue-600',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-16 h-16 text-white/70">
        <rect x="10" y="4" width="28" height="40" rx="4" stroke="currentColor" strokeWidth="2" />
        <circle cx="24" cy="34" r="2" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: 'Chargers',
    gradient: 'from-green-400 via-green-500 to-green-600',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-16 h-16 text-white/70">
        <rect x="18" y="2" width="12" height="20" rx="3" stroke="currentColor" strokeWidth="2" />
        <rect x="15" y="22" width="18" height="24" rx="3" stroke="currentColor" strokeWidth="2" />
        <path d="M24 28v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: 'Cables',
    gradient: 'from-purple-400 via-purple-500 to-purple-600',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-16 h-16 text-white/70">
        <path d="M8 16C8 10 12 6 18 6h12c6 0 10 4 10 10v16c0 6-4 10-10 10H18c-6 0-10-4-10-10V16z" stroke="currentColor" strokeWidth="2" />
        <circle cx="24" cy="24" r="4" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: 'Audio',
    gradient: 'from-orange-400 via-orange-500 to-orange-600',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-16 h-16 text-white/70">
        <path d="M36 20c0-6.6-5.4-12-12-12S12 13.4 12 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="24" cy="34" r="8" stroke="currentColor" strokeWidth="2" />
        <circle cx="24" cy="34" r="3" fill="currentColor" />
        <path d="M24 12v18" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
  },
];

export function HomePage({ initialData }: { initialData: HomePageData }) {
  const { contents, products } = initialData;
  const [activeCategory, setActiveCategory] = useState(0);
  const [currentBanner, setCurrentBanner] = useState(0);

  const productList = Object.values(products || {});

  return (
    <div className="bg-(--primary-light2) min-h-screen">
      {/* Category Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 overflow-x-auto py-3 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`shrink-0 px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                  activeCategory === cat.id
                    ? 'bg-(--primary) text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Hero Banner Carousel */}
      <div className="relative h-[240px] md:h-[360px] overflow-hidden">
        {BANNERS.map((banner, i) => (
          <Link
            key={i}
            href={banner.link}
            className={`absolute inset-0 transition-opacity duration-700 bg-gradient-to-r ${banner.gradient} ${
              i === currentBanner ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-lg">
                  <h2 className="text-white text-2xl md:text-4xl font-bold mb-2 drop-shadow-lg">
                    {banner.title}
                  </h2>
                  <p className="text-white/90 text-sm md:text-base mb-4 drop-shadow">
                    {banner.subtitle}
                  </p>
                  <span className="inline-block bg-white text-(--primary) font-semibold text-sm px-6 py-2.5 rounded-lg hover:bg-gray-100 transition-colors">
                    Shop Now
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {BANNERS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentBanner(i)}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                i === currentBanner ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>

        {/* Arrows */}
        <button
          onClick={() => setCurrentBanner((prev) => (prev === 0 ? BANNERS.length - 1 : prev - 1))}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow transition-colors"
        >
          <svg className="w-4 h-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <button
          onClick={() => setCurrentBanner((prev) => (prev === BANNERS.length - 1 ? 0 : prev + 1))}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow transition-colors"
        >
          <svg className="w-4 h-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>

      {/* Featured Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {FEATURED_CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              href="/category/all"
              className={`relative aspect-[3/2] rounded-xl overflow-hidden group bg-gradient-to-br ${cat.gradient}`}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                {cat.icon}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <span className="absolute bottom-3 left-3 text-white font-semibold text-sm drop-shadow-lg">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Product Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {contents?.map((content) => {
          if (content.type !== 'section' || content.is_hidden || !content.cells?.length) return null;
          return (
            <section key={content.id} className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-(--text-primary)">{content.name}</h2>
                <Link href="/category/all" className="text-sm text-(--primary) hover:underline font-medium">
                  View All &rarr;
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {content.cells.map((cell) => {
                  if (cell.type === 'product') {
                    const product = products[cell.product_id!];
                    if (!product) return null;
                    return <ProductCard key={cell.id} product={product} />;
                  }
                  if (cell.type === 'collection') {
                    return (
                      <Link
                        key={cell.id}
                        href={`/category/${cell.collection_id}`}
                        className="relative aspect-square rounded-xl overflow-hidden bg-white shadow-sm group"
                      >
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors z-10" />
                        {cell.image?.url ? (
                          <img
                            src={cell.image.url}
                            alt={cell.collection_name ?? ''}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center">
                            <span className="text-white/40 text-5xl font-bold">
                              {cell.collection_name?.[0] || '?'}
                            </span>
                          </div>
                        )}
                        <div className="absolute inset-0 z-20 flex items-center justify-center">
                          <h3 className="text-white text-lg font-bold drop-shadow-lg">
                            {cell.collection_name}
                          </h3>
                        </div>
                      </Link>
                    );
                  }
                  return null;
                })}
              </div>
            </section>
          );
        })}

        {!contents?.length && productList.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-(--text-primary)">Products</h2>
              <Link href="/category/all" className="text-sm text-(--primary) hover:underline font-medium">
                View All &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {productList.map((product) => (
                <ProductCard key={product.variantId || product.id} product={product} />
              ))}
            </div>
          </div>
        )}

        {!contents?.length && productList.length === 0 && (
          <p className="text-center text-gray-500 py-20">
            Welcome! Products will appear here.
          </p>
        )}
      </div>
    </div>
  );
}
