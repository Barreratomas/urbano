/**
 * Componente de Barra Lateral (Sidebar).
 * Gestiona la navegación principal, el cambio de idioma y el cierre de sesión.
 */
import { LogOut } from 'react-feather';
import { useHistory, useLocation } from 'react-router';
import { Link } from 'react-router-dom';

import logo from '../../assets/urbano-logo.png';
import useI18n from '../../context/I18nContext';
import useAuth from '../../hooks/useAuth';
import { routes } from '../../routes';
import { getRoutePath } from '../../routes';
import authService from '../../services/AuthService';
import SidebarItem from './SidebarItem';

interface SidebarProps {
  className: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const history = useHistory();
  const location = useLocation();

  const { authenticatedUser, setAuthenticatedUser } = useAuth();
  const { lang, setLang, t } = useI18n();

  const handleLogout = async () => {
    await authService.logout();
    setAuthenticatedUser(null);
    history.push('/login');
  };

  const mainRoutes = routes.filter(
    (r) =>
      r.showInSidebar &&
      r.category === 'main' &&
      (!r.roles || (authenticatedUser && r.roles.includes(authenticatedUser.role))),
  );

  const accountRoutes = routes.filter(
    (r) =>
      r.showInSidebar &&
      r.category === 'account' &&
      (!r.roles || (authenticatedUser && r.roles.includes(authenticatedUser.role))),
  );

  return (
    <div
      className={'sidebar ' + className}
      style={{
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Encabezado con Logo */}
      <div className="flex flex-col items-center mb-6 mt-2 shrink-0">
        <Link to={getRoutePath('/')} className="no-underline group">
          <div className="bg-white p-3 rounded-2xl shadow-md border border-gray-100 transition-transform duration-300 group-hover:scale-105">
            <img src={logo} alt="Urbano Logo" className="h-10 w-auto object-contain" />
          </div>
        </Link>
      </div>

      <div className="flex-grow flex flex-col gap-6 overflow-y-visible">
        <div className="px-1">
          <nav className="flex flex-col gap-1.5">
            {mainRoutes.map((route) => (
              <SidebarItem
                key={route.path}
                to={route.path}
                active={
                  route.path === '/'
                    ? location.pathname === '/'
                    : location.pathname.startsWith(route.path)
                }
              >
                {route.icon} <span className="text-sm">{t(route.label || '')}</span>
              </SidebarItem>
            ))}
          </nav>
        </div>

        <div className="px-1">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-4 opacity-70">
            {t('account')}
          </p>
          <nav className="flex flex-col gap-1.5">
            {accountRoutes.map((route) => (
              <SidebarItem
                key={route.path}
                to={route.path}
                active={location.pathname.startsWith(route.path)}
              >
                {route.icon} <span className="text-sm">{t(route.label || '')}</span>
              </SidebarItem>
            ))}
          </nav>
          <div className="mt-3 px-4">
            <div className="flex items-center gap-2">
              <button
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  lang === 'es' ? 'bg-urbano-primary text-white' : 'bg-gray-100'
                }`}
                onClick={() => setLang('es')}
              >
                ES
              </button>
              <button
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  lang === 'en' ? 'bg-urbano-primary text-white' : 'bg-gray-100'
                }`}
                onClick={() => setLang('en')}
              >
                EN
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Pie de página / Perfil de usuario */}
      <div className="mt-6 pt-6 border-t border-gray-200/40 shrink-0 pb-2">
        <button
          className="w-full group text-gray-500 hover:text-red-600 rounded-lg p-3 transition-all duration-300 flex gap-3 items-center font-bold focus:outline-none border border-transparent hover:bg-red-50 hover:border-red-100/50 shadow-none hover:shadow-sm"
          onClick={handleLogout}
        >
          <div className="p-1.5 rounded-md bg-gray-100 group-hover:bg-red-100 transition-colors duration-300">
            <LogOut
              size={16}
              className="transition-transform duration-300 group-hover:-translate-x-0.5"
            />
          </div>
          <span className="text-xs">{t('signOut')}</span>
        </button>
      </div>
    </div>
  );
}
