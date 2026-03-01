import { HTMLProps, ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps extends HTMLProps<HTMLDivElement> {
  className?: string;
  children?: ReactNode;
  show: boolean;
}

export default function Modal({ children, className, show }: ModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (show) {
      setIsVisible(true);
    } else {
      timeout = setTimeout(() => {
        setIsVisible(false);
      }, 150);
    }

    return () => clearTimeout(timeout);
  }, [show]);

  return createPortal(
    <div
      className={`fixed inset-0 z-50 bg-gray-900 bg-opacity-30 
flex justify-center items-center backdrop-filter backdrop-blur-sm transition-opacity p-4 ${
        show ? 'opacity-100' : 'opacity-0'
      } ${isVisible ? 'visible' : 'invisible'}`}
    >
      <div
        className={
          'w-full max-w-2xl max-h-[90vh] overflow-y-auto card shadow-2xl relative transition-all transform ' +
          (show ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4') +
          ' ' +
          className
        }
      >
        {children}
      </div>
    </div>,
    document.getElementById('modal'),
  );
}
