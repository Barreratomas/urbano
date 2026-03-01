import { createContext, Dispatch, SetStateAction, useState } from 'react';

import User from '../models/user/User';

interface AuthContextValue {
  authenticatedUser: User;
  setAuthenticatedUser: Dispatch<SetStateAction<User>>;
  updateAuthenticatedUser: (user: User) => void;
}

export const AuthenticationContext = createContext<AuthContextValue>(null);

export function AuthenticationProvider({ children }) {
  const [authenticatedUser, setAuthenticatedUser] = useState<User>();

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
