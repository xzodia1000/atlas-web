import { useRouter } from 'next/router';
import { useState, useContext, createContext } from 'react';

interface AuthContextData {
  token: string | null;
  setToken: (isLoggedIn: string) => void;
}

const AuthContext = createContext<AuthContextData>({
  token: null,
  setToken: () => {
    return null;
  }
});

export function AuthProvider({ children }: any) {
  const router = useRouter();
  let flag: string | null;

  if (localStorage.getItem('token') != null || sessionStorage.getItem('token') != null) {
    flag =
      localStorage.getItem('token') != null
        ? localStorage.getItem('token')
        : sessionStorage.getItem('token');
  } else {
    flag = null;
  }

  const [token, setToken] = useState(flag);

  if (token === null && router.pathname !== '/login') {
    router.replace('/login');
  } else if (token != null && router.pathname === '/login') {
    router.replace('/');
  }

  return <AuthContext.Provider value={{ token, setToken }}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  return useContext(AuthContext);
}
