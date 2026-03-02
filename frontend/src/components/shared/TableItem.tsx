/**
 * Componente de Celda de Tabla.
 * Estiliza las celdas individuales para mantener consistencia visual.
 */
import { ReactNode } from 'react';

interface TableItemProps {
  children: ReactNode;
  className?: string;
}

export default function TableItem({ children, className }: TableItemProps) {
  return (
    <td className={`px-4 sm:px-6 py-4 text-sm text-gray-600 whitespace-nowrap ${className || ''}`}>
      {children}
    </td>
  );
}
