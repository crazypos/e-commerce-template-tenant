'use client';

import React, { useRef, useState, useEffect } from 'react';
import { ProductCard } from './ProductCard';
import type { ProductListItem } from '@/src/actions/product';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import { motion } from 'motion/react';

interface RecommendedProductsProps {
  products: ProductListItem[];
  title?: string;
}

export const RecommendedProducts = ({ products, title = "You Might Also Like" }: RecommendedProductsProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftGradient, setShowLeftGradient] = useState(false);
  const [showRightGradient, setShowRightGradient] = useState(true);

  // Filter out of stock products
  // NOTE TO BACKEND: It's better to handle this filtering in the API response
  // to avoid fetching unnecessary data and to ensure accurate pagination/counts.
  const availableProducts = products.filter(p => !p.stock || p.stock > 0);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftGradient(scrollLeft > 10);
      setShowRightGradient(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleWheelNative = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        const { scrollLeft, scrollWidth, clientWidth } = el;
        const canScrollRight = scrollLeft < scrollWidth - clientWidth - 1;
        const canScrollLeft = scrollLeft > 0;
        const isScrollingDown = e.deltaY > 0;
        const isScrollingUp = e.deltaY < 0;

        // Only intercept when there's remaining room to scroll in the direction
        if ((isScrollingDown && canScrollRight) || (isScrollingUp && canScrollLeft)) {
          e.preventDefault();
          el.scrollLeft += e.deltaY;
        }
      }
    };

    // Use non-passive listener to allow e.preventDefault()
    el.addEventListener('wheel', handleWheelNative, { passive: false });

    handleScroll();
    window.addEventListener('resize', handleScroll);

    return () => {
      el.removeEventListener('wheel', handleWheelNative);
      window.removeEventListener('resize', handleScroll);
    };
  }, [availableProducts]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth * 0.8 : clientWidth * 0.8;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!availableProducts.length) return null;

  return (
    <section className="mt-20 relative px-4 sm:px-0">
      <h2 className="font-serif text-3xl italic text-(--primary) mb-8">
        {title}
      </h2>

      <div className="relative group">
        {/* Left Shadow/Gradient */}
        <div className={clsx(
          "absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none transition-opacity duration-300 bg-gradient-to-r from-white to-transparent",
          showLeftGradient ? "opacity-100" : "opacity-0"
        )} />

        {/* Right Shadow/Gradient */}
        <div className={clsx(
          "absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none transition-opacity duration-300 bg-gradient-to-l from-white to-transparent",
          showRightGradient ? "opacity-100" : "opacity-0"
        )} />

        {/* Scroll Container */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', overscrollBehaviorX: 'contain' }}
        >
          {availableProducts.slice(0, 10).map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="flex-shrink-0 w-[calc((100%-48px)/3.5)] sm:w-[calc((100%-60px)/3.5)] md:w-[calc((100%-96px)/4.5)] lg:w-[calc((100%-120px)/5.5)]"
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        {/* Nav Buttons (Desktop only enhancement) */}
        <button
          onClick={() => scroll('left')}
          className={clsx(
            "absolute left-[-20px] top-[40%] -translate-y-1/2 z-20 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.08)] rounded-full p-3 text-(--primary) hover:bg-(--primary) hover:text-white transition-all scale-0 group-hover:scale-100 hidden md:flex items-center justify-center",
            !showLeftGradient && "opacity-0 pointer-events-none"
          )}
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => scroll('right')}
          className={clsx(
            "absolute right-[-20px] top-[40%] -translate-y-1/2 z-20 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.08)] rounded-full p-3 text-(--primary) hover:bg-(--primary) hover:text-white transition-all scale-0 group-hover:scale-100 hidden md:flex items-center justify-center",
            !showRightGradient && "opacity-0 pointer-events-none"
          )}
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
};
