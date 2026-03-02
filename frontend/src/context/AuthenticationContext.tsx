/**
 * Contexto de autenticación para toda la aplicación.
 * Mantiene el estado del usuario logueado y proporciona funciones para actualizarlo.
 */
import { createContext, Dispatch, SetStateAction, useState } from 'react';

import User from '../models/user/User';

interface AuthContextValue {
  authenticatedUser: User;
  setAuthenticatedUser: Dispatch<SetStateAction<User>>;
  updateAuthenticatedUser: (user: User) => void;
}

export const AuthenticationContext = createContext<AuthContextValue>(null);

/**
 * Proveedor del contexto de autenticación.
 */
export function AuthenticationProvider({ children }) {
  const [authenticatedUser, setAuthenticatedUser] = useState<User>();

  /**
   * Actualiza los datos del usuario autenticado en el estado global.
   */
  const updateAuthenticatedUser = (user: User) => {
    setAuthenticatedUser(user);
  };

  return (
    <AuthenticationContext.Provider
      value={{ authenticatedUser, setAuthenticatedUser, updateAuthenticatedUser }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
}
