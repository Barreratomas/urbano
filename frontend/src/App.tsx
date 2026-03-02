/**
 * Componente principal de la aplicación.
 * Maneja la autenticación inicial y el enrutamiento general.
 */
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';

import useAuth from './hooks/useAuth';
import { AuthRoute, PrivateRoute } from './Route';
import { routes } from './routes';
import authService from './services/AuthService';

export default function App() {
  const { authenticatedUser, setAuthenticatedUser } = useAuth();
  const [isLoaded, setIsLoaded] = useState(false);

  /**
   * Intenta refrescar la sesión del usuario al cargar la aplicación.
   * Maneja casos de cuentas deshabilitadas forzando el cierre de sesión.
   */
  const authenticate = async () => {
    try {
      const authResponse = await authService.refresh();
      setAuthenticatedUser(authResponse.user);
    } catch (error) {
      if (
        error.response?.status === 403 &&
        error.response?.data?.message === 'Account is disabled'
      ) {
        if (!window.location.href.includes('error=account_disabled')) {
          window.location.href = '/login?error=account_disabled';
          return;
        }
      }
    } finally {
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    if (!authenticatedUser) {
      authenticate();
    } else {
      setIsLoaded(true);
    }
  }, []);

  return isLoaded ? (
    <Router>
      <Switch>
        {routes.map((route, index) => {
          if (route.isPrivate) {
            return (
              <PrivateRoute
                key={index}
                exact={route.exact}
                path={route.path}
                component={route.component}
                roles={route.roles}
              />
            );
          }
          if (route.isAuth) {
            return (
              <AuthRoute
                key={index}
                exact={route.exact}
                path={route.path}
                component={route.component}
              />
            );
          }
          return null;
        })}
      </Switch>
    </Router>
  ) : null;
}
