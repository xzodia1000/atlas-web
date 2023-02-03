import { useRouter } from 'next/router';
import { useContext, createContext } from 'react';
import client from './axios-service';

// Auth context data
interface AuthContextData {
  token: string | null;
}

// Auth context with default values
const AuthContext = createContext<AuthContextData>({
  token: null
});

// Auth provider component
export function AuthProvider({ children }: any) {
  // Router instance to redirect user to login page if not logged in
  const router = useRouter();

  // Check if token is present in local storage
  const token = localStorage.getItem('token');

  if (token != null) {
    // Set token in axios headers
    client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  if (token === null && router.pathname !== '/login') {
    // Redirect user to login page if not logged in
    router.replace('/login');
  } else if (token != null && (router.pathname === '/login' || router.pathname === '/')) {
    // Redirect user to home page if logged in
    router.replace('/dashboard');
  }

  // Return auth context provider
  return <AuthContext.Provider value={{ token }}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuthContext() {
  return useContext(AuthContext);
}
