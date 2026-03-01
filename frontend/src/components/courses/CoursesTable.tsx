import { useEffect, useState } from 'react';
import { AlertTriangle, Heart, Loader, Star, X } from 'react-feather';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

import useI18n from '../../context/I18nContext';
import useAuth from '../../hooks/useAuth';
import Course from '../../models/course/Course';
import UpdateCourseRequest from '../../models/course/UpdateCourseRequest';
import courseService from '../../services/CourseService';
import Modal from '../shared/Modal';
import Table from '../shared/Table';
import TableItem from '../shared/TableItem';

interface CoursesTableProps {
  data: Course[];
  isLoading: boolean;
  onRefresh?: () => void;
}

export default function CoursesTable({ data, isLoading, onRefresh }: CoursesTableProps) {
  const { authenticatedUser } = useAuth();
  const { t } = useI18n();
  const [deleteShow, setDeleteShow] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string>();
  const [error, setError] = useState<string>();
  const [updateShow, setUpdateShow] = useState<boolean>(false);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [enrolledIds, setEnrolledIds] = useState<Set<string>>(new Set());

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
    setValue,
  } = useForm<UpdateCourseRequest>();

  useEffect(() => {
    const initial = new Set<string>();
    const initialEnrolled = new Set<string>();
    const r: Record<string, number> = {};
    (data || []).forEach((c) => {
      if (c.isFavorite) initial.add(c.id);
      if (c.isEnrolled) initialEnrolled.add(c.id);
      if (typeof c.rating === 'number') r[c.id] = c.rating;
    });
    setFavoriteIds(initial);
    setEnrolledIds(initialEnrolled);
    setRatings(r);
  }, [data]);

  const toggleFavorite = async (id: string) => {
    const isFav = favoriteIds.has(id);
    try {
      if (isFav) {
        await courseService.unfavorite(id);
        const next = new Set(favoriteIds);
        next.delete(id);
        setFavoriteIds(next);
      } else {
        await courseService.favorite(id);
        const next = new Set(favoriteIds);
        next.add(id);
        setFavoriteIds(next);
      }
    } catch (e) {
      // silent error
    }
  };

  const toggleEnroll = async (id: string) => {
    const isEnrolled = enrolledIds.has(id);
    try {
      if (isEnrolled) {
        await courseService.unenroll(id);
        const next = new Set(enrolledIds);
        next.delete(id);
        setEnrolledIds(next);
      } else {
        await courseService.enroll(id);
        const next = new Set(enrolledIds);
        next.add(id);
        setEnrolledIds(next);
      }
    } catch (e) {
      // silent error
    }
  };

  const setVote = async (id: string, value: number) => {
    try {
      await courseService.vote(id, value);
      setRatings((prev) => ({ ...prev, [id]: value }));
    } catch (e) {
      // silent error
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await courseService.delete(selectedCourseId);
      setDeleteShow(false);
      onRefresh?.();
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdate = async (updateCourseRequest: UpdateCourseRequest) => {
    try {
      await courseService.update(selectedCourseId, updateCourseRequest);
      setUpdateShow(false);
      reset();
      setError(null);
      onRefresh?.();
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  return (
    <>
      <div className="table-container">
        <Table
          columns={[
            { label: t('name') },
            { label: t('description') },
            { label: t('created') },
            { label: t('rating'), className: 'text-center' },
            { label: t('favorites'), className: 'text-center' },
            {
              label: t('actions'),
              className: 'text-center',
            },
          ]}
        >
          {isLoading
            ? null
            : data.map(({ id, name, description, dateCreated }) => (
                <tr key={id}>
                  <TableItem>
                    <Link to={`/courses/${id}`}>{name}</Link>
                  </TableItem>
                  <TableItem>{description}</TableItem>
                  <TableItem>{new Date(dateCreated).toLocaleDateString()}</TableItem>
                  <TableItem>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <button
                          key={val}
                          onClick={() => setVote(id, val)}
                          className="text-yellow-400 hover:scale-105 transition-transform"
                          title={`${t('votar')} ${val}`}
                        >
                          <Star
                            size={16}
                            className={(ratings[id] || 0) >= val ? 'fill-current' : 'opacity-40'}
                          />
                        </button>
                      ))}
                    </div>
                  </TableItem>
                  <TableItem className="text-center">
                    <button
                      className="text-gray-400 hover:text-urbano-primary transition-colors"
                      title={t('favorites')}
                      onClick={() => toggleFavorite(id)}
                    >
                      <Heart
                        size={18}
                        className={favoriteIds.has(id) ? 'fill-current text-red-500' : ''}
                      />
                    </button>
                  </TableItem>
                  <TableItem className="text-center">
                    {authenticatedUser.role === 'user' ? (
                      <button
                        className={`btn !px-3 !py-1 text-xs ${enrolledIds.has(id) ? 'danger' : ''}`}
                        onClick={() => toggleEnroll(id)}
                      >
                        {enrolledIds.has(id) ? t('unenroll') : t('enroll')}
                      </button>
                    ) : null}
                    {['admin', 'editor'].includes(authenticatedUser.role) ? (
                      <button
                        className="text-urbano-primary hover:text-red-700 font-bold text-sm focus:outline-none transition-colors"
                        onClick={() => {
                          setSelectedCourseId(id);

                          const course = data.find((c) => c.id === id);
                          setValue('name', name);
                          setValue('description', description);
                          setValue(
                            'startDate',
                            course?.startDate
                              ? new Date(course.startDate).toISOString().split('T')[0]
                              : '',
                          );
                          setValue(
                            'endDate',
                            course?.endDate
                              ? new Date(course.endDate).toISOString().split('T')[0]
                              : '',
                          );

                          setUpdateShow(true);
                        }}
                      >
                        {t('edit')}
                      </button>
                    ) : null}
                    {authenticatedUser.role === 'admin' ? (
                      <button
                        className="text-gray-400 hover:text-red-600 ml-4 font-bold text-sm focus:outline-none transition-colors"
                        onClick={() => {
                          setSelectedCourseId(id);
                          setDeleteShow(true);
                        }}
                      >
                        {t('delete')}
                      </button>
                    ) : null}
                  </TableItem>
                </tr>
              ))}
        </Table>
        {!isLoading && data.length < 1 ? (
          <div className="text-center my-5 text-gray-500">
            <h1>{t('empty')}</h1>
          </div>
        ) : null}
      </div>
      {/* Delete Course Modal */}
      <Modal show={deleteShow}>
        <AlertTriangle size={30} className="text-red-500 mr-5 fixed" />
        <div className="ml-10">
          <h3 className="mb-2 font-semibold">{t('deleteCourse')}</h3>
          <hr />
          <p className="mt-2">
            {t('deleteCourseConfirm')}
            <br />
            {t('actionUndone')}
          </p>
        </div>
        <div className="flex flex-row gap-3 justify-end mt-5">
          <button
            className="btn"
            onClick={() => {
              setError(null);
              setDeleteShow(false);
            }}
            disabled={isDeleting}
          >
            {t('cancel')}
          </button>
          <button className="btn danger" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? <Loader className="mx-auto animate-spin" /> : t('delete')}
          </button>
        </div>
        {error ? (
          <div className="text-red-500 p-3 font-semibold border rounded-md bg-red-50">{error}</div>
        ) : null}
      </Modal>
      {/* Update Course Modal */}
      <Modal show={updateShow}>
        <div className="flex">
          <h1 className="font-semibold mb-3">{t('updateCourse')}</h1>
          <button
            className="ml-auto focus:outline-none"
            onClick={() => {
              setUpdateShow(false);
              setError(null);
              reset();
            }}
          >
            <X size={30} />
          </button>
        </div>
        <hr />

        <form className="flex flex-col gap-5 mt-5" onSubmit={handleSubmit(handleUpdate)}>
          <input
            type="text"
            className="input"
            placeholder={t('name')}
            required
            {...register('name')}
          />
          <input
            type="text"
            className="input"
            placeholder={t('description')}
            required
            disabled={isSubmitting}
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
    </>
  );
}
