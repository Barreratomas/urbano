/**
 * Contexto de internacionalización (I18n) para soportar múltiples idiomas.
 * Gestiona el diccionario de traducciones y el estado del idioma seleccionado.
 */
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type Lang = 'es' | 'en';
type Dict = Record<string, string>;

/**
 * Diccionarios de traducción para español e inglés.
 */
const DICTS: Record<Lang, Dict> = {
  es: {
    dashboard: 'Tablero',
    courses: 'Cursos',
    users: 'Usuarios',
    favorites: 'Favoritos',
    calendar: 'Calendario',
    myProfile: 'Mi Perfil',
    signOut: 'Salir',
    refresh: 'Refrescar',
    myCourses: 'Mis cursos',
    enroll: 'Inscribirme',
    unenroll: 'Darse de baja',
    courseCalendar: 'Calendario de Cursos',
    myFavorites: 'Mis Favoritos',
    contact: 'Contacto',
    send: 'Enviar',
    loading: 'Cargando...',
    coursesCount: 'cursos',
    name: 'Nombre',
    email: 'Email',
    subject: 'Asunto',
    message: 'Mensaje',
    sent: 'Enviado',
    onlyMyCourses: 'Solo mis cursos',
    enrolled: 'Inscripto',
    addCourse: 'Agregar Curso',
    courseName: 'Nombre del Curso',
    filterByName: 'Filtrar por nombre...',
    description: 'Descripción',
    filterByDescription: 'Filtrar por descripción...',
    sortBy: 'Ordenar por',
    dateCreated: 'Fecha de creación',
    rating: 'Calificación',
    order: 'Orden',
    ascending: 'Ascendente',
    descending: 'Descendente',
    showing: 'Mostrando',
    to: 'a',
    save: 'Guardar',
    edit: 'Editar',
    delete: 'Eliminar',
    empty: 'Vacío',
    deleteCourse: 'Eliminar Curso',
    deleteCourseConfirm:
      '¿Estás seguro de que quieres eliminar el curso? Todos los datos del curso se eliminarán permanentemente.',
    actionUndone: 'Esta acción no se puede deshacer.',
    cancel: 'Cancelar',
    updateCourse: 'Actualizar Curso',
    addContent: 'Agregar Contenido',
    contentName: 'Nombre del Contenido',
    contents: 'Contenidos',
    imageOptional: 'Imagen (opcional)',
    image: 'Imagen',
    noImage: 'sin imagen',
    deleteContent: 'Eliminar Contenido',
    deleteContentConfirm:
      '¿Estás seguro de que quieres eliminar el contenido? Todos los datos del contenido se eliminarán permanentemente.',
    updateContent: 'Actualizar Contenido',
    welcomeBack: 'Bienvenido de nuevo',
    quickStats: 'Estadísticas Rápidas',
    totalUsers: 'Usuarios Totales',
    activeCourses: 'Cursos Activos',
    lessonsCreated: 'Lecciones Creadas',
    latestCourses: 'Últimos Cursos',
    viewAllCourses: 'Ver todos los cursos',
    noCoursesFound: 'No se encontraron cursos aún.',
    manageUsers: 'Administrar Usuarios',
    addUser: 'Agregar Usuario',
    firstName: 'Nombre',
    filterByFirstName: 'Filtrar por nombre...',
    lastName: 'Apellido',
    filterByLastName: 'Filtrar por apellido...',
    username: 'Nombre de usuario',
    filterByUsername: 'Filtrar por nombre de usuario...',
    role: 'Rol',
    allRoles: 'Todos los roles',
    admin: 'Administrador',
    editor: 'Editor',
    user: 'Usuario',
    usersCount: 'usuarios',
    password: 'Contraseña',
    status: 'Estado',
    active: 'Activo',
    inactive: 'Inactivo',
    deleteUser: 'Eliminar Usuario',
    deleteUserConfirm:
      '¿Estás seguro de que quieres eliminar el usuario? Todos los datos del usuario se eliminarán permanentemente.',
    updateUser: 'Actualizar Usuario',
    startDate: 'Fecha de inicio',
    endDate: 'Fecha de fin',
    newPassword: 'Nueva Contraseña',
    passwordHelp: 'Dejar vacío para mantener la contraseña actual',
    saveChanges: 'Guardar Cambios',
    adminPanel: 'Panel de Administración',
    navigation: 'Navegación',
    account: 'Cuenta',
    votar: 'Votar',
    created: 'Creado',
    actions: 'Acciones',
    Login: 'Iniciar sesión',
    enterUsername: 'Ingrese su usuario',
    enterPassword: 'Ingrese su contraseña',
    signIn: 'Iniciar Sesión',
    loginError: 'Ocurrió un error de red o el servidor no responde.',
    profileUpdated: '¡Perfil actualizado con éxito!',
    profileUpdateError: 'Ocurrió un error al actualizar el perfil.',
    'password must be longer than or equal to 6 characters':
      'La contraseña debe tener al menos 6 caracteres.',
    'firstName should not be empty': 'El nombre no puede estar vacío.',
    'lastName should not be empty': 'El apellido no puede estar vacío.',
    'username should not be empty': 'El nombre de usuario no puede estar vacío.',
  },
  en: {
    dashboard: 'Dashboard',
    courses: 'Courses',
    users: 'Users',
    favorites: 'Favorites',
    calendar: 'Calendar',
    myProfile: 'My Profile',
    signOut: 'Sign Out',
    refresh: 'Refresh',
    myCourses: 'My courses',
    enroll: 'Enroll',
    unenroll: 'Unenroll',
    courseCalendar: 'Course Calendar',
    myFavorites: 'My Favorites',
    contact: 'Contact',
    send: 'Send',
    loading: 'Loading...',
    coursesCount: 'courses',
    name: 'Name',
    email: 'Email',
    subject: 'Subject',
    message: 'Message',
    sent: 'Sent',
    onlyMyCourses: 'Only my courses',
    enrolled: 'Enrolled',
    addCourse: 'Add Course',
    courseName: 'Course Name',
    filterByName: 'Filter by name...',
    description: 'Description',
    filterByDescription: 'Filter by description...',
    sortBy: 'Sort By',
    dateCreated: 'Date Created',
    rating: 'Rating',
    order: 'Order',
    ascending: 'Ascending',
    descending: 'Descending',
    showing: 'Showing',
    to: 'to',
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    empty: 'Empty',
    deleteCourse: 'Delete Course',
    deleteCourseConfirm:
      "Are you sure you want to delete the course? All of course's data will be permanently removed.",
    actionUndone: 'This action cannot be undone.',
    cancel: 'Cancel',
    updateCourse: 'Update Course',
    addContent: 'Add Content',
    contentName: 'Content Name',
    contents: 'Contents',
    imageOptional: 'Image (optional)',
    image: 'Image',
    noImage: 'no image',
    deleteContent: 'Delete Content',
    deleteContentConfirm:
      "Are you sure you want to delete the content? All of content's data will be permanently removed.",
    updateContent: 'Update Content',
    welcomeBack: 'Welcome back',
    quickStats: 'Quick Statistics',
    totalUsers: 'Total Users',
    activeCourses: 'Active Courses',
    lessonsCreated: 'Lessons Created',
    latestCourses: 'Latest Courses',
    viewAllCourses: 'View all courses',
    noCoursesFound: 'No courses found yet.',
    manageUsers: 'Manage Users',
    addUser: 'Add User',
    firstName: 'First Name',
    filterByFirstName: 'Filter by first name...',
    lastName: 'Last Name',
    filterByLastName: 'Filter by last name...',
    username: 'Username',
    filterByUsername: 'Filter by username...',
    role: 'Role',
    allRoles: 'All Roles',
    admin: 'Admin',
    editor: 'Editor',
    user: 'User',
    usersCount: 'users',
    password: 'Password',
    status: 'Status',
    active: 'Active',
    inactive: 'Inactive',
    deleteUser: 'Delete User',
    deleteUserConfirm:
      "Are you sure you want to delete the user? All of user's data will be permanently removed.",
    updateUser: 'Update User',
    startDate: 'Start Date',
    endDate: 'End Date',
    newPassword: 'New Password',
    passwordHelp: 'Leave empty to keep current password',
    saveChanges: 'Save Changes',
    adminPanel: 'Admin Panel',
    navigation: 'Navigation',
    account: 'Account',
    votar: 'Vote',
    created: 'Created',
    actions: 'Actions',
    Login: 'Login',
    enterUsername: 'Enter your username',
    enterPassword: 'Enter your password',
    signIn: 'Sign In',
    loginError: 'A network error occurred or the server is unreachable.',
    profileUpdated: 'Profile updated successfully!',
    profileUpdateError: 'An error occurred while updating the profile.',
    'password must be longer than or equal to 6 characters':
      'Password must be at least 6 characters long.',
    'firstName should not be empty': 'First name should not be empty.',
    'lastName should not be empty': 'Last name should not be empty.',
    'username should not be empty': 'Username should not be empty.',
  },
};

interface I18nValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (k: string) => string;
}

const I18nContext = createContext<I18nValue>(null);

export function I18nProvider({ children }) {
  const [lang, setLang] = useState<Lang>('es');

  useEffect(() => {
    const saved = localStorage.getItem('lang') as Lang;
    if (saved) setLang(saved);
  }, []);

  const value = useMemo<I18nValue>(() => {
    const t = (k: string) => DICTS[lang][k] || k;
    const setL = (l: Lang) => {
      setLang(l);
      localStorage.setItem('lang', l);
    };
    return { lang, setLang: setL, t };
  }, [lang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export default function useI18n() {
  return useContext(I18nContext);
}
