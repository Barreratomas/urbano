import { RefreshCw } from 'react-feather';
import { useQuery } from 'react-query';

import CoursesTable from '../components/courses/CoursesTable';
import Layout from '../components/layout';
import useI18n from '../context/I18nContext';
import courseService from '../services/CourseService';

export default function Favorites() {
  const { t } = useI18n();
  const { data, isLoading, refetch, isFetching } = useQuery(
    ['favorites'],
    () => courseService.myFavorites(),
    { keepPreviousData: true },
  );

  return (
    <Layout>
      <div className="flex justify-between items-center mb-5">
        <h1 className="font-semibold text-3xl">{t('myFavorites')}</h1>
        <div className="flex gap-3">
          <button className="btn-refresh" onClick={() => refetch()} disabled={isFetching}>
            <RefreshCw className={isFetching ? 'animate-spin' : ''} size={18} />
            {t('refresh')}
          </button>
        </div>
      </div>
      <hr className="mb-6" />

      <CoursesTable data={data || []} isLoading={isLoading} onRefresh={() => refetch()} />
    </Layout>
  );
}
