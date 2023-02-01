import type { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import { QueryClient } from '@tanstack/react-query';
import { ChakraProvider } from '@chakra-ui/react';
import { global_theme } from '../styles/global';

// Dynamic import of AuthProvider component to prevent SSR
const AuthProviderComponent = dynamic(
  () => import('../lib/auth-context').then((mod) => mod.AuthProvider),
  { ssr: false }
);

// Dynamic import of QueryClientProvider component to prevent SSR
const QueryClientProvider = dynamic(() =>
  import('@tanstack/react-query').then((mod) => mod.QueryClientProvider)
);

export default function App({ Component, pageProps }: AppProps) {
  // Create query client
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false
      }
    }
  });
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProviderComponent>
        <ChakraProvider theme={global_theme}>
          <Component {...pageProps} />
        </ChakraProvider>
      </AuthProviderComponent>
    </QueryClientProvider>
  );
}
