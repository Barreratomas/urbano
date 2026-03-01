import { Loader } from 'react-feather';
import { useForm } from 'react-hook-form';

import Layout from '../components/layout';
import useI18n from '../context/I18nContext';
import apiService from '../services/ApiService';

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function Contact() {
  const { t } = useI18n();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<ContactForm>();
  const onSubmit = async (values: ContactForm) => {
    await apiService.post('/contact', values);
    reset();
    alert(t('sent'));
  };
  return (
    <Layout>
      <div className="flex justify-between items-center mb-5">
        <h1 className="font-semibold text-3xl">{t('contact')}</h1>
      </div>
      <hr className="mb-6" />
      <div className="flex justify-center mt-10">
        <div className="w-full max-w-xl">
          <form className="card space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                {t('name')}
              </label>
              <input type="text" className="input" required {...register('name')} />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                {t('email')}
              </label>
              <input type="email" className="input" required {...register('email')} />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                {t('subject')}
              </label>
              <input type="text" className="input" required {...register('subject')} />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                {t('message')}
              </label>
              <textarea className="input" rows={5} required {...register('message')} />
            </div>
            <button className="btn" disabled={isSubmitting}>
              {isSubmitting ? <Loader className="animate-spin mx-auto" /> : t('send')}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
