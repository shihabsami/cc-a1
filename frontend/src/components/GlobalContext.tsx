import React, { createContext, FunctionComponent, useCallback, useEffect, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { SignInResponse, User } from '../util/types';
import { api } from '../util/api';
import { AxiosResponse } from 'axios';

interface GlobalContextType {
  user?: User;

  signIn(data: SignInResponse): void;

  signOut(): void;
}

export const GlobalContext = createContext<GlobalContextType>({} as never);

export const GlobalContextProvider: FunctionComponent<unknown> = ({ children }) => {
  const client = useQueryClient();
  const [token, setToken] = useState<string>();

  const { data, refetch, remove, isError } = useQuery<AxiosResponse<User>>('user', () => api.get('/users/profile'));

  // On token change, update the header and refetch user.
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      refetch();
    } else {
      delete api.defaults.headers.common['Authorization'];
      remove();
    }
  }, [refetch, remove, token]);

  // On startup, get token from local storage.
  useEffect(() => {
    setToken(localStorage.getItem('token') || undefined);
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem('token');
    setToken(undefined);
    client.invalidateQueries('user');
  }, [client]);

  const signIn = (data: SignInResponse) => {
    localStorage.setItem('token', data.jwt);
    setToken(data.jwt);
    client.invalidateQueries('user');
  };

  // Clear token if error.
  useEffect(() => {
    if (isError) {
      localStorage.removeItem('token');
      setToken(undefined);
    }
  }, [isError]);

  return (
    <GlobalContext.Provider
      value={{
        user: token ? data?.data : undefined,
        signIn,
        signOut
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
