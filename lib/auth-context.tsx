import { useRouter } from 'next/router';
import { useState, useContext, createContext } from 'react';

// Auth context data
interface AuthContextData {
  token: string | null;
  setToken: (isLoggedIn: string) => void;
}

// Auth context with default values
const AuthContext = createContext<AuthContextData>({
  token: null,
  setToken: () => {
    return null;
  }
});

// Auth provider component
export function AuthProvider({ children }: any) {
  // Router instance to redirect user to login page if not logged in
  const router = useRouter();

  // Check if token is present in local storage or session storage
  let flag: string | null;

  if (localStorage.getItem('token') != null || sessionStorage.getItem('token') != null) {
    // Set flag to token if present
    flag =
      localStorage.getItem('token') != null
        ? localStorage.getItem('token')
        : sessionStorage.getItem('token');
  } else {
    // Set flag to null if not present
    flag = null;
  }

  // State variable to store token
  const [token, setToken] = useState(flag);

  if (token === null && router.pathname !== '/login') {
    // Redirect user to login page if not logged in
    router.replace('/login');
  } else if (token != null && router.pathname === '/login') {
    // Redirect user to home page if logged in
    router.replace('/dashboard');
  } else if (router.pathname === '/') {
    // Redirect user to home page if logged in
    router.replace('/dashboard');
  }

  // Return auth context provider
  return <AuthContext.Provider value={{ token, setToken }}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuthContext() {
  return useContext(AuthContext);
}