import React from 'react';
import { LucideIcon } from 'lucide-react';

interface InfoCardProps {
  icon: LucideIcon;
  title: React.ReactNode;
  className?: string;
}

export function InfoCard({ icon: Icon, title, className = '' }: InfoCardProps) {
  return (
    <div className={`bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-3 sm:p-4 flex flex-col items-start gap-2 flex-1 ${className}`}>
      <Icon className="w-5 h-5 text-(--primary-light) dark:text-(--primary-light)" />
      <div className="text-xs text-(--primary-dark) dark:text-gray-300 leading-snug">
        {title}
      </div>
    </div>
  );
}
