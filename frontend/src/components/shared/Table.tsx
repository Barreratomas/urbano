import { ReactNode } from 'react';

interface TableColumn {
  label: string;
  className?: string;
}

interface TableProps {
  columns: TableColumn[];
  children: ReactNode;
}

export default function Table({ columns, children }: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-urbano-header">
          <tr>
            {columns.map((column) => (
              <th
                key={column.label}
                scope="col"
                className={`px-4 sm:px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider ${
                  column.className || 'text-left'
                }`}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">{children}</tbody>
      </table>
    </div>
  );
}
