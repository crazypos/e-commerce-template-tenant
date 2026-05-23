'use client';

import React from 'react';
import Image from 'next/image';
import { Link, Price, QuickAddButton } from '../components';
import type { ProductListItem } from '@/src/actions/product';

interface ProductCardProps {
  product: ProductListItem;
  className?: string;
}

export const ProductCard = ({ product, className }: ProductCardProps) => {
  const [imgError, setImgError] = React.useState(false);

  return (
    <div className={`bg-white rounded-xl shadow-sm overflow-hidden flex flex-col ${className || ''}`}>
      {/* Image Area */}
      <Link href={`/product/${product.id}`} className="relative block w-full pt-[100%] bg-white">
        {product.image && !imgError ? (
          <img
            src={product.image}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-contain p-4"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <Image
              src="/Product%20Alter%20Image.png"
              alt={product.name}
              fill
              className="object-contain opacity-30 p-6"
            />
          </div>
        )}

        {product.stock <= 0 && (
          <div className="absolute top-2.5 right-2.5 bg-gray-800/80 text-white text-[10px] font-semibold px-2 py-1 rounded-full">
            Out of Stock
          </div>
        )}
      </Link>

      {/* Product Info */}
      <div className="p-3.5 flex flex-col gap-2 flex-1">
        <Link href={`/product/${product.id}`}>
          <h3 className="text-sm font-semibold line-clamp-2 leading-snug hover:text-(--primary) transition-colors">
            {product.name}
          </h3>
        </Link>

        <Price
          variants={product._origin.variants}
          promotion={product._origin.promotion || product._origin.promoiton}
        />

        <QuickAddButton
            productId={product.id}
            variantId={product.variantId}
            name={product.name}
            image={product.image}
            variants={product._origin.variants}
            promotion={product._origin.promotion || product._origin.promoiton}
            hasVariants={product.hasVariants}
          />
      </div>
    </div>
  );
};
