/**
 * Página de Perfil de Usuario.
 * Permite al usuario ver y actualizar su información personal.
 */
import UpdateProfile from '../components/dashboard/UpdateProfile';
import Layout from '../components/layout';
import useI18n from '../context/I18nContext';

export default function Profile() {
  const { t } = useI18n();
  return (
    <Layout>
      <div className="flex justify-between items-center mb-5">
        <h1 className="font-semibold text-3xl">{t('myProfile')}</h1>
      </div>
      <hr className="mb-8" />

      <div className="max-w-4xl mx-auto">
        <UpdateProfile />
      </div>
    </Layout>
  );
}
