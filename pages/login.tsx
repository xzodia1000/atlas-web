import Head from 'next/head';
import { useRouter } from 'next/router';
import { FormEvent, useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import client from '../lib/axios-service';
import { InputField, ModalButton } from '../styles/components-styles';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Center,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  SimpleGrid,
  useToast,
  Text,
  Image
} from '@chakra-ui/react';
import { SubmitButton } from '../styles/components-styles';
import { IconRefresh } from '@tabler/icons';
import { HandleSuccess } from '../lib/system-feedback';

export default function Login() {
  // Router instance to redirect user to home page after login
  const router = useRouter();

  // Ref to close alert dialog
  const cancelRef = useRef(null);

  // Chakra UI toast
  const toast = useToast();

  // State variables to store email, password and remember me checkbox
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Error variables
  const [error, setError] = useState(false);
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [invalidPassword, setInvalidPassword] = useState(false);

  const [signingIn, setSigningIn] = useState(false);

  // React Query
  const { isLoading: validating, mutate: validateLogin } = useMutation<any, Error>({
    // Mutation function to validate login
    mutationFn: async () => {
      setInvalidEmail(false);
      setInvalidPassword(false);
      setSigningIn(true);

      // Axios post request to validate login
      return await client.post('/auth/login', {
        email,
        password
      });
    },

    // Callbacks to handle success
    onSuccess: async (response) => {
      setSigningIn(true);

      // Get token from response
      const token = response.data.access_token;

      // Save token in local storage
      localStorage.setItem('token', token);

      // Redirect user to dashboard after a delay
      setTimeout(() => {
        router.push('/dashboard');
      }, 2e3);

      HandleSuccess({ message: 'Redirecting to dashboard', toast });
    },

    // Callbacks to handle error
    onError: async (err: any) => {
      setSigningIn(false);
      try {
        if (err.response.status === 400) {
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

      <Flex
        h="60px"
        w="175px"
        bg={'accent_yellow'}
        alignItems="center"
        rounded={'10px'}
        position="fixed"
        mt="10px"
        ml="10px">
        <Image src={'/logo.png'} alt="logo" ml="5px" h={'50px'} w={'50px'} rounded={'10px'} />
        <Flex direction={'column'}>
          <Text ml="2" fontSize="xl" color={'accent_blue'}>
            atlas.
          </Text>
          <Text ml="2" fontSize="xs" color="accent_blue">
            Admin Panel
          </Text>
        </Flex>
      </Flex>

      <Center h="100vh">
        <form onSubmit={postData}>
          <SimpleGrid>
            <Center mb={5}>
              <Flex
                h={'calc(100% + 20px)'}
                w={170}
                direction="column"
                alignItems="center"
                justifyContent="center"
                gap="2px"
                rounded="10px"
                bgColor="accent_yellow">
                <Image src="/logo.png" alt="logo" width={150} height={150} />
                <Text fontSize={30} fontWeight="bold" color="accent_blue">
                  atlas.
                </Text>
              </Flex>
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
            <Center>
              <SubmitButton isLoading={validating || signingIn} type="submit">
                Login
              </SubmitButton>
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
        <AlertDialogOverlay bg="blackAlpha.300" backdropFilter="blur(10px) hue-rotate(90deg)" />
        <AlertDialogContent bgColor={'gray.800'}>
          <AlertDialogHeader color={'#E53E3E'}>Server Error</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            There was an error while processing your request. Please try again later.
          </AlertDialogBody>
          <AlertDialogFooter gap={5}>
            <ModalButton
              rightIcon={<IconRefresh />}
              onClick={(e: any) => {
                postData(e);
                setError(false);
              }}>
              Retry Login
            </ModalButton>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
