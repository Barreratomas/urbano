/**
 * Hook personalizado para acceder al contexto de autenticación.
 */
import { useContext } from 'react';

import { AuthenticationContext } from '../context/AuthenticationContext';

export default function useAuth() {
  return useContext(AuthenticationContext);
}
