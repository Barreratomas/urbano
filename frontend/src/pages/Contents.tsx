/**
 * Página de Contenidos de un Curso.
 * Muestra las lecciones/contenidos asociados a un curso y permite la gestión (CRUD) por parte de administradores.
 */
import { useState } from 'react';
import { Loader, Plus, RefreshCw, X } from 'react-feather';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import { useParams } from 'react-router';

import ContentsTable from '../components/content/ContentsTable';
import Layout from '../components/layout';
import FilterSection, { FilterGroup, FilterItem } from '../components/shared/FilterSection';
import Modal from '../components/shared/Modal';
import Pagination from '../components/shared/Pagination';
import useI18n from '../context/I18nContext';
import useAuth from '../hooks/useAuth';
import CreateContentRequest from '../models/content/CreateContentRequest';
import contentService from '../services/ContentService';
import courseService from '../services/CourseService';

export default function Course() {
  const { id } = useParams<{ id: string }>();
  const { authenticatedUser } = useAuth();
  const { t } = useI18n();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File>();

  // Estados para paginación y ordenamiento
  const [limit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC');

  const [addContentShow, setAddContentShow] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  // Consulta de los datos del curso actual
  const courseQuery = useQuery(['course', id], async () => courseService.findOne(id));

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<CreateContentRequest>();

  // Consulta paginada de los contenidos del curso
  const { data, isLoading, refetch, isFetching } = useQuery(
    [`contents-${id}`, name, description, offset, limit, sortBy, sortOrder],
    async () =>
      contentService.findAll(id, {
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

  /**
   * Guarda un nuevo contenido asociándolo al curso actual.
   */
  const saveCourse = async (createContentRequest: CreateContentRequest) => {
    try {
      // Adjunta el archivo de imagen si está presente
      await contentService.save(id, {
        ...createContentRequest,
        image: imageFile,
      });
      setAddContentShow(false);
      reset();
      setImageFile(undefined);
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
        <h1 className="font-semibold text-3xl">
          {!courseQuery.isLoading ? `${courseQuery.data.name} ${t('contents')}` : ''}
        </h1>
        <div className="flex flex-wrap gap-3">
          {!courseQuery.isLoading && authenticatedUser.role === 'user' ? (
            courseQuery.data.isEnrolled ? (
              <button
                className="btn danger"
                onClick={async () => {
                  await courseService.unenroll(id);
                  courseQuery.refetch();
                }}
              >
                {t('unenroll')}
              </button>
            ) : (
              <button
                className="btn"
                onClick={async () => {
                  await courseService.enroll(id);
                  courseQuery.refetch();
                }}
              >
                {t('enroll')}
              </button>
            )
          ) : null}
          <button className="btn-refresh" onClick={() => refetch()} disabled={isFetching}>
            <RefreshCw className={isFetching ? 'animate-spin' : ''} size={18} />
            {t('refresh')}
          </button>
          {authenticatedUser.role !== 'user' ? (
            <button
              className="btn flex gap-2 items-center shadow-md hover:shadow-lg transition-all"
              onClick={() => setAddContentShow(true)}
            >
              <Plus size={18} /> {t('addContent')}
            </button>
          ) : null}
        </div>
      </div>
      <hr className="mb-6" />

      <FilterSection>
        <FilterGroup columns={2}>
          <FilterItem label={t('contentName')}>
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
        </FilterGroup>

        <div className="pt-4 border-t border-gray-50">
          <FilterGroup columns={2}>
            <FilterItem label={t('sortBy')}>
              <select className="input" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="name">{t('name')}</option>
                <option value="description">{t('description')}</option>
                <option value="dateCreated">{t('dateCreated')}</option>
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

      <ContentsTable data={data} isLoading={isLoading} courseId={id} onRefresh={() => refetch()} />

      <Pagination
        offset={offset}
        limit={limit}
        total={data?.length || 0}
        isLoading={isLoading}
        onPrev={handlePrevPage}
        onNext={handleNextPage}
        labelKey="contents"
      />

      {/* Modal para agregar contenido */}
      <Modal show={addContentShow}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{t('addContent')}</h2>
          <button
            onClick={() => {
              setAddContentShow(false);
              setImageFile(undefined);
              reset();
              setError(null);
            }}
          >
            <X size={20} />
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

          <div>
            <label className="text-sm font-medium">{t('imageOptional')}</label>
            <input
              type="file"
              accept="image/*"
              className="input"
              disabled={isSubmitting}
              onChange={(e) => {
                setImageFile(e.target.files?.[0]);
              }}
            />
            {imageFile && (
              <img
                src={URL.createObjectURL(imageFile)}
                alt="preview"
                className="mt-2 h-20 w-20 object-cover rounded"
              />
            )}
          </div>

          <button className="btn" disabled={isSubmitting}>
            {isSubmitting ? <Loader className="animate-spin mx-auto" /> : t('save')}
          </button>

          {error && (
            <div className="text-red-500 p-3 font-semibold border rounded-md bg-red-50">
              {error}
            </div>
          )}
        </form>
      </Modal>
    </Layout>
  );
}
