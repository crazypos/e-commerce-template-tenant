'use client';

import { useState } from 'react';
import { useCreateWarranty, useWarrantySearch } from '@/src/hooks/useWarranty';
import { Link } from '../components';

const REQUEST_TYPES = [
  { value: 'Product Faulty', label: 'Product Faulty' },
  { value: 'Wrong Item', label: 'Wrong Item' },
  { value: 'Damaged', label: 'Damaged' },
  { value: 'Missing Parts', label: 'Missing Parts' },
  { value: 'Change of Mind', label: 'Change of Mind' },
  { value: 'Other', label: 'Other' },
];

const RESOLUTIONS = [
  { value: 'Store Credit', label: 'Store Credit' },
  { value: 'Replacement', label: 'Replacement' },
  { value: 'Refund', label: 'Refund' },
  { value: 'Repair', label: 'Repair' },
];

interface ItemRow {
  key: number;
  name: string;
  variant_id?: number;
  product_id?: number;
  quantity: number;
}

let nextKey = 1;

export function RmaCreatePage() {
  const { submitting, submit } = useCreateWarranty();
  const { searching, searchProducts } = useWarrantySearch();

  const [reason, setReason] = useState('Product Faulty');
  const [resolution, setResolution] = useState('Store Credit');
  const [note, setNote] = useState('');
  const [items, setItems] = useState<ItemRow[]>([{ key: nextKey++, name: '', quantity: 1 }]);
  const [suggestions, setSuggestions] = useState<{ variant_id: number; product_id: number; name: string }[]>([]);
  const [activeSearchKey, setActiveSearchKey] = useState<number | null>(null);

  // customer_id — the server action infers it from the session cookie.
  const customerId = 0;

  const handleProductSearch = async (key: number, value: string) => {
    setActiveSearchKey(key);
    if (value.length < 2) {
      setSuggestions([]);
      return;
    }
    const results = await searchProducts(value, customerId);
    setSuggestions(results);
  };

  const selectProduct = (key: number, product: { variant_id: number; product_id: number; name: string }) => {
    setItems((prev) =>
      prev.map((item) =>
        item.key === key
          ? { ...item, name: product.name, variant_id: product.variant_id, product_id: product.product_id }
          : item
      )
    );
    setSuggestions([]);
    setActiveSearchKey(null);
  };

  const addItem = () => {
    setItems((prev) => [...prev, { key: nextKey++, name: '', quantity: 1 }]);
  };

  const removeItem = (key: number) => {
    setItems((prev) => prev.filter((item) => item.key !== key));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validItems = items.filter((item) => item.name.trim());
    if (validItems.length === 0) {
      alert('Please add at least one product.');
      return;
    }

    const payload: Record<string, unknown> = {
      reason,
      resolution,
      note: note.trim() || undefined,
      items: validItems.map((item) => ({
        variant_id: item.variant_id,
        product_id: item.product_id,
        name: item.name,
        quantity: item.quantity,
      })),
    };

    const ok = await submit(payload);
    if (ok) {
      window.location.href = '/profile/rma';
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/profile/rma" className="text-sm text-(--primary) hover:underline">
          &larr; Back to RMA list
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-1">New RMA Request</h1>
      <p className="text-sm text-gray-500 mb-8">Submit a return merchandise authorisation request</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Request Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Request Type</label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-(--primary) focus:border-(--primary)"
          >
            {REQUEST_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* Resolution */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Resolution</label>
          <select
            value={resolution}
            onChange={(e) => setResolution(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-(--primary) focus:border-(--primary)"
          >
            {RESOLUTIONS.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

        {/* Products */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-700">Products</label>
            <button type="button" onClick={addItem} className="text-sm text-(--primary) font-medium hover:underline">
              + Add Product
            </button>
          </div>

          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.key} className="flex gap-3 items-start">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Search product name"
                    value={item.name}
                    onChange={(e) => {
                      setItems((prev) => prev.map((i) => (i.key === item.key ? { ...i, name: e.target.value } : i)));
                      handleProductSearch(item.key, e.target.value);
                    }}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-(--primary) focus:border-(--primary)"
                  />
                  {activeSearchKey === item.key && suggestions.length > 0 && (
                    <div className="absolute z-10 top-full mt-1 left-0 right-0 bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {suggestions.map((s) => (
                        <button
                          key={s.variant_id}
                          type="button"
                          onClick={() => selectProduct(item.key, s)}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                        >
                          {s.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) =>
                    setItems((prev) =>
                      prev.map((i) => (i.key === item.key ? { ...i, quantity: parseInt(e.target.value) || 1 } : i))
                    )
                  }
                  className="w-20 border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-center focus:outline-none focus:ring-(--primary) focus:border-(--primary)"
                />
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(item.key)}
                    className="text-red-400 hover:text-red-600 pt-2.5 px-1"
                    title="Remove"
                  >
                    &times;
                  </button>
                )}
              </div>
            ))}
            {searching && <p className="text-xs text-gray-400">Searching...</p>}
          </div>
        </div>

        {/* Note */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Note (optional)</label>
          <textarea
            rows={4}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Describe the issue..."
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-(--primary) focus:border-(--primary)"
          />
        </div>

        {/* Submit */}
        <div className="flex gap-3 pt-4">
          <Link
            href="/profile/rma"
            className="flex-1 text-center px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 px-4 py-2.5 bg-(--primary) text-white rounded-lg text-sm font-semibold hover:bg-(--primary-dark) transition-colors disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Submit RMA Request'}
          </button>
        </div>
      </form>
    </div>
  );
}
