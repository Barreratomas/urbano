import { ReactNode } from 'react';
import { ChevronRight } from 'react-feather';
import { Link } from 'react-router-dom';

interface SidebarItemProps {
  children: ReactNode;
  to: string;
  active?: boolean;
}

export default function SidebarItem({ children, to, active = false }: SidebarItemProps) {
  return (
    <Link
      to={to}
      className={`no-underline relative group rounded-xl p-3 transition-all duration-300 ease-out ${
        active
          ? 'bg-urbano-primary shadow-[0_10px_20px_-10px_rgba(193,41,46,0.4)] text-white'
          : 'text-gray-500 hover:bg-white hover:shadow-md hover:text-urbano-primary'
      }`}
    >
      <span className="flex gap-4 font-bold items-center">
        <div
          className={`transition-all duration-300 ${
            active ? 'scale-110' : 'group-hover:scale-110 opacity-70 group-hover:opacity-100'
          }`}
        >
          {children}
        </div>
        {active && (
          <ChevronRight
            size={16}
            className="ml-auto opacity-80 animate-in fade-in slide-in-from-left-2 duration-500"
          />
        )}
      </span>
    </Link>
  );
}
