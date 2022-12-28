import { useRouter } from 'next/router';
import { useState, useContext, createContext } from 'react';

const SessionContext = createContext({});
const SessionUpdateContext = createContext({});
const RedirectPageContext = createContext({});

export function SessionProvider({ children }: any) {
  const router = useRouter();
  const [SessionState, setSessionState] = useState(false);

  function updateSessionState() {
    if (SessionState === false) {
      setSessionState(true);
    } else if (SessionState === true) {
      setSessionState(false);
    }
  }

  function RedirectPage() {
    if (SessionState === false) {
      router.push('/login');
    }
  }

  return (
    <SessionContext.Provider value={SessionState}>
      <SessionUpdateContext.Provider value={updateSessionState}>
        <RedirectPageContext.Provider value={RedirectPage}>{children}</RedirectPageContext.Provider>
      </SessionUpdateContext.Provider>{' '}
    </SessionContext.Provider>
  );
}

export function useSessionContext() {
  return useContext(SessionContext);
}

export function useSessionUpdateContext() {
  return useContext(SessionUpdateContext);
}

export function useRedirectPageContext() {
  return useContext(RedirectPageContext);
}
