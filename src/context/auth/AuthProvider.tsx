import { FC, useReducer, ReactNode, useEffect, useMemo } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Cookies from 'js-cookie';
import axios from 'axios';

import { AuthContext, authReducer } from '@/context';
import { IUser } from '@/interfaces';
import { shopApi } from '@/api';


export interface AuthState {
  isLoggedIn: boolean;
  user?: IUser
}

const AUTH_INITIAL_STATE: AuthState = {
  isLoggedIn: false,
  user: undefined,
}

export const AuthProvider: FC<{children: ReactNode}> = ({ children }) => {

  const [state, dispatch] = useReducer(authReducer, AUTH_INITIAL_STATE);
  const { data, status } = useSession();

  useEffect(() => {
    if ( status === 'authenticated') {
      dispatch({ type: '[Auth] - Login', payload: data?.user as IUser });
    };
  }, [ status, data])
  

  useEffect(() => {
    checkToken();
  }, []);
  

  const checkToken = async () => {

    if ( !Cookies.get('token')) {
      return;
    }

    try {
      const { data } = await shopApi.get('/user/validate-token');
      const { user, token } = data;
      Cookies.set('token', token);
      dispatch({ type: '[Auth] - Login', payload: user });
    } catch (error) {
      Cookies.remove('token');
    }
  }

  const loginUser = async ( email: string, password: string ): Promise<boolean> => {
    try {
      const { data } = await shopApi.post('/user/login', { email, password });
      const { user, token } = data;
      Cookies.set('token', token);
      dispatch({ type: '[Auth] - Login', payload: user });
      return true;
    } catch (error) {
      return false;
    }
  }

  const registerUser = async ( name: string, email: string, password: string ): Promise<{ hasError: boolean, message?: string }> => {
    try {
      const { data } = await shopApi.post('/user/register', { name, email, password });
      const { user, token } = data;
      Cookies.set('token', token);
      dispatch({ type: '[Auth] - Login', payload: user });

      return {
        hasError: false
      }
    } catch (error) {
      if ( axios.isAxiosError(error) ) {
        return {
          hasError: true,
          message: error.response?.data.message
        }
      }
      return {
        hasError: true,
        message: 'Failed to create user'
      }
    }
  }

  const logout = () => {
    Cookies.remove('cart');
    Cookies.remove('shippingAddress');

    signOut();
  }

  const providerValue = useMemo(
    () => ({
      ...state,
      // Methods
      loginUser,
      logout,
      registerUser
    }),
    [state]
  );

  return (
    <AuthContext.Provider
      value={providerValue}
    >
      { children }
    </AuthContext.Provider>
  )
}