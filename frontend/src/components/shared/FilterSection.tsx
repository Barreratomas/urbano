import React, { ReactNode } from 'react';

interface FilterSectionProps {
  children: ReactNode;
  className?: string;
}

export default function FilterSection({ children, className = '' }: FilterSectionProps) {
  return (
    <div
      className={`bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 mb-6 ${className}`}
    >
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
}

interface FilterGroupProps {
  children: ReactNode;
  columns?: 1 | 2 | 3 | 4;
}

export function FilterGroup({ children, columns = 3 }: FilterGroupProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return <div className={`grid ${gridCols[columns]} gap-4 items-end`}>{children}</div>;
}

interface FilterItemProps {
  label: string;
  children: ReactNode;
  className?: string;
}

export function FilterItem({ label, children, className = '' }: FilterItemProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
        {label}
      </label>
      {children}
    </div>
  );
}
