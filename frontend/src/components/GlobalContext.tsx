import { createContext, useCallback, useEffect, useState } from 'react';
import { AxiosError, AxiosResponse } from 'axios';
import { useQuery, useQueryClient } from 'react-query';
import { SignInResponseType, UserType } from '../util/types';
import { api } from '../util/api';

interface GlobalContextType {
  user?: UserType;
  isLoading: boolean;

  isSignedIn(): boolean;

  signIn(data: SignInResponseType): void;

  signOut(): void;
}

export const GlobalContext = createContext<GlobalContextType>({} as never);

export default function GlobalContextProvider({ children }: { children: React.ReactNode }) {
  const client = useQueryClient();
  const [token, setToken] = useState<string>();

  const { data, refetch, remove, isLoading, isFetching, isError } = useQuery<AxiosResponse<UserType>, AxiosError>(
    'fetchUser',
    () => api.get('/users/getAuthenticated')
  );

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
    client.invalidateQueries('fetchUser');
  }, [client]);

  const signIn = (signInResponse: SignInResponseType) => {
    localStorage.setItem('token', signInResponse.jwt);
    setToken(signInResponse.jwt);
    client.invalidateQueries('fetchUser');
  };

  // Clear token if error.
  useEffect(() => {
    if (isError) {
      signOut();
    }
  }, [isError, signOut]);

  return (
    <GlobalContext.Provider
      value={{
        user: data?.data as UserType,
        isSignedIn: () => !!localStorage.getItem('token'),
        isLoading: token ? isLoading || isFetching : false,
        signIn,
        signOut
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
