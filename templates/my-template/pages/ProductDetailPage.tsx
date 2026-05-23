'use client';

import React, { useMemo, useState } from 'react';
import { Image } from 'antd';
import { AddToCartSection, RecommendedProducts, InfoCard } from '../components';
import { CalendarClock, Store } from 'lucide-react';
import type { ProductPageData } from '@/src/config/template';

export function ProductDetailPage({ initialData }: { initialData: ProductPageData }) {
  const { product, relateds } = initialData;
  const [img, setImg] = useState(product.image);

  const showPre = useMemo(() => {
    const category = product._origin?.category || [];
    const includeIds = process.env.NEXT_PUBLIC_CAKE_CATEGORY?.split(',').map(id => parseInt(id)) || [];
    return category?.some?.((c: { id: number }) => includeIds.includes(c.id)) || false;
  }, [product]);

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
        <div>
          <div className="aspect-square rounded-3xl overflow-hidden bg-gray-100 relative">
            {product.image ? (
              <Image.PreviewGroup items={product.images}>
                <Image
                  loading="lazy"
                  src={img}
                  alt={product.name}
                  width={'100%'}
                  className="w-full h-full object-cover"
                />
              </Image.PreviewGroup>
            ) : (
              <div className="w-full h-full bg-gray-50 flex items-center justify-center p-[25%]">
                <Image
                  src="/Product%20Alter%20Image.png"
                  alt={product.name}
                  width={'100%'}
                  className="w-full h-full object-contain"
                  preview={false}
                />
              </div>
            )}
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-2 items-center mt-4 justify-center flex-wrap">
              {product.images.map(url => (
                <Image
                  preview={false}
                  key={url}
                  loading="lazy"
                  src={url}
                  alt={product.name}
                  className={`!w-[64px] aspect-square cursor-pointer rounded-md object-contain ${img === url ? 'border-1 border-gray-300 border-(--primary)' : 'border-1 border-transparent'}`}
                  onClick={() => setImg(url)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <h1 className="font-serif text-4xl italic text-(--primary) mb-4">
            {product.name}
          </h1>

          <AddToCartSection product={product} />

          {product.description && (
            <p dangerouslySetInnerHTML={{ __html: product._origin.description ?? '' }} />
          )}

          <div className="flex flex-row gap-3 mt-6 w-full">
            {!!showPre && (
              <InfoCard
                icon={CalendarClock}
                title={
                  <>
                    Pre-order at least <br className="hidden sm:block" />
                    <span className="font-semibold text-(--primary) dark:text-white">3 days</span> in advance
                  </>
                }
              />
            )}
            <InfoCard
              icon={Store}
              title={
                <>
                  Pickup available <br className="hidden sm:block" />
                  <span className="font-semibold text-(--primary) dark:text-white">Tue-Sat, 10:30am-4pm</span>
                </>
              }
            />
          </div>
        </div>
      </div>
      <div className="mt-16">
        <RecommendedProducts products={relateds} />
      </div>
      </div>
    </>
  );
}
