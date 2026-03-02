/**
 * Página de Calendario de Cursos.
 * Permite visualizar los cursos programados mensualmente y filtrar por inscripciones.
 */
import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, RefreshCw } from 'react-feather';
import { useQuery } from 'react-query';

import Layout from '../components/layout';
import useI18n from '../context/I18nContext';
import courseService from '../services/CourseService';

/**
 * Formatea una fecha en formato YYYY-MM-DD.
 */
function formatDate(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Obtiene el rango de fechas (inicio y fin) para el mes de la fecha proporcionada.
 */
function getMonthRange(date: Date) {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return {
    start: formatDate(start),
    end: formatDate(end),
  };
}

export default function Calendar() {
  const { t, lang } = useI18n();
  const [current, setCurrent] = useState(new Date());
  const [onlyMyCourses, setOnlyMyCourses] = useState(false);
  const params = useMemo(() => getMonthRange(current), [current]);

  // Consulta de datos del calendario mediante React Query
  const { data, isLoading, refetch, isFetching } = useQuery(
    ['calendar', params],
    () => courseService.getCalendar(params),
    { keepPreviousData: true },
  );

  // Calcula todos los días del mes actual para renderizar la cuadrícula
  const daysInMonth = useMemo(() => {
    const startDate = new Date(current.getFullYear(), current.getMonth(), 1);
    const endDate = new Date(current.getFullYear(), current.getMonth() + 1, 0);
    const days = [];
    for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d));
    }
    return days;
  }, [current]);

  // Mapea los cursos obtenidos a sus respectivas fechas
  const coursesByDate = useMemo(() => {
    const map: Record<string, { date: string; courses: any[] }> = {};
    (data || []).forEach((item) => {
      const filtered = onlyMyCourses ? item.courses.filter((c: any) => c.isEnrolled) : item.courses;
      if (filtered.length > 0 || !onlyMyCourses) {
        map[item.date] = { ...item, courses: filtered };
      }
    });
    return map;
  }, [data, onlyMyCourses]);

  const monthLabel = current.toLocaleString(lang, {
    month: 'long',
    year: 'numeric',
  });

  return (
    <Layout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-5 gap-4">
        <h1 className="font-semibold text-3xl">{t('courseCalendar')}</h1>
        <div className="flex flex-wrap gap-3">
          <label className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors shadow-sm">
            <input
              type="checkbox"
              className="form-checkbox h-4 w-4 text-urbano-primary rounded border-gray-300 focus:ring-urbano-primary"
              checked={onlyMyCourses}
              onChange={(e) => setOnlyMyCourses(e.target.checked)}
            />
            <span className="text-sm font-medium text-gray-700">{t('onlyMyCourses')}</span>
          </label>

          <div className="flex gap-2">
            <button
              className="btn !p-2 !bg-gray-50 !text-gray-600 border border-gray-200"
              onClick={() => setCurrent(new Date(current.getFullYear(), current.getMonth() - 1, 1))}
            >
              <ChevronLeft size={18} />
            </button>
            <div className="px-4 py-2 rounded-full bg-gray-50 text-sm font-semibold flex items-center capitalize">
              {monthLabel}
            </div>
            <button
              className="btn !p-2 !bg-gray-50 !text-gray-600 border border-gray-200"
              onClick={() => setCurrent(new Date(current.getFullYear(), current.getMonth() + 1, 1))}
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <button
            className="btn-refresh flex gap-2 items-center"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCw className={isFetching ? 'animate-spin' : ''} size={18} />
            {t('refresh')}
          </button>
        </div>
      </div>
      <hr className="mb-6" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {daysInMonth.map((d) => {
          const key = formatDate(d);
          const entry = coursesByDate[key];
          const hasCourses = entry && entry.courses.length > 0;

          if (onlyMyCourses && !hasCourses) return null;

          return (
            <div
              key={key}
              className={`card transition-all duration-200 ${
                hasCourses ? 'border-l-4 border-l-urbano-primary' : 'opacity-60'
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <div className="text-sm font-bold capitalize">
                  {d.toLocaleDateString(lang, {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })}
                </div>
                <span className="text-xs text-gray-500 font-semibold">
                  {entry
                    ? `${entry.courses.length} ${t('coursesCount')}`
                    : `0 ${t('coursesCount')}`}
                </span>
              </div>
              <ul className="space-y-1">
                {entry?.courses?.map((c) => (
                  <li
                    key={c.id}
                    className={`text-sm p-2 rounded-md border flex flex-col gap-1 ${
                      c.isEnrolled ? 'bg-blue-50 border-blue-100' : 'bg-gray-50 border-gray-100'
                    }`}
                  >
                    <div className="font-medium">{c.name}</div>
                    {c.isEnrolled && (
                      <div className="flex items-center gap-1 text-[10px] text-blue-600 font-bold uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></span>
                        {t('enrolled')}
                      </div>
                    )}
                  </li>
                )) || null}
              </ul>
              {isLoading && !entry ? (
                <div className="text-xs text-gray-400 mt-2">{t('loading')}</div>
              ) : null}
            </div>
          );
        })}
      </div>
    </Layout>
  );
}
