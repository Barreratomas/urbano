import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';

import useAuth from './hooks/useAuth';
import Calendar from './pages/Calendar';
import Contact from './pages/Contact';
import Contents from './pages/Contents';
import Courses from './pages/Courses';
import Dashboard from './pages/Dashboard';
import Favorites from './pages/Favorites';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Users from './pages/Users';
import { AuthRoute, PrivateRoute } from './Route';
import authService from './services/AuthService';

export default function App() {
  const { authenticatedUser, setAuthenticatedUser } = useAuth();
  const [isLoaded, setIsLoaded] = useState(false);

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
        <PrivateRoute exact path="/" component={Dashboard} />
        <PrivateRoute exact path="/profile" component={Profile} />
        <PrivateRoute exact path="/users" component={Users} roles={['admin']} />
        <PrivateRoute exact path="/courses" component={Courses} />
        <PrivateRoute exact path="/courses/:id" component={Contents} />
        <PrivateRoute exact path="/favorites" component={Favorites} />
        <PrivateRoute exact path="/calendar" component={Calendar} />
        <PrivateRoute exact path="/contact" component={Contact} />

        <AuthRoute exact path="/login" component={Login} />
      </Switch>
    </Router>
  ) : null;
}
