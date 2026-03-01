import { useEffect, useState } from 'react';
import { Loader } from 'react-feather';
import { useForm } from 'react-hook-form';
import { useHistory, useLocation } from 'react-router-dom';

import logo from '../assets/urbano-logo.png';
import useI18n from '../context/I18nContext';
import useAuth from '../hooks/useAuth';
import LoginRequest from '../models/auth/LoginRequest';
import authService from '../services/AuthService';

export default function Login() {
  const { setAuthenticatedUser } = useAuth();
  const { t } = useI18n();
  const history = useHistory();
  const location = useLocation();

  const [error, setError] = useState<string>();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('error') === 'account_disabled') {
      setError('Account is disabled');
    }
  }, [location]);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginRequest>();

  const onSubmit = async (loginRequest: LoginRequest) => {
    try {
      const data = await authService.login(loginRequest);
      setAuthenticatedUser(data.user);
      history.push('/');
    } catch (error) {
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError(t('loginError'));
      }
    }
  };

  return (
    <div className="min-h-full flex justify-center items-center bg-gray-100 p-4">
      <div className="card shadow-xl p-6 sm:p-10 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <img src={logo} alt="Urbano Logo" className="h-16 sm:h-20 w-auto mb-4" />
          <h1 className="text-2xl sm:text-3xl font-bold text-urbano-primary tracking-tight">
            {t('Login')}
          </h1>
        </div>
        <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="username"
              className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1"
            >
              {t('username')}
            </label>
            <input
              id="username"
              type="text"
              className="input sm:text-lg w-full"
              placeholder={t('enterUsername')}
              required
              disabled={isSubmitting}
              {...register('username')}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1"
            >
              {t('password')}
            </label>
            <input
              id="password"
              type="password"
              className="input sm:text-lg w-full"
              placeholder={t('enterPassword')}
              required
              disabled={isSubmitting}
              {...register('password')}
            />
          </div>
          <button
            className="btn mt-4 sm:text-lg w-full shadow-lg"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? <Loader className="animate-spin mx-auto" /> : t('signIn')}
          </button>
          {error ? (
            <div className="text-red-500 p-3 text-sm font-semibold border border-red-200 rounded-md bg-red-50 mt-2">
              {error}
            </div>
          ) : null}
        </form>
      </div>
    </div>
  );
}
