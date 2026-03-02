/**
 * Página de Cursos.
 * Permite listar, filtrar y gestionar los cursos disponibles en la plataforma.
 */
import { useState } from 'react';
import { Loader, Plus, RefreshCw, X } from 'react-feather';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';

import CoursesTable from '../components/courses/CoursesTable';
import Layout from '../components/layout';
import FilterSection, { FilterGroup, FilterItem } from '../components/shared/FilterSection';
import Modal from '../components/shared/Modal';
import Pagination from '../components/shared/Pagination';
import useI18n from '../context/I18nContext';
import useAuth from '../hooks/useAuth';
import CreateCourseRequest from '../models/course/CreateCourseRequest';
import courseService from '../services/CourseService';

export default function Courses() {
  const { t } = useI18n();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  // Estados para paginación y ordenamiento
  const [limit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC');

  const [addCourseShow, setAddCourseShow] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [myCoursesOnly, setMyCoursesOnly] = useState<boolean>(false);

  const { authenticatedUser } = useAuth();
  const { data, isLoading, refetch, isFetching } = useQuery(
    ['courses', name, description, offset, limit, sortBy, sortOrder, myCoursesOnly],
    () =>
      myCoursesOnly
        ? courseService.myEnrollments()
        : courseService.findAll({
            name: name || undefined,
            description: description || undefined,
            limit,
            offset,
            sortBy,
            sortOrder,
          }),
    {
      keepPreviousData: true,
    },
  );

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<CreateCourseRequest>();

  const saveCourse = async (createCourseRequest: CreateCourseRequest) => {
    try {
      await courseService.save({
        ...createCourseRequest,
        startDate: createCourseRequest.startDate || undefined,
        endDate: createCourseRequest.endDate || undefined,
      });
      setAddCourseShow(false);
      reset();
      setError(null);
      refetch();
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  const handleNextPage = () => {
    if (data && data.length === limit) {
      setOffset((prev) => prev + limit);
    }
  };

  const handlePrevPage = () => {
    setOffset((prev) => Math.max(0, prev - limit));
  };

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-4">
        <h1 className="font-semibold text-3xl">{t('courses')}</h1>
        <div className="flex flex-wrap gap-3">
          <button className="btn-refresh" onClick={() => refetch()} disabled={isFetching}>
            <RefreshCw className={isFetching ? 'animate-spin' : ''} size={18} />
            {t('refresh')}
          </button>
          {authenticatedUser.role !== 'user' ? (
            <button
              className="btn flex gap-2 items-center shadow-md hover:shadow-lg transition-all"
              onClick={() => setAddCourseShow(true)}
            >
              <Plus size={18} /> {t('addCourse')}
            </button>
          ) : null}
        </div>
      </div>
      <hr className="mb-6" />

      <FilterSection>
        <FilterGroup columns={3}>
          <FilterItem label={t('courseName')}>
            <input
              type="text"
              className="input"
              placeholder={t('filterByName')}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setOffset(0);
              }}
            />
          </FilterItem>
          <FilterItem label={t('description')}>
            <input
              type="text"
              className="input"
              placeholder={t('filterByDescription')}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setOffset(0);
              }}
            />
          </FilterItem>
          <div className="flex items-center gap-2 mb-1">
            <input
              type="checkbox"
              id="myCourses"
              className="rounded border-gray-300 w-4 h-4 text-urbano-primary focus:ring-urbano-primary"
              checked={myCoursesOnly}
              onChange={(e) => setMyCoursesOnly(e.target.checked)}
            />
            <label htmlFor="myCourses" className="text-sm font-bold text-gray-700 cursor-pointer">
              {t('myCourses')}
            </label>
          </div>
        </FilterGroup>

        <div className="pt-4 border-t border-gray-50">
          <FilterGroup columns={2}>
            <FilterItem label={t('sortBy')}>
              <select className="input" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="name">{t('name')}</option>
                <option value="description">{t('description')}</option>
                <option value="dateCreated">{t('dateCreated')}</option>
                <option value="rating">{t('rating')}</option>
              </select>
            </FilterItem>
            <FilterItem label={t('order')}>
              <select
                className="input"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'ASC' | 'DESC')}
              >
                <option value="ASC">{t('ascending')}</option>
                <option value="DESC">{t('descending')}</option>
              </select>
            </FilterItem>
          </FilterGroup>
        </div>
      </FilterSection>

      <CoursesTable data={data || []} isLoading={isLoading} onRefresh={() => refetch()} />

      <Pagination
        offset={offset}
        limit={limit}
        total={data?.length || 0}
        isLoading={isLoading}
        onPrev={handlePrevPage}
        onNext={handleNextPage}
        labelKey="coursesCount"
      />

      {/* Modal para agregar curso */}
      <Modal show={addCourseShow}>
        <div className="flex">
          <h1 className="font-semibold mb-3">{t('addCourse')}</h1>
          <button
            className="ml-auto focus:outline-none"
            onClick={() => {
              reset();
              setAddCourseShow(false);
            }}
          >
            <X size={30} />
          </button>
        </div>
        <hr />

        <form className="flex flex-col gap-5 mt-5" onSubmit={handleSubmit(saveCourse)}>
          <input
            type="text"
            className="input"
            placeholder={t('name')}
            disabled={isSubmitting}
            required
            {...register('name')}
          />
          <input
            type="text"
            className="input"
            placeholder={t('description')}
            disabled={isSubmitting}
            required
            {...register('description')}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                {t('startDate')}
              </label>
              <input
                type="date"
                className="input"
                disabled={isSubmitting}
                {...register('startDate')}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                {t('endDate')}
              </label>
              <input
                type="date"
                className="input"
                disabled={isSubmitting}
                {...register('endDate')}
              />
            </div>
          </div>
          <button className="btn" disabled={isSubmitting}>
            {isSubmitting ? <Loader className="animate-spin mx-auto" /> : t('save')}
          </button>
          {error ? (
            <div className="text-red-500 p-3 font-semibold border rounded-md bg-red-50">
              {error}
            </div>
          ) : null}
        </form>
      </Modal>
    </Layout>
  );
}
