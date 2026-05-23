'use client';

import { useEffect } from 'react';
import { useWarrantyDetail } from '@/src/hooks/useWarranty';
import { Link } from '../components';

export function RmaDetailPage({ rmaId }: { rmaId: string }) {
  const { detail, loading, fetch } = useWarrantyDetail();

  useEffect(() => {
    fetch(rmaId);
  }, [rmaId]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="text-center py-12 text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="text-center py-12 text-gray-400 border rounded-lg">
          <p className="text-lg mb-2">RMA request not found</p>
          <Link href="/profile/rma" className="text-sm text-(--primary) hover:underline">
            Back to RMA list
          </Link>
        </div>
      </div>
    );
  }

  const refundItems = detail.refundItems || [];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/profile/rma" className="text-sm text-(--primary) hover:underline">
          &larr; Back to RMA list
        </Link>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">RMA Request #{detail.num}</h1>
        <StatusBadge status={detail.status} />
      </div>

      {/* Status & Details */}
      <Section title="General Details">
        <Row label="Status" value={detail.status} />
        <Row label="Type" value={detail.reason} />
        <Row label="Resolution" value={detail.resolution} />
        <Row label="Request Date" value={new Date(detail.created_at).toLocaleDateString()} />
      </Section>

      {/* Items Requested */}
      <Section title="Items Requested">
        <div className="divide-y">
          {detail.items.map((item) => (
            <div key={item.id} className="py-3 flex items-center justify-between text-sm">
              <div>
                <p className="text-gray-900 font-medium">{item.name}</p>
                <p className="text-gray-400 text-xs">SKU: {item.sku}</p>
                {item.sns.map((s) => (
                  <span key={s.id} className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded mr-1">
                    {s.name}
                  </span>
                ))}
              </div>
              <span className="text-gray-600">x{item.request_qty}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Refund Items */}
      {refundItems.length > 0 && (
        <Section title="Refund Items">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-gray-500">
                  <th className="pb-2 pr-4">SKU</th>
                  <th className="pb-2 pr-4">Product</th>
                  <th className="pb-2 pr-4 text-right">Qty</th>
                  <th className="pb-2 pr-4 text-right">Unit Price</th>
                  <th className="pb-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {refundItems.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="py-3 pr-4 text-gray-500">{item.sku}</td>
                    <td className="py-3 pr-4">{item.name}</td>
                    <td className="py-3 pr-4 text-right">{item.quantity}</td>
                    <td className="py-3 pr-4 text-right">${item.unit_price.toFixed(2)}</td>
                    <td className="py-3 text-right">${item.row_total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      )}

      {/* Shipping Address */}
      {detail.shipping_address && (
        <Section title="Shipping Address">
          <div className="text-sm space-y-1 text-gray-700">
            {detail.shipping_address.name && <p>{detail.shipping_address.name}</p>}
            {detail.shipping_address.email && <p className="text-gray-500">{detail.shipping_address.email}</p>}
            {detail.shipping_address.phone && <p>{detail.shipping_address.phone}</p>}
            <p>{detail.shipping_address.address}</p>
            {detail.shipping_address.address_line_2 && <p>{detail.shipping_address.address_line_2}</p>}
            <p>
              {detail.shipping_address.city}
              {detail.shipping_address.state ? `, ${detail.shipping_address.state}` : ''}
              {detail.shipping_address.postcode ? ` ${detail.shipping_address.postcode}` : ''}
            </p>
            <p>Australia</p>
          </div>
        </Section>
      )}

      {/* Notes */}
      {detail.customer_note && (
        <Section title="Your Note">
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{detail.customer_note}</p>
        </Section>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border rounded-lg mb-6">
      <div className="bg-(--primary) text-white text-sm font-medium px-5 py-1.5 rounded-t-lg">{title}</div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex py-2 border-b last:border-0 text-sm">
      <span className="w-40 shrink-0 text-gray-500">{label}</span>
      <span className="text-gray-900">{value}</span>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    submitted: 'bg-blue-100 text-blue-700',
    received: 'bg-indigo-100 text-indigo-700',
    diagnosing: 'bg-purple-100 text-purple-700',
    result: 'bg-orange-100 text-orange-700',
    credit: 'bg-green-100 text-green-700',
    completed: 'bg-green-100 text-green-700',
    refund: 'bg-blue-100 text-blue-700',
    cancelled: 'bg-red-100 text-red-700',
  };
  const cls = colors[status] || 'bg-gray-100 text-gray-600';
  return <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cls}`}>{status}</span>;
}
