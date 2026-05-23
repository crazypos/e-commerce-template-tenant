'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from '@/src/components/Link';
import { getOrdersListAction, type OrderDisplay, type OrderDisplayItem } from '@/src/actions/order';
import { batchAddToCartAction } from '@/src/actions/cart';
import useNotify from '@/src/hooks/useNotifiy';
import useEvent from '@/src/hooks/useEvent';
import { useDateFormat } from '@/src/hooks/useDateFormat';
import { getErrorMessage, toAmount } from '@/src/utils/index';
import { useCart } from '@/src/context/CartContext';
import { Pagination } from 'antd';
import { ChevronRight, Package, RefreshCw } from 'lucide-react';

const PER_PAGE = 10;

export const OrderList: React.FC = () => {
  const notify = useNotify();
  const { refetchCart } = useCart();
  const { formatDateTime } = useDateFormat();
  const [orders, setOrders] = useState<OrderDisplay[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const [reorderLoadingId, setReorderLoadingId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const initialFetchedRef = useRef(false);

  const loadOrders = useEvent(async (page: number = 1) => {
    setListLoading(true);
    try {
      const result = await getOrdersListAction({
        page,
        per_page: PER_PAGE,
        type: 'regular',
      });
      if (result.success === false) {
        throw new Error(result.message);
      }
      setOrders(result.data);
      setCurrentPage(result.current_page);
      setTotal(result.total);
    } catch (e) {
      notify.error({ content: getErrorMessage(e) });
      setOrders([]);
    } finally {
      setListLoading(false);
    }
  });

  useEffect(() => {
    if (initialFetchedRef.current) return;
    initialFetchedRef.current = true;
    loadOrders(1);
  }, []);

  const handleRefresh = useEvent(() => {
    initialFetchedRef.current = false;
    loadOrders(1);
  });

  const handleReorder = useEvent(async (order: OrderDisplay) => {
    if (!order.items?.length) {
      notify.warning({ content: 'No items to reorder.' });
      return;
    }
    setReorderLoadingId(order.id);
    try {
      const result = await batchAddToCartAction(
        order.items.map((item: OrderDisplayItem) => ({ variant_id: item.variant_id, quantity: item.quantity }))
      );
      if (result.success) {
        await refetchCart();
        notify.success({ content: result.message ?? 'Items added to cart.' });
      } else {
        notify.error({ content: result.message ?? 'Failed to add items to cart.' });
      }
    } catch (e) {
      notify.error({ content: getErrorMessage(e) });
    } finally {
      setReorderLoadingId(null);
    }
  });

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

  return (
    <div className="bg-white py-4 px-2 md:p-8 rounded-2xl shadow-sm border border-(--primary-light)/20">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <h2 className="font-serif text-2xl italic text-(--primary)">My Orders</h2>
        <button
          type="button"
          onClick={handleRefresh}
          disabled={listLoading}
          className="flex items-center text-(--primary-dark) hover:text-(--primary) font-medium text-sm transition-colors bg-(--primary-light2) border border-(--primary-light)/30 hover:bg-(--primary-light)/10 px-3 py-1.5 rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {listLoading ? (
            <>
              <RefreshCw size={14} className="mr-2 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <RefreshCw size={14} className="mr-2" />
              Refresh
            </>
          )}
        </button>
      </div>

      {listLoading && orders.length === 0 ? (
        <div className="text-center py-16">
          <RefreshCw className="mx-auto h-10 w-10 text-(--primary-light) animate-spin" />
          <p className="mt-2 text-sm text-(--primary-dark)">Loading orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-(--primary-light2) rounded-full flex items-center justify-center mx-auto mb-4 text-(--primary-light)">
            <Package className="w-8 h-8" />
          </div>
          <p className="text-(--primary) font-medium">No orders yet</p>
          <p className="text-(--primary-dark) text-sm mt-2">Start shopping to see your orders here.</p>
          <Link href="/" className="inline-block mt-6 text-(--primary) underline hover:no-underline">
            Browse Products
          </Link>
        </div>
      ) : (<>
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border border-(--primary-light)/30 rounded-xl p-6 hover:border-(--primary-light) transition-colors hover:shadow-lg"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <Link
                    href={`/profile/orders/${order.id}`}
                    className="font-mono text-sm text-(--primary-dark) hover:text-(--primary)"
                  >
                    #{order.num || order.id}
                  </Link>
                  <p className="text-(--primary) font-medium mt-1">
                    {formatDateTime(order.created_at)}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs uppercase tracking-widest ${getStatusColor(order.status)}`}
                >
                  {formatStatus(order.status)}
                </span>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex -space-x-3">
                  {order.items.slice(0, 3).map((item, index) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={index}
                      src={item.image}
                      alt={item.name}
                      className="w-10 h-10 rounded-full border-2 border-white object-cover"
                    />
                  ))}
                  {order.items.length > 3 && (
                    <div className="w-10 h-10 rounded-full border-2 border-white bg-(--primary-light2) flex items-center justify-center text-xs text-(--primary-dark)">
                      +{order.items.length - 3}
                    </div>
                  )}
                </div>
                <p className="text-sm text-(--primary-dark)">
                  {order.items?.length ?? 0} item{(order.items?.length ?? 0) !== 1 ? 's' : ''}
                </p>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-(--primary-light)/10">
                <span className="font-medium text-(--primary)">${toAmount(Number(order.total))}</span>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => handleReorder(order)}
                    disabled={reorderLoadingId !== null}
                    className="text-sm font-medium text-(--primary-dark) hover:text-(--primary) disabled:opacity-50 disabled:cursor-not-allowed)"
                  >
                    {reorderLoadingId === order.id ? (
                      <>
                        <RefreshCw size={14} className="inline mr-1 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      'Reorder'
                    )}
                  </button>
                  <div className='h-4 w-[1px] bg-(--primary)/20' />
                  <Link
                    href={`/profile/orders/${order.id}`}
                    className="flex items-center text-(--primary-light) hover:!text-(--primary) transition-colors text-sm font-medium"
                  >
                    View Details
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center pt-6 mt-6 border-t border-(--primary-light)/10">
          <Pagination
            hideOnSinglePage
            current={currentPage}
            total={total}
            pageSize={PER_PAGE}
            onChange={(page) => loadOrders(page)}
            disabled={listLoading}
            showSizeChanger={false}
          />
        </div>
      </>)}
    </div>
  );
};
