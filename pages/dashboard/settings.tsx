import { Center, Spinner, useToast } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import Head from 'next/head';
import client from '../../lib/axios-service';

export default function Settings() {
  const toast = useToast();

  const { isLoading, isError, isSuccess, data } = useQuery({
    queryKey: ['settings'],
    queryFn: () => client.get('/user/profile').then((res) => res.data)
  });

  return (
    <>
      <Head>
        <title>atlas - Settings</title>
        <meta name="description" content="Settings page for atlas admin panel" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.png" />
      </Head>
      {isLoading && (
        <Center h={'100vh'}>
          <Spinner size={'xl'} thickness={'5px'} color={'accent_blue'} />
        </Center>
      )}
      {isError &&
        toast({
          title: 'Server Error',
          description: 'Please try again later.',
          status: 'error',
          duration: 9000,
          isClosable: true
        })}
      {isSuccess && <h1>Loaded</h1>}
    </>
  );
}
