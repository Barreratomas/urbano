import { useState } from 'react';
import { Loader } from 'react-feather';
import { useForm } from 'react-hook-form';

import useI18n from '../../context/I18nContext';
import useAuth from '../../hooks/useAuth';
import UpdateUserRequest from '../../models/user/UpdateUserRequest';
import userService from '../../services/UserService';

export default function UpdateProfile() {
  const { authenticatedUser, updateAuthenticatedUser } = useAuth();
  const { t } = useI18n();
  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState<string>();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<UpdateUserRequest>({
    defaultValues: {
      firstName: authenticatedUser.firstName,
      lastName: authenticatedUser.lastName,
      username: authenticatedUser.username,
    },
  });

  const handleUpdate = async (updateUserRequest: UpdateUserRequest) => {
    try {
      const updatedUser = await userService.update(authenticatedUser.id, updateUserRequest);
      if (updatedUser) {
        updateAuthenticatedUser(updatedUser);
        setSuccess(t('profileUpdated'));
        setError(null);
        reset({
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          username: updatedUser.username,
        } as any);
      }
    } catch (error) {
      const msg = error.response?.data?.message;
      if (Array.isArray(msg)) {
        setError(msg.map((m: string) => t(m)).join(', '));
      } else {
        setError(t(msg) || t('profileUpdateError'));
      }
      setSuccess(null);
    }
  };

  return (
    <div className="max-w-2xl bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
      <form className="space-y-6" onSubmit={handleSubmit(handleUpdate)} autoComplete="off">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
              {t('firstName')}
            </label>
            <input
              type="text"
              className="input"
              required
              disabled={isSubmitting}
              {...register('firstName')}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
              {t('lastName')}
            </label>
            <input
              type="text"
              className="input"
              required
              disabled={isSubmitting}
              {...register('lastName')}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
            {t('username')}
          </label>
          <input
            type="text"
            className="input"
            required
            disabled={isSubmitting}
            {...register('username')}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
            {t('newPassword')}
          </label>
          <input
            type="password"
            className="input"
            disabled={isSubmitting}
            autoComplete="new-password"
            {...register('password')}
          />
          <p className="text-[10px] text-gray-400 font-medium ml-1 uppercase tracking-wider">
            {t('passwordHelp')}
          </p>
        </div>

        <button className="btn w-full py-4 text-sm" disabled={isSubmitting}>
          {isSubmitting ? <Loader className="animate-spin mx-auto" /> : t('saveChanges')}
        </button>

        {success && (
          <div className="text-green-600 p-3 font-semibold border rounded-md bg-green-50 text-sm">
            {success}
          </div>
        )}
        {error && (
          <div className="text-red-500 p-3 font-semibold border rounded-md bg-red-50 text-sm">
            {error}
          </div>
        )}
      </form>
    </div>
  );
}
