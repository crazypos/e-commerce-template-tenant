'use client';

import { useState, useEffect } from 'react';
import { useTeamMembers } from '@/src/hooks/useTeamMembers';
import type { MemberItem } from '@/src/actions/types/account';

export function TeamMemberPage() {
  const { list, total, currentPage, lastPage, loading, fetch, memberErrors, memberSubmitting, submitMemberForm } =
    useTeamMembers();
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<MemberItem | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch({ page: 1, per_page: 20 });
  }, []);

  const openAdd = () => {
    setEditingItem(null);
    setFormData({});
    setShowForm(true);
  };

  const openEdit = (item: MemberItem) => {
    setEditingItem(item);
    setFormData({
      first_name: item.first_name || '',
      last_name: item.last_name || '',
      email: item.email || '',
      phone_number: item.phone_number || '',
    });
    setShowForm(true);
  };

  const handleMemberSubmit = (formData: Record<string, string>) => {
    submitMemberForm(formData, editingItem, () => {
      setShowForm(false);
      fetch({ page: currentPage, per_page: 20 });
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Members</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your business account team members</p>
        </div>
        {!showForm && (
          <button
            onClick={openAdd}
            className="px-4 py-2 bg-(--primary) text-white rounded-lg text-sm font-semibold hover:bg-(--primary-dark) transition-colors"
          >
            + New Member
          </button>
        )}
      </div>

      {loading && !showForm && <div className="text-center py-12 text-gray-400">Loading...</div>}

      {showForm ? (
        <MemberForm
          editItem={editingItem}
          formData={formData}
          onChange={setFormData}
          onCancel={() => setShowForm(false)}
          onSubmit={handleMemberSubmit}
          errors={memberErrors}
          submitting={memberSubmitting}
        />
      ) : (
        <>
          {list.length === 0 && !loading && (
            <div className="text-center py-12 text-gray-400 border rounded-lg">
              <p className="text-lg mb-2">No team members yet</p>
              <p className="text-sm">Click &quot;+ New Member&quot; to add your first team member</p>
            </div>
          )}

          <div className="space-y-3">
            {list.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 bg-white border rounded-lg hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-(--primary-light) flex items-center justify-center text-(--primary) font-semibold text-lg">
                    {item.first_name?.[0]}
                    {item.last_name?.[0]}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {item.first_name} {item.last_name}
                    </p>
                    <p className="text-sm text-gray-500">{item.email}</p>
                    <span className="text-xs text-gray-400">{item.phone_number}</span>
                  </div>
                </div>
                <button
                  onClick={() => openEdit(item)}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Edit
                </button>
              </div>
            ))}
          </div>

          {lastPage > 1 && (
            <div className="flex items-center justify-between mt-6 text-sm text-gray-500">
              <span>Total {total} members</span>
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
        </>
      )}
    </div>
  );
}

function MemberForm({
  editItem,
  formData,
  onChange,
  onCancel,
  onSubmit,
  errors,
  submitting,
}: {
  editItem: MemberItem | null;
  formData: Record<string, string>;
  onChange: (data: Record<string, string>) => void;
  onCancel: () => void;
  onSubmit: (data: Record<string, string>) => void;
  errors: Record<string, string>;
  submitting: boolean;
}) {
  const set = (key: string, value: string) => onChange({ ...formData, [key]: value });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white border rounded-lg p-6 max-w-lg">
      <h2 className="text-lg font-bold text-gray-900 mb-1">{editItem ? 'Edit Team Member' : 'New Team Member'}</h2>
      <p className="text-sm text-gray-500 mb-6">Account Information</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="First Name"
            value={formData.first_name || ''}
            onChange={(v) => set('first_name', v)}
            error={errors.first_name}
          />
          <FormField
            label="Last Name"
            value={formData.last_name || ''}
            onChange={(v) => set('last_name', v)}
            error={errors.last_name}
          />
        </div>
        <FormField
          label="Email Address"
          type="email"
          value={formData.email || ''}
          onChange={(v) => set('email', v)}
          error={errors.email}
        />
        <FormField
          label="Phone Number"
          type="tel"
          value={formData.phone_number || ''}
          onChange={(v) => set('phone_number', v)}
        />

        {!editItem && (
          <>
            <FormField
              label="Password"
              type="password"
              value={formData.password || ''}
              onChange={(v) => set('password', v)}
              error={errors.password}
            />
            <FormField
              label="Confirm Password"
              type="password"
              value={formData.confirm_password || ''}
              onChange={(v) => set('confirm_password', v)}
              error={errors.confirm_password}
            />
          </>
        )}

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 px-4 py-2.5 bg-(--primary) text-white rounded-lg text-sm font-semibold hover:bg-(--primary-dark) transition-colors disabled:opacity-50"
          >
            {submitting ? 'Saving...' : 'Save Information'}
          </button>
        </div>
      </form>
    </div>
  );
}

function FormField({
  label,
  type = 'text',
  value,
  onChange,
  error,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-(--primary) focus:border-(--primary) ${error ? 'border-red-500' : 'border-gray-300'}`}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
