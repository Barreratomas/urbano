import { useContext } from 'react';
import { Redirect, Route, RouteProps } from 'react-router';

import { AuthenticationContext } from './context/AuthenticationContext';
import { getRoutePath } from './routes';

export { Route } from 'react-router';

interface PrivateRouteProps extends RouteProps {
  roles?: string[];
}

/**
 * Ruta privada que requiere autenticación y opcionalmente roles específicos.
 */
export function PrivateRoute({ component: Component, roles, ...rest }: PrivateRouteProps) {
  const { authenticatedUser } = useContext(AuthenticationContext);

  return (
    <Route
      {...rest}
      render={(props) => {
        if (authenticatedUser) {
          if (roles) {
            if (roles.includes(authenticatedUser.role)) {
              return <Component {...props} />;
            } else {
              // Si no tiene el rol, redirige al dashboard principal
              return <Redirect to={getRoutePath('dashboard')} />;
            }
          } else {
            return <Component {...props} />;
          }
        }
        // Si no está autenticado, redirige al login
        return <Redirect to={getRoutePath('login')} />;
      }}
    />
  );
}

/**
 * Ruta de autenticación que solo es accesible si el usuario NO está logueado.
 * Redirige al dashboard si el usuario ya inició sesión.
 */
export function AuthRoute({ component: Component, ...rest }) {
  const { authenticatedUser } = useContext(AuthenticationContext);

  return (
    <Route
      {...rest}
      render={(props) => {
        return authenticatedUser ? (
          <Redirect to={getRoutePath('dashboard')} />
        ) : (
          <Component {...props} />
        );
      }}
    />
  );
}
