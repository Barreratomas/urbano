/**
 * Tabla de Usuarios.
 * Muestra la lista de usuarios con opciones para editar y eliminar.
 */
import { useState } from 'react';
import { AlertTriangle, Loader, X } from 'react-feather';
import { useForm } from 'react-hook-form';

import useI18n from '../../context/I18nContext';
import UpdateUserRequest from '../../models/user/UpdateUserRequest';
import User from '../../models/user/User';
import userService from '../../services/UserService';
import Modal from '../shared/Modal';
import Table from '../shared/Table';
import TableItem from '../shared/TableItem';

interface UsersTableProps {
  data: User[];
  isLoading: boolean;
  onRefresh?: () => void;
}

export default function UsersTable({ data, isLoading, onRefresh }: UsersTableProps) {
  const { t } = useI18n();
  const [deleteShow, setDeleteShow] = useState<boolean>(false);
  const [updateShow, setUpdateShow] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [selectedUserId, setSelectedUserId] = useState<string>();
  const [error, setError] = useState<string>();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
    setValue,
  } = useForm<UpdateUserRequest>();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await userService.delete(selectedUserId);
      setDeleteShow(false);
      onRefresh?.();
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdate = async (updateUserRequest: UpdateUserRequest) => {
    try {
      await userService.update(selectedUserId, updateUserRequest);
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
            { label: t('username') },
            { label: t('status') },
            { label: t('role') },
            { label: t('actions'), className: 'text-center' },
          ]}
        >
          {isLoading
            ? null
            : data.map(({ id, firstName, lastName, role, isActive, username }) => (
                <tr key={id}>
                  <TableItem>{`${firstName} ${lastName}`}</TableItem>
                  <TableItem>{username}</TableItem>
                  <TableItem>
                    {isActive ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {t('active')}
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        {t('inactive')}
                      </span>
                    )}
                  </TableItem>
                  <TableItem>{t(role)}</TableItem>
                  <TableItem className="text-center">
                    <button
                      className="text-indigo-600 hover:text-indigo-900 focus:outline-none"
                      onClick={() => {
                        setSelectedUserId(id);

                        setValue('firstName', firstName);
                        setValue('lastName', lastName);
                        setValue('username', username);
                        setValue('role', role);
                        setValue('isActive', isActive);

                        setUpdateShow(true);
                      }}
                    >
                      {t('edit')}
                    </button>
                    <button
                      className="text-red-600 hover:text-red-900 ml-3 focus:outline-none"
                      onClick={() => {
                        setSelectedUserId(id);
                        setDeleteShow(true);
                      }}
                    >
                      {t('delete')}
                    </button>
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
      {/* Modal para eliminar usuario */}
      <Modal show={deleteShow}>
        <AlertTriangle size={30} className="text-red-500 mr-5 fixed" />
        <div className="ml-10">
          <h3 className="mb-2 font-semibold">{t('deleteUser')}</h3>
          <hr />
          <p className="mt-2">
            {t('deleteUserConfirm')}
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
      {/* Modal para actualizar usuario */}
      <Modal show={updateShow}>
        <div className="flex">
          <h1 className="font-semibold mb-3">{t('updateUser')}</h1>
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

        <form
          className="flex flex-col gap-5 mt-5"
          onSubmit={handleSubmit(handleUpdate)}
          autoComplete="off"
        >
          <div className="flex flex-col gap-5 sm:flex-row">
            <input
              type="text"
              className="input sm:w-1/2"
              placeholder={t('firstName')}
              {...register('firstName')}
            />
            <input
              type="text"
              className="input sm:w-1/2"
              placeholder={t('lastName')}
              disabled={isSubmitting}
              {...register('lastName')}
            />
          </div>
          <input
            type="text"
            className="input"
            placeholder={t('username')}
            disabled={isSubmitting}
            {...register('username')}
          />
          <input
            type="password"
            className="input"
            placeholder={t('password')}
            disabled={isSubmitting}
            autoComplete="new-password"
            {...register('password')}
          />
          <select className="input" {...register('role')} disabled={isSubmitting}>
            <option value="user">{t('user')}</option>
            <option value="editor">{t('editor')}</option>
            <option value="admin">{t('admin')}</option>
          </select>
          <div>
            <label className="font-semibold mr-3">{t('active')}</label>
            <input type="checkbox" className="input w-5 h-5" {...register('isActive')} />
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
