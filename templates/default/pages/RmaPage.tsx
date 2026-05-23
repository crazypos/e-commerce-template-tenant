'use client';

import { useEffect } from 'react';
import { useWarrantyList } from '@/src/hooks/useWarranty';
import { Link } from '../components';

export function RmaPage() {
  const { list, total, currentPage, lastPage, loading, fetch } = useWarrantyList();

  useEffect(() => {
    fetch({ page: 1, per_page: 20 });
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">RMA Requests</h1>
          <p className="text-sm text-gray-500 mt-1">Return Merchandise Authorisation requests</p>
        </div>
        <Link
          href="/profile/rma/create"
          className="px-4 py-2 bg-(--primary) text-white rounded-lg text-sm font-semibold hover:bg-(--primary-dark) transition-colors"
        >
          + New RMA Request
        </Link>
      </div>

      {loading && <div className="text-center py-12 text-gray-400">Loading...</div>}

      {list.length === 0 && !loading && (
        <div className="text-center py-12 text-gray-400 border rounded-lg">
          <p className="text-lg mb-2">No RMA requests yet</p>
          <p className="text-sm">Click &quot;+ New RMA Request&quot; to create your first request</p>
        </div>
      )}

      <div className="space-y-4">
        {list.map((rma) => (
          <div key={rma.id} className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-sm font-mono text-gray-400">#{rma.num}</span>
                <StatusBadge status={rma.status} />
              </div>
              <Link href={`/profile/rma/${rma.id}`} className="text-sm text-(--primary) font-medium hover:underline">
                View Details
              </Link>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-500">
              <span>Type: {rma.reason || '-'}</span>
              <span>Resolution: {rma.resolution || '-'}</span>
              <span className="text-xs">{new Date(rma.created_at).toLocaleDateString()}</span>
            </div>
            <div className="mt-2 space-y-1">
              {rma.items.map((item) => (
                <div key={item.id} className="text-sm text-gray-700 flex items-center gap-2">
                  <span className="text-gray-400">x{item.request_qty}</span>
                  <span>{item.name}</span>
                  {item.sns.map((s) => (
                    <span key={s.id} className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                      {s.name}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {lastPage > 1 && (
        <div className="flex items-center justify-between mt-6 text-sm text-gray-500">
          <span>Total {total} requests</span>
          <div className="flex gap-2">
            <button
              disabled={currentPage <= 1}
              onClick={() => fetch({ page: currentPage - 1, per_page: 20 })}
              className="px-3 py-1.5 border rounded-lg disabled:opacity-30 hover:bg-gray-50"
            >
              Prev
            </button>
            <span className="px-3 py-1.5">
              {currentPage} / {lastPage}
            </span>
            <button
              disabled={currentPage >= lastPage}
              onClick={() => fetch({ page: currentPage + 1, per_page: 20 })}
              className="px-3 py-1.5 border rounded-lg disabled:opacity-30 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
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
