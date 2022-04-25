import { createContext, useCallback, useEffect, useState } from 'react';
import { AxiosError, AxiosResponse } from 'axios';
import { useQuery } from 'react-query';
import { SignInResponseType, UserType } from '../util/types';
import { api } from '../util/api';

interface GlobalContextType {
  user?: UserType;

  isContextLoading: boolean;

  isSignedIn(): boolean;

  signIn(data: SignInResponseType): void;

  signOut(): void;
}

export const GlobalContext = createContext<GlobalContextType>({} as never);

export default function GlobalContextProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string>();

  const { data, refetch, remove, isLoading, isFetching, isError } = useQuery<AxiosResponse<UserType>, AxiosError>(
    'fetchUser',
    () => api.get('/users/authenticated'),
    { enabled: false }
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
    remove();
  }, [remove]);

  const signIn = (signInResponse: SignInResponseType) => {
    localStorage.setItem('token', signInResponse.jwt);
    setToken(signInResponse.jwt);
    refetch();
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
        isContextLoading: token ? isLoading || isFetching : false,
        signIn,
        signOut
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
