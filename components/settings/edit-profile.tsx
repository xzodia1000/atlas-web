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
import { FormEvent, useState } from 'react';
import client from '../../lib/axios-service';
import { Field, InputField, SubmitButton } from '../../styles/settings-styles';
import ServerError from '../server-error';

export default function EditProfile() {
  const toast = useToast();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [gender, setGender] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');

  async function getProfile() {
    const { data } = await client.get('/user/profile');

    // Set initial input field values
    setFirstName(data.firstName);
    setLastName(data.lastName);
    setUsername(data.username);
    setGender(data.gender);
    setDateOfBirth(data.dateOfBirth.substring(0, 10));
    setPhoneNumber(data.phoneNumber);
    setAddress(data.address);

    return data;
  }
  const { isLoading, isError, isSuccess, data } = useQuery(['profile'], getProfile);

  console.log(data);

  const { isLoading: updating, mutate: updateProfile } = useMutation<any, Error>({
    mutationFn: async () => {
      return await Promise.all([
        client.patch('/user/firstName?firstName=' + firstName),
        client.patch('/user/lastName?lastName=' + lastName),
        client.patch('/user/username?username=' + username),
        client.patch('/user/gender?gender=' + gender),
        client.patch('/user/dateOfBirth', { dateOfBirth }),
        client.patch('/user/phoneNumber', { phoneNumber }),
        client.patch('/user/address?address=' + address)
      ]);
    },
    onSuccess: async () => {
      return toast({
        title: 'Success!',
        description: "We've updated your profile for you.",
        status: 'success',
        duration: 9000,
        isClosable: true,
        position: 'bottom-right'
      });
    },
    onError: async (error: any) => {
      return toast({
        title: 'Error',
        description: error.response.data.message,
        status: 'error',
        duration: 9000,
        isClosable: true,
        position: 'bottom-right'
      });
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
      {isError && <ServerError />}
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
              <RadioGroup defaultValue={gender} onClick={(e: any) => setGender(e.target.value)}>
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
