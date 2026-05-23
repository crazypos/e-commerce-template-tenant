'use client';

import React, { useState } from 'react';
import type { CategoryPageData } from '@/src/config/template';
import { ProductCard } from '../components';

const CATEGORIES = [
  { id: 0, name: 'All' },
  { id: 1, name: 'Apple' },
  { id: 2, name: 'Samsung' },
  { id: 3, name: 'Google' },
  { id: 4, name: 'Huawei' },
  { id: 5, name: 'OPPO' },
  { id: 6, name: 'Xiaomi' },
];

export function CategoryPage({ initialData }: { initialData: CategoryPageData }) {
  const { collectionTitle, products } = initialData;
  const [activeCategory, setActiveCategory] = useState(0);

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

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {products.length === 0 ? (
            <p className="col-span-full text-center text-gray-500 py-20">
              No products found.
            </p>
          ) : (
            products.map((product) => (
              <ProductCard key={product.variantId || product.id} product={product} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
