import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Center,
  FormControl,
  FormLabel,
  SimpleGrid,
  Spinner
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import client from '../../lib/axios-service';
import { Field, InputField } from '../../styles/settings-styles';

export default function EditProfile() {
  const cancelRef = useRef(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');

  async function getProfile() {
    const { data } = await client.get('/user/profile');
    setFirstName(data.firstName);
    setLastName(data.lastName);
    setUsername(data.username);
    setDateOfBirth(data.dateOfBirth.substring(0, 10));
    setPhoneNumber(data.phoneNumber);
    setAddress(data.address);
    return data;
  }
  const { isLoading, isError, isSuccess, data } = useQuery(['profile'], getProfile);

  console.log(data);

  return (
    <>
      {isLoading && (
        <Center>
          <Spinner size={'xl'} thickness={'5px'} color={'accent_blue'} />
        </Center>
      )}
      {isError && (
        <AlertDialog
          motionPreset="slideInBottom"
          leastDestructiveRef={cancelRef}
          isOpen={isError}
          onClose={() => {
            return 0;
          }}
          isCentered>
          <AlertDialogOverlay />
          <AlertDialogContent>
            <AlertDialogHeader color={'#E53E3E'}>Server Error</AlertDialogHeader>
            <AlertDialogBody>
              There was an error while processing your request. Please try again later.
            </AlertDialogBody>
            <AlertDialogFooter></AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
      {isSuccess && (
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
            />
          </Field>
          <Field>
            <FormLabel w={150}>Role</FormLabel>
            <FormControl h={'50px'} w={'450px'} isReadOnly>
              <InputField
                value={'Admin'}
                type={'text'}
                bgColor={'#F7FAFC'}
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
      )}
    </>
  );
}
