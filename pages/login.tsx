import Head from 'next/head';
import { FormEvent, useState } from 'react';
import Image from 'next/image';
import client from '../lib/axios-service';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { Center, FormControl, FormLabel, SimpleGrid, Stack } from '@chakra-ui/react';
import { LoginButton, InputField, RememberMe } from '../styles/login-styles';

export default function Home() {
  // Router instance to redirect user to home page after login
  const router = useRouter();

  // State variables to store email, password and remember me checkbox
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // React Query
  const { mutate: validateLogin } = useMutation<any, Error>({
    // Mutation function to validate login
    mutationFn: async () => {
      // Axios post request to validate login
      return await client.post('/auth/login', {
        email,
        password
      });
    },

    // Callbacks to handle success
    onSuccess: async (response) => {
      // Get token from response
      const token = response.data.access_token;

      if (rememberMe) {
        // Save token in local storage
        localStorage.setItem('token', token);
        console.log('token saved in local storage');
      } else {
        // Save token in session storage
        sessionStorage.setItem('token', token);
        console.log('token saved in session storage');
      }

      // Redirect user to home page
      router.push('/dashboard');
    },

    // Callbacks to handle error
    onError: async (err) => {
      alert(err);
    }
  });

  // Function to handle form submit
  const postData = async (event: FormEvent<HTMLFormElement>) => {
    // Prevent default form submit and prevents reloading page
    event.preventDefault();

    // Call mutation function to validate login
    validateLogin();
  };

  return (
    <>
      <Head>
        <title>atlas - Login</title>
        <meta name="description" content="Login page for atlas admin panel" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.png" />
      </Head>

      <Center h="100vh">
        <form onSubmit={postData}>
          <FormControl>
            <SimpleGrid>
              <Center mb={10}>
                <Image src="/logo.png" alt="logo" width={150} height={150} />
              </Center>

              <FormLabel htmlFor="email">Email</FormLabel>
              <InputField
                value={email}
                onChange={(e: any) => setEmail(e.target.value)}
                type="email"
                id="email"
                name="email"
                required
                mb={'15px'}
              />

              <FormLabel htmlFor="password">Password</FormLabel>
              <InputField
                value={password}
                onChange={(e: any) => setPassword(e.target.value)}
                type="password"
                id="password"
                name="password"
                required
                mb={'10px'}
              />

              <RememberMe onChange={(e: any) => setRememberMe(e.target.checked)}>
                Remember me
              </RememberMe>

              <Center>
                <LoginButton type="submit">Login</LoginButton>
              </Center>
            </SimpleGrid>
          </FormControl>
        </form>
      </Center>
    </>
  );
}
