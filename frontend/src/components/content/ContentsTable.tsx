/**
 * Tabla de Contenidos.
 * Muestra las lecciones de un curso con opciones para editar y eliminar.
 */
import { useState } from 'react';
import { AlertTriangle, Loader, X } from 'react-feather';
import { useForm } from 'react-hook-form';

import useI18n from '../../context/I18nContext';
import useAuth from '../../hooks/useAuth';
import Content from '../../models/content/Content';
import UpdateContentRequest from '../../models/content/UpdateContentRequest';
import { resolveMediaUrl } from '../../services/ApiService';
import contentService from '../../services/ContentService';
import Modal from '../shared/Modal';
import Table from '../shared/Table';
import TableItem from '../shared/TableItem';

interface ContentsTableProps {
  data: Content[];
  courseId: string;
  isLoading: boolean;
  onRefresh?: () => void;
}

export default function ContentsTable({
  data,
  isLoading,
  courseId,
  onRefresh,
}: ContentsTableProps) {
  const { authenticatedUser } = useAuth();
  const { t } = useI18n();
  const [deleteShow, setDeleteShow] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [selectedContentId, setSelectedContentId] = useState<string>();
  const [error, setError] = useState<string>();
  const [updateShow, setUpdateShow] = useState<boolean>(false);
  const [currentImageUrl, setCurrentImageUrl] = useState<string>();
  const [imageFile, setImageFile] = useState<File>();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
    setValue,
  } = useForm<UpdateContentRequest>();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await contentService.delete(courseId, selectedContentId);
      setDeleteShow(false);
      onRefresh?.();
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdate = async (updateContentRequest: UpdateContentRequest) => {
    // Adjuntar nuevo archivo si se selecciona
    if (imageFile) {
      updateContentRequest.image = imageFile;
    }
    try {
      await contentService.update(courseId, selectedContentId, updateContentRequest);
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
            { label: t('image') },
            { label: t('name') },
            { label: t('description') },
            { label: t('created') },
            {
              label: t('actions'),
              className: 'text-center',
            },
          ]}
        >
          {' '}
          {isLoading
            ? null
            : data.map(({ id, name, description, dateCreated, imageUrl }) => (
                <tr key={id}>
                  <TableItem>
                    {imageUrl ? (
                      <img
                        src={resolveMediaUrl(imageUrl)}
                        alt={name}
                        className="h-12 w-12 object-cover rounded"
                      />
                    ) : (
                      <div className="h-12 w-12 bg-gray-100 flex items-center justify-center text-gray-400 text-xs text-center">
                        {t('noImage')}
                      </div>
                    )}
                  </TableItem>
                  <TableItem>{name}</TableItem>
                  <TableItem>{description}</TableItem>
                  <TableItem>{new Date(dateCreated).toLocaleDateString()}</TableItem>
                  <TableItem className="text-center">
                    <div className="flex items-center justify-center gap-3">
                      {['admin', 'editor'].includes(authenticatedUser.role) ? (
                        <button
                          className="text-urbano-primary hover:text-red-700 font-bold text-sm focus:outline-none transition-colors"
                          onClick={() => {
                            setSelectedContentId(id);
                            setValue('name', name);
                            setValue('description', description);
                            setCurrentImageUrl(imageUrl);
                            setImageFile(undefined);
                            setUpdateShow(true);
                          }}
                        >
                          {t('edit')}
                        </button>
                      ) : null}

                      {authenticatedUser.role === 'admin' ? (
                        <button
                          className="text-red-600 hover:text-red-900 focus:outline-none"
                          onClick={() => {
                            setSelectedContentId(id);
                            setDeleteShow(true);
                          }}
                        >
                          {t('delete')}
                        </button>
                      ) : null}
                    </div>
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

      {/* Modal para eliminar contenido */}
      <Modal show={deleteShow}>
        <AlertTriangle size={30} className="text-red-500 mr-5 fixed" />
        <div className="ml-10">
          <h3 className="mb-2 font-semibold">{t('deleteContent')}</h3>
          <hr />
          <p className="mt-2">
            {t('deleteContentConfirm')}
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

      {/* Modal para actualizar contenido */}
      {selectedContentId ? (
        <Modal show={updateShow}>
          <div className="flex">
            <h1 className="font-semibold mb-3">{t('updateContent')}</h1>
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
            <div>
              <label className="text-sm font-medium">{t('image')}</label>
              <input
                type="file"
                accept="image/*"
                className="input"
                disabled={isSubmitting}
                onChange={(e) => setImageFile(e.target.files?.[0])}
              />
              {currentImageUrl && !imageFile && (
                <img
                  src={resolveMediaUrl(currentImageUrl)}
                  alt="current"
                  className="mt-2 h-20 w-20 object-cover rounded"
                />
              )}
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
            {error ? (
              <div className="text-red-500 p-3 font-semibold border rounded-md bg-red-50">
                {error}
              </div>
            ) : null}
          </form>
        </Modal>
      ) : null}
    </>
  );
}
