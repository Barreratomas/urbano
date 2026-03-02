/**
 * Configuración centralizada de las rutas de la aplicación.
 * Define la estructura, permisos y metadatos para la navegación.
 */
import { ReactNode } from 'react';
import {
  BookOpen,
  Calendar as CalendarIcon,
  Home,
  Mail,
  Star,
  User as UserIcon,
  Users,
} from 'react-feather';

import Calendar from '../pages/Calendar';
import Contact from '../pages/Contact';
import Contents from '../pages/Contents';
import Courses from '../pages/Courses';
import Dashboard from '../pages/Dashboard';
import Favorites from '../pages/Favorites';
import Login from '../pages/Login';
import Profile from '../pages/Profile';
import UsersPage from '../pages/Users';

export interface AppRoute {
  path: string;
  name: string;
  component: React.ComponentType<any>;
  exact?: boolean;
  isPrivate?: boolean;
  isAuth?: boolean;
  roles?: string[];
  label?: string;
  icon?: ReactNode;
  showInSidebar?: boolean;
  category?: 'main' | 'account';
}

/**
 * Listado de todas las rutas de la aplicación.
 */
export const routes: AppRoute[] = [
  // Rutas públicas (solo accesibles si no está logueado)
  {
    path: '/login',
    name: 'login',
    component: Login,
    exact: true,
    isAuth: true,
    showInSidebar: false,
  },

  // Rutas privadas (requieren autenticación)
  {
    path: '/',
    name: 'dashboard',
    component: Dashboard,
    exact: true,
    isPrivate: true,
    label: 'dashboard',
    icon: <Home size={18} />,
    showInSidebar: true,
    category: 'main',
  },
  {
    path: '/courses',
    name: 'courses',
    component: Courses,
    exact: true,
    isPrivate: true,
    label: 'courses',
    icon: <BookOpen size={18} />,
    showInSidebar: true,
    category: 'main',
  },
  {
    path: '/courses/:id',
    name: 'courseDetail',
    component: Contents,
    exact: true,
    isPrivate: true,
    showInSidebar: false,
  },
  {
    path: '/favorites',
    name: 'favorites',
    component: Favorites,
    exact: true,
    isPrivate: true,
    label: 'favorites',
    icon: <Star size={18} />,
    showInSidebar: true,
    category: 'main',
  },
  {
    path: '/calendar',
    name: 'calendar',
    component: Calendar,
    exact: true,
    isPrivate: true,
    label: 'calendar',
    icon: <CalendarIcon size={18} />,
    showInSidebar: true,
    category: 'main',
  },
  {
    path: '/users',
    name: 'users',
    component: UsersPage,
    exact: true,
    isPrivate: true,
    roles: ['admin'],
    label: 'users',
    icon: <Users size={18} />,
    showInSidebar: true,
    category: 'main',
  },
  {
    path: '/contact',
    name: 'contact',
    component: Contact,
    exact: true,
    isPrivate: true,
    label: 'contact',
    icon: <Mail size={18} />,
    showInSidebar: true,
    category: 'main',
  },
  {
    path: '/profile',
    name: 'profile',
    component: Profile,
    exact: true,
    isPrivate: true,
    label: 'myProfile',
    icon: <UserIcon size={18} />,
    showInSidebar: true,
    category: 'account',
  },
];

/**
 * Helper para obtener la ruta por nombre y reemplazar parámetros dinámicos.
 * @param name Nombre de la ruta definido en la configuración.
 * @param params Objeto con los parámetros a reemplazar (ej. { id: 1 }).
 */
export const getRoutePath = (name: string, params?: Record<string, string | number>): string => {
  const route = routes.find((r) => r.name === name);
  if (!route) return '/';

  let path = route.path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      path = path.replace(`:${key}`, String(value));
    });
  }
  return path;
};
