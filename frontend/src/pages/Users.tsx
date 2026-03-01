import { useState } from 'react';
import { Loader, Plus, RefreshCw, X } from 'react-feather';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';

import Layout from '../components/layout';
import FilterSection, { FilterGroup, FilterItem } from '../components/shared/FilterSection';
import Modal from '../components/shared/Modal';
import Pagination from '../components/shared/Pagination';
import UsersTable from '../components/users/UsersTable';
import useI18n from '../context/I18nContext';
import useAuth from '../hooks/useAuth';
import CreateUserRequest from '../models/user/CreateUserRequest';
import userService from '../services/UserService';

export default function Users() {
  const { authenticatedUser } = useAuth();
  const { t } = useI18n();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');

  // Pagination and Sorting states
  const [limit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [sortBy, setSortBy] = useState('firstName');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC');

  const [addUserShow, setAddUserShow] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const { data, isLoading, refetch, isFetching } = useQuery(
    ['users', firstName, lastName, username, role, offset, limit, sortBy, sortOrder],
    async () => {
      return (
        await userService.findAll({
          firstName: firstName || undefined,
          lastName: lastName || undefined,
          username: username || undefined,
          role: role || undefined,
          limit,
          offset,
          sortBy,
          sortOrder,
        })
      ).filter((user) => user.id !== authenticatedUser.id);
    },
    {
      keepPreviousData: true,
    },
  );

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<CreateUserRequest>();

  const saveUser = async (createUserRequest: CreateUserRequest) => {
    try {
      await userService.save(createUserRequest);
      setAddUserShow(false);
      setError(null);
      reset();
      refetch();
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  const handleNextPage = () => {
    if (data && data.length === limit - (offset === 0 ? 1 : 0)) {
      // Simple check for next page availability
      setOffset((prev) => prev + limit);
    }
  };

  const handlePrevPage = () => {
    setOffset((prev) => Math.max(0, prev - limit));
  };

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-4">
        <h1 className="font-semibold text-3xl">{t('manageUsers')}</h1>
        <div className="flex flex-wrap gap-3">
          <button className="btn-refresh" onClick={() => refetch()} disabled={isFetching}>
            <RefreshCw className={isFetching ? 'animate-spin' : ''} size={18} />
            {t('refresh')}
          </button>
          <button
            className="btn flex gap-2 items-center shadow-md hover:shadow-lg transition-all"
            onClick={() => setAddUserShow(true)}
          >
            <Plus size={18} /> {t('addUser')}
          </button>
        </div>
      </div>
      <hr className="mb-6" />

      <FilterSection>
        <FilterGroup columns={4}>
          <FilterItem label={t('firstName')}>
            <input
              type="text"
              className="input"
              placeholder={t('filterByFirstName')}
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
                setOffset(0);
              }}
            />
          </FilterItem>
          <FilterItem label={t('lastName')}>
            <input
              type="text"
              className="input"
              placeholder={t('filterByLastName')}
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
                setOffset(0);
              }}
            />
          </FilterItem>
          <FilterItem label={t('username')}>
            <input
              type="text"
              className="input"
              placeholder={t('filterByUsername')}
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setOffset(0);
              }}
            />
          </FilterItem>
          <FilterItem label={t('role')}>
            <select
              className="input"
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                setOffset(0);
              }}
            >
              <option value="">{t('allRoles')}</option>
              <option value="user">{t('user')}</option>
              <option value="editor">{t('editor')}</option>
              <option value="admin">{t('admin')}</option>
            </select>
          </FilterItem>
        </FilterGroup>

        <div className="pt-4 border-t border-gray-50">
          <FilterGroup columns={2}>
            <FilterItem label={t('sortBy')}>
              <select className="input" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="firstName">{t('firstName')}</option>
                <option value="lastName">{t('lastName')}</option>
                <option value="username">{t('username')}</option>
                <option value="role">{t('role')}</option>
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

      <UsersTable data={data} isLoading={isLoading} onRefresh={() => refetch()} />

      <Pagination
        offset={offset}
        limit={limit}
        total={data?.length || 0}
        isLoading={isLoading}
        onPrev={handlePrevPage}
        onNext={handleNextPage}
        labelKey="usersCount"
      />

      {/* Add User Modal */}
      <Modal show={addUserShow}>
        <div className="flex">
          <h1 className="font-semibold mb-3">{t('addUser')}</h1>
          <button
            className="ml-auto focus:outline-none"
            onClick={() => {
              reset();
              setError(null);
              setAddUserShow(false);
            }}
          >
            <X size={30} />
          </button>
        </div>
        <hr />

        <form
          className="flex flex-col gap-5 mt-5"
          onSubmit={handleSubmit(saveUser)}
          autoComplete="off"
        >
          <div className="flex flex-col gap-5 sm:flex-row">
            <input
              type="text"
              className="input sm:w-1/2"
              placeholder={t('firstName')}
              required
              disabled={isSubmitting}
              {...register('firstName')}
            />
            <input
              type="text"
              className="input sm:w-1/2"
              placeholder={t('lastName')}
              required
              disabled={isSubmitting}
              {...register('lastName')}
            />
          </div>
          <input
            type="text"
            className="input"
            required
            placeholder={t('username')}
            disabled={isSubmitting}
            {...register('username')}
          />
          <input
            type="password"
            className="input"
            required
            placeholder={t('password')}
            disabled={isSubmitting}
            autoComplete="new-password"
            {...register('password')}
          />
          <select className="input" required {...register('role')} disabled={isSubmitting}>
            <option value="user">{t('user')}</option>
            <option value="editor">{t('editor')}</option>
            <option value="admin">{t('admin')}</option>
          </select>
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
