import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FormEvent, useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import client from '../lib/axios-service';
import { LoginButton, InputField, RememberMe } from '../styles/login-styles';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Center,
  FormControl,
  FormErrorMessage,
  FormLabel,
  SimpleGrid
} from '@chakra-ui/react';

export default function Login() {
  // Router instance to redirect user to home page after login
  const router = useRouter();

  // Ref to close alert dialog
  const cancelRef = useRef(null);

  // State variables to store email, password and remember me checkbox
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Error variables
  const [error, setError] = useState(false);
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [invalidPassword, setInvalidPassword] = useState(false);

  // React Query
  const { isLoading: validating, mutate: validateLogin } = useMutation<any, Error>({
    // Mutation function to validate login
    mutationFn: async () => {
      setInvalidEmail(false);
      setInvalidPassword(false);

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
    onError: async (err: any) => {
      try {
        if (err.response.status === 500) {
          setInvalidEmail(true);
        } else if (err.response.status === 401) {
          setInvalidPassword(true);
        }
      } catch (error) {
        setError(true);
      }
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
          <SimpleGrid>
            <Center mb={2}>
              <Image src="/logo.png" alt="logo" width={150} height={150} />
            </Center>

            <Center mb={5} fontSize={30} fontWeight="bold">
              atlas.
            </Center>

            <FormControl isInvalid={invalidEmail} mb={4}>
              <FormLabel fontSize={20} htmlFor="email">
                Email
              </FormLabel>
              <InputField
                value={email}
                onChange={(e: any) => setEmail(e.target.value)}
                type="email"
                id="email"
                name="email"
                required
                placeholder={'Enter your email'}
              />
              <FormErrorMessage>Invalid Email</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={invalidPassword} mb={4}>
              <FormLabel fontSize={20} htmlFor="password">
                Password
              </FormLabel>
              <InputField
                value={password}
                onChange={(e: any) => setPassword(e.target.value)}
                type="password"
                id="password"
                name="password"
                required
                placeholder={'Enter your password'}
              />
              <FormErrorMessage>Invalid Password</FormErrorMessage>
            </FormControl>

            <RememberMe mb={10} onChange={(e: any) => setRememberMe(e.target.checked)}>
              Remember me
            </RememberMe>

            <Center>
              <LoginButton isLoading={validating} type="submit">
                Login
              </LoginButton>
            </Center>
          </SimpleGrid>
        </form>
      </Center>

      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        isOpen={error}
        onClose={() => setError(false)}
        isCentered>
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader color={'#E53E3E'}>Server Error</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            There was an error while processing your request. Please try again later.
          </AlertDialogBody>
          <AlertDialogFooter></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
