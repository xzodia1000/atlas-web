import {
  Center,
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
  SimpleGrid,
  Spinner,
  Stack,
  useToast
} from '@chakra-ui/react';
import { IconDownload } from '@tabler/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';
import client from '../../lib/axios-service';
import { HandleError, HandleSuccess } from '../../lib/system-feedback';
import { Field, InputField, SubmitButton } from '../../styles/components-styles';

export default function EditProfile() {
  const toast = useToast();
  const router = useRouter();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [gender, setGender] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');

  const { isLoading, isSuccess, refetch } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      return await client.get('/user/profile').then((res) => res.data);
    },
    onSuccess: async (data) => {
      setFirstName(data.firstName);
      setLastName(data.lastName);
      setEmail(data.email);
      setUsername(data.username);
      setGender(data.gender);
      setDateOfBirth(data.dateOfBirth.substring(0, 10));
      setPhoneNumber(data.phoneNumber);
      setAddress(data.address);
    },
    onError: async (error: any) => {
      HandleError({ error, toast, router });
    }
  });

  const { isLoading: updating, mutate: updateProfile } = useMutation<any, Error>({
    mutationFn: async () => {
      return await Promise.all([
        client.patch(`/user/firstName?firstName=${firstName}`),
        client.patch(`/user/lastName?lastName=${lastName}`),
        client.patch('/user/email', { email }),
        client.patch(`/user/username?username=${username}`),
        client.patch(`/user/gender?gender=${gender}`),
        client.patch('/user/dateOfBirth', { dateOfBirth }),
        client.patch('/user/phoneNumber', { phoneNumber }),
        client.patch(`/user/address?address=${address}`)
      ]);
    },
    onSuccess: async () => {
      refetch();
      HandleSuccess({ message: 'Profile updated successfully', toast });
    },
    onError: async (error: any) => {
      HandleError({ error, toast, router });
    }
  });

  // Function to handle form submit
  const postData = async (event: FormEvent<HTMLFormElement>) => {
    // Prevent default form submit and prevents reloading page
    event.preventDefault();

    // Call mutation function to validate login
    updateProfile();
  };

  return (
    <>
      {isLoading && (
        <Center h={'calc(100vh - 240px)'}>
          <Spinner size={'xl'} thickness={'5px'} color={'accent_red'} />
        </Center>
      )}
      {isSuccess && (
        <form onSubmit={postData}>
          <SimpleGrid>
            <Field>
              <FormLabel w={150}>First Name</FormLabel>
              <InputField
                value={firstName}
                onChange={(e: any) => setFirstName(e.target.value)}
                type={'text'}
                required
              />
            </Field>
            <Field>
              <FormLabel w={150}>Last Name</FormLabel>
              <InputField
                value={lastName}
                onChange={(e: any) => setLastName(e.target.value)}
                type={'text'}
                required
              />
            </Field>
            <Field>
              <FormLabel w={150}>Email</FormLabel>
              <InputField
                value={email}
                onChange={(e: any) => setEmail(e.target.value)}
                type={'email'}
                required
              />
            </Field>
            <Field>
              <FormLabel w={150}>Username</FormLabel>
              <InputField
                value={username}
                onChange={(e: any) => setUsername(e.target.value)}
                type={'text'}
                required
              />
            </Field>
            <Field>
              <FormLabel w={150}>Gender</FormLabel>
              <RadioGroup value={gender} onClick={(e: any) => setGender(e.target.value)}>
                <Stack spacing={5} direction="row">
                  <Radio value="male">Male</Radio>
                  <Radio value="female">Female</Radio>
                  <Radio value="other">Other</Radio>
                  <Radio value="undefined">Prefer not to say</Radio>
                </Stack>
              </RadioGroup>
            </Field>
            <Field>
              <FormLabel w={150}>Date of Birth</FormLabel>
              <InputField
                value={dateOfBirth}
                onChange={(e: any) => setDateOfBirth(e.target.value)}
                type={'date'}
                required
              />
            </Field>
            <Field>
              <FormLabel w={150}>Phone Number</FormLabel>
              <InputField
                value={phoneNumber}
                onChange={(e: any) => setPhoneNumber(e.target.value)}
                type={'number'}
                required
              />
            </Field>
            <Field>
              <FormLabel w={150}>Address</FormLabel>
              <InputField
                value={address}
                onChange={(e: any) => setAddress(e.target.value)}
                type={'text'}
                required
              />
            </Field>
            <Field>
              <FormLabel w={150}>Role</FormLabel>
              <FormControl h={'50px'} w={'450px'} isReadOnly>
                <InputField
                  value={'Admin'}
                  type={'text'}
                  sx={{
                    '&:hover': {
                      cursor: 'not-allowed',
                      borderColor: 'red'
                    },
                    '&:focus': {
                      borderColor: 'red'
                    }
                  }}
                />
              </FormControl>
            </Field>
          </SimpleGrid>
          <SubmitButton
            isLoading={updating}
            type={'submit'}
            leftIcon={<IconDownload fontSize="25" />}>
            Save Changes
          </SubmitButton>
        </form>
      )}
    </>
  );
}
