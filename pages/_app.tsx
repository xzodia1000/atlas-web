import type { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ChakraProvider } from '@chakra-ui/react';
import { global_theme } from '../styles/global';

export default function App({ Component, pageProps }: AppProps) {
  // Dynamic import of AuthProvider component to prevent SSR
  const AuthProviderComponent = dynamic(
    () => import('../lib/auth-context').then((mod) => mod.AuthProvider),
    { ssr: false }
  );

  // Create query client
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false
      }
    }
  });

  return (
    <ChakraProvider theme={global_theme}>
      <AuthProviderComponent>
        <QueryClientProvider client={queryClient}>
          <Component {...pageProps} />
        </QueryClientProvider>
      </AuthProviderComponent>
    </ChakraProvider>
  );
}
