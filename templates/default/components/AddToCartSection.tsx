'use client';

import React, { useState, useMemo } from 'react';
import { Minus, Plus } from 'lucide-react';
import clsx from 'clsx';
import { useCart } from '@/src/context/CartContext';
import useNotify from '@/src/hooks/useNotifiy';
import useEvent from '@/src/hooks/useEvent';
import { getErrorMessage, getInventoryStock } from '@/src/utils';
import { matchVariantByAttributes, defaultSelectedAttributes } from '@/src/utils/variant';
import type { ProductDetailView } from '@/src/actions/product';
import { NotifyMeModal } from '@/src/components/NotifyMeModal';
import Price, { getVariantPrice } from '@/src/components/Price';
import { useAuth } from '@/src/context/AuthContext';

interface AddToCartSectionProps {
  product: ProductDetailView;
}

interface FieldErrors {
  variant?: string;
  quantity?: string;
}

export function AddToCartSection({ product }: AddToCartSectionProps) {
  const { user } = useAuth();
  const { cartLoading, addToCart } = useCart();
  const notify = useNotify();
  const hasAttributes = product.attributes && product.attributes.length > 0;
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>(() =>
    hasAttributes ? defaultSelectedAttributes(product.attributes!) : {}
  );
  const [quantity, setQuantity] = useState(1);
  const [errors, setErrors] = useState<FieldErrors>({});

  const [selectedVariantIdWhenNoAttrs, setSelectedVariantIdWhenNoAttrs] = useState<number | null>(
    null
  );
  const [notifyOpen, setNotifyOpen] = useState(false);

  const selectedVariant = useMemo(() => {
    if (hasAttributes && product.variants?.length) {
      return matchVariantByAttributes(product.variants, selectedAttributes);
    }
    if (product.variants?.length) {
      const id = selectedVariantIdWhenNoAttrs ?? product.variants[0].id;
      return product.variants.find((v) => v.id === id) ?? product.variants[0];
    }
    return undefined;
  }, [hasAttributes, product.variants, selectedAttributes, selectedVariantIdWhenNoAttrs]);

  const originVariant = useMemo(() => {
    return product._origin.variants?.find((v) => v.id === selectedVariant?.id) ?? product._origin.variants?.[0];
  }, [product._origin.variants, selectedVariant?.id]);

  const stock = useMemo(() => {
    return getInventoryStock(originVariant);
  }, [originVariant]);

  const validate = useEvent((): boolean => {
    const next: FieldErrors = {};
    if (product.variants && product.variants.length > 0 && !selectedVariant) {
      next.variant = 'Please select an option.';
    }
    if (quantity < 1) {
      next.quantity = 'Quantity must be at least 1.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  });

  const handleAddToCart = useEvent(() => {
    if (!validate()) {
      notify.error({ content: 'Please fix the errors below.' });
      return;
    }
    const variantId = selectedVariant?.id ?? Number(product.id);
    const variantName = product.variants?.length > 1 ? selectedVariant?.title ?? selectedVariant?.name : null;
    const price = getVariantPrice(originVariant, product._origin.promotion ?? product._origin.promoiton, !!user)?.[0];

    try {
      addToCart(
        {
          productId: product.id,
          variantId,
          name: product.name,
          price,
          image: product.image,
          variantName,
        },
        quantity
      );
    } catch (error) {
      notify.error({ content: getErrorMessage(error) });
    }
  });

  const handleAttributeChange = useEvent((attrName: string, value: string) => {
    setSelectedAttributes((prev) => ({ ...prev, [attrName]: value }));
    if (errors.variant) setErrors((prev) => ({ ...prev, variant: undefined }));
  });

  const handleQuantityChange = useEvent((delta: number) => {
    const next = Math.max(1, quantity + delta);
    setQuantity(next);
    if (errors.quantity) setErrors((prev) => ({ ...prev, quantity: undefined }));
  });

  const handleInputChange = useEvent((e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^\d]/g, '');
    if (raw === '') {
      setQuantity(1);
    } else {
      const parsed = Number(raw);
      const next = Number.isNaN(parsed) ? 1 : Math.max(1, parsed);
      setQuantity(next);
    }
    if (errors.quantity) setErrors((prev) => ({ ...prev, quantity: undefined }));
  });

  return (
    <>
      <p className="text-2xl font-mono text-(--primary-dark) mb-8 space-x-2">
        <Price
          variants={[originVariant]}
          promotion={product._origin.promotion ?? product._origin.promoiton}
        />
      </p>

      {hasAttributes && (
        <div className="mb-8 space-y-6">
          {product.attributes!.map((attr) => (
            <div key={attr.id}>
              <label className="block text-sm uppercase tracking-widest text-(--primary-dark) mb-3">
                {attr.name}
              </label>
              <div className="flex flex-wrap gap-3">
                {attr.values.map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handleAttributeChange(attr.name, value)}
                    className={clsx(
                      'px-6 py-3 rounded-full border transition-all',
                      selectedAttributes[attr.name] === value
                        ? 'border-(--primary) bg-(--primary) text-white'
                        : 'border-(--primary-light) text-(--primary) hover:border-(--primary)'
                    )}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
          ))}
          {errors.variant && (
            <p className="mt-2 text-sm text-red-600" role="alert">
              {errors.variant}
            </p>
          )}
        </div>
      )}

      {!hasAttributes && product.variants && product.variants.length > 1 && (
        <div className="mb-8">
          <label className="block text-sm uppercase tracking-widest text-(--primary-dark) mb-3">
            Option
          </label>
          <div className="flex flex-wrap gap-3">
            {product.variants.map((variant) => (
              <button
                key={variant.id}
                type="button"
                onClick={() => {
                  setSelectedVariantIdWhenNoAttrs(variant.id);
                  if (errors.variant) setErrors((prev) => ({ ...prev, variant: undefined }));
                }}
                className={clsx(
                  'px-6 py-3 rounded-full border transition-all',
                  selectedVariant?.id === variant.id
                    ? 'border-(--primary) bg-(--primary) text-white'
                    : 'border-(--primary-light) text-(--primary) hover:border-(--primary)'
                )}
              >
                {variant.title || variant.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-6 mb-8">
        <div>
          <div className="flex items-center border border-(--primary-light) rounded-full px-4 py-3 gap-4">
            <button
              type="button"
              onClick={() => handleQuantityChange(-1)}
              aria-label="Decrease quantity"
              className="hover:!text-(--primary-light) transition-colors"
              disabled={!stock}
            >
              <Minus className="w-4 h-4" />
            </button>
            <input
              type="number"
              min={1}
              inputMode="numeric"
              pattern="[0-9]*"
              aria-label={`Current quantity is ${quantity}`}
              className="text-sm w-10 text-center bg-transparent outline-none [&::-webkit-inner-spin-button]:appearance-none"
              value={quantity}
              onChange={handleInputChange}
              disabled={!stock}
            />
            <button
              type="button"
              onClick={() => handleQuantityChange(1)}
              aria-label="Increase quantity"
              className="hover:!text-(--primary-light) transition-colors"
              disabled={!stock}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          {errors.quantity && (
            <p className="mt-2 text-sm text-red-600" role="alert">
              {errors.quantity}
            </p>
          )}
        </div>

        {!stock ? (
          <button
            type="button"
            onClick={() => setNotifyOpen(true)}
            className="flex-1 bg-(--primary-dark) text-white py-4 rounded-full uppercase tracking-widest font-medium hover:opacity-90 transition-opacity"
          >
            Out of Stock - Notify Me
          </button>
        ) : (
          <button
            type="button"
            onClick={handleAddToCart}
            className="flex-1 bg-(--primary-light) text-(--primary) py-4 rounded-full uppercase tracking-widest font-medium hover:bg-(--primary) hover:text-white transition-colors"
            disabled={cartLoading}
          >
            {cartLoading ? 'Adding to Cart...' : 'Add to Cart'}
          </button>
        )}
      </div>

      <NotifyMeModal
        isOpen={notifyOpen}
        onClose={() => setNotifyOpen(false)}
        productName={
          selectedVariant && product.variants?.length > 1
            ? `${product.name} - ${selectedVariant.title || selectedVariant.name}`
            : product.name
        }
        productId={product.id}
        variantId={selectedVariant?.id ?? 0}
      />
    </>
  );
}
