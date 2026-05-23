'use client';
import React from 'react';
import { OrderDetail } from '../components';

export function OrderDetailPage({ orderId }: { orderId: string }) {
  return <OrderDetail orderId={orderId} />;
}
