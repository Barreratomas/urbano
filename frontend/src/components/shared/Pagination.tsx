import { ChevronLeft, ChevronRight } from 'react-feather';

import useI18n from '../../context/I18nContext';

interface PaginationProps {
  offset: number;
  limit: number;
  total: number;
  isLoading: boolean;
  onPrev: () => void;
  onNext: () => void;
  labelKey: string;
}

export default function Pagination({
  offset,
  limit,
  total,
  isLoading,
  onPrev,
  onNext,
  labelKey,
}: PaginationProps) {
  const { t } = useI18n();

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mt-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100 gap-4">
      <p className="text-sm text-gray-500 font-medium">
        {t('showing')} <span className="font-bold text-urbano-primary">{offset + 1}</span> {t('to')}{' '}
        <span className="font-bold text-urbano-primary">{offset + total}</span> {t(labelKey)}
      </p>
      <div className="flex gap-2">
        <button
          className="btn !p-2 !bg-gray-50 !text-gray-600 hover:!bg-gray-100 disabled:opacity-30 transition-all border border-gray-200"
          onClick={onPrev}
          disabled={offset === 0 || isLoading}
        >
          <ChevronLeft size={20} />
        </button>
        <button
          className="btn !p-2 !bg-gray-50 !text-gray-600 hover:!bg-gray-100 disabled:opacity-30 transition-all border border-gray-200"
          onClick={onNext}
          disabled={isLoading || total < limit}
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
