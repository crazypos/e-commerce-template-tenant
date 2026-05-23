'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from '@/src/components/Link';
import { getOrderDetailAction, type OrderDetailDisplay } from '@/src/actions/order';
import useNotify from '@/src/hooks/useNotifiy';
import useEvent from '@/src/hooks/useEvent';
import { useDateFormat } from '@/src/hooks/useDateFormat';
import { getErrorMessage, toAmount } from '@/src/utils/index';
import { ChevronLeft, MapPin, CreditCard, RefreshCw } from 'lucide-react';

export const OrderDetail: React.FC<{ orderId: string }> = ({ orderId }) => {
  const notify = useNotify();
  const { formatDateTime } = useDateFormat();
  const [order, setOrder] = useState<OrderDetailDisplay | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const fetchedIdRef = useRef<string | null>(null);

  const loadOrder = useEvent(async (id: string) => {
    if (!id) {
      setOrder(null);
      setNotFound(true);
      setLoading(false);
      return;
    }
    setLoading(true);
    setNotFound(false);
    try {
      const result = await getOrderDetailAction(id);
      if (result.success === false) {
        setNotFound(true);
        setOrder(null);
        notify.error({ content: result.message });
        return;
      }
      setOrder(result.data);
      setNotFound(false);
    } catch (e) {
      notify.error({ content: getErrorMessage(e) });
      setOrder(null);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  });

  useEffect(() => {
    if (orderId === fetchedIdRef.current) return;
    fetchedIdRef.current = orderId;
    loadOrder(orderId);
  }, [orderId]);

  const getStatusColor = useEvent((status: string) => {
    const s = (status || '').toLowerCase();
    if (s === 'paid' || s === 'delivered' || s === 'shipped') return 'bg-green-100 text-green-800';
    if (s === 'processing' || s === 'dispatched') return 'bg-blue-100 text-blue-800';
    if (s === 'unpaid' || s === 'pending') return 'bg-amber-100 text-amber-800';
    if (s === 'cancelled') return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  });

  const formatStatus = useEvent((status: string) => {
    if (!status) return 'Pending';
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  });

  const formatAddressLines = useEvent((addr: OrderDetailDisplay['address']) => {
    if (!addr) return null;
    const parts = [
      addr.address_line_1,
      addr.city,
      `${addr.state} ${addr.postcode}`,
      'Australia',
    ].filter(Boolean);
    return parts;
  });

  if (loading && !order) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-(--primary-light)/20 text-center py-20">
        <RefreshCw className="mx-auto h-10 w-10 text-(--primary-light) animate-spin" />
        <p className="mt-2 text-(--primary-dark)">Loading order...</p>
      </div>
    );
  }

  if (notFound || !order) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-(--primary-light)/20 text-center py-20">
        <p className="text-(--primary)">Order not found</p>
        <Link href="/profile/orders" className="text-(--primary-light) hover:underline mt-4 inline-block">
          Back to Orders
        </Link>
      </div>
    );
  }

  const addressLines = formatAddressLines(order.address);

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-(--primary-light)/20">
      <div className="mb-8">
        <Link
          href="/profile/orders"
          className="inline-flex items-center text-(--primary-dark) hover:!text-(--primary) mb-4 text-sm"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Orders
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl italic text-(--primary)">
              Order {order.num || order.id}
            </h1>
            <p className="text-(--primary-dark) text-sm mt-1">
              Placed on {formatDateTime(order.created_at)}
            </p>
          </div>
          <span
            className={`px-4 py-2 rounded-full text-sm uppercase tracking-widest self-start md:self-auto ${getStatusColor(order.status)}`}
          >
            {formatStatus(order.status)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {addressLines && addressLines.length > 0 && (
          <div className="bg-(--primary-light2) p-6 rounded-xl">
            <h3 className="text-xs uppercase tracking-widest text-(--primary-dark) mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Billing Address
            </h3>
            {addressLines.map((line, i) => (
              <p key={i} className="text-(--primary)">
                {line}
              </p>
            ))}
          </div>
        )}
        <div className="bg-(--primary-light2) p-6 rounded-xl">
          <h3 className="text-xs uppercase tracking-widest text-(--primary-dark) mb-4 flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Payment Summary
          </h3>
          <div className="flex justify-between mb-2">
            <span className="text-(--primary-dark)">Subtotal</span>
            <span className="text-(--primary)">${toAmount(order._origin.subtotal as string)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-(--primary-dark)">Tax</span>
            <span className="text-(--primary)">${toAmount(order.tax)}</span>
          </div>
          <div className="flex justify-between font-medium pt-2 border-t border-(--primary-light)/20 mt-2">
            <span className="text-(--primary)">Total</span>
            <span className="text-(--primary)">${toAmount(order.total)}</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-serif italic text-(--primary) mb-6">Items</h3>
        <div className="space-y-6">
          {order.items.map((item, index) => (
            <div key={`${item.variant_id}-${index}`} className="flex gap-4 items-center">
              {item.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg
                bg-gray-100" />
              ) : (
                <div className="w-20 h-20 rounded-lg bg-(--primary-light2) flex items-center justify-center text-(--primary-dark) text-sm" />
              )}
              <div className="flex-1">
                <h4 className="font-medium text-(--primary)">{item.name}</h4>
                <p className="text-sm text-(--primary-dark)">Qty: {item.quantity}</p>
              </div>
              <p className="font-medium text-(--primary)">${toAmount(Number(item.row_total))}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
