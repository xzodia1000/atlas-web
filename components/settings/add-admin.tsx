import { FormControl, FormLabel, SimpleGrid, useToast } from '@chakra-ui/react';
import { IconPlus } from '@tabler/icons';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';
import client from '../../lib/axios-service';
import { HandleError, HandleSuccess } from '../../lib/system-feedback';
import { Field, InputField, SubmitButton } from '../../styles/components-styles';

export default function AddAdmin() {
  const toast = useToast();
  const router = useRouter();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');

  const { isLoading, mutate: addAdmin } = useMutation<any, Error>({
    mutationFn: async () => {
      if (password !== confirmPassword) {
        throw {
          response: {
            data: {
              message: 'Passwords do not match.'
            }
          }
        };
      }
      if (password.length < 8) {
        throw {
          response: {
            data: {
              message: 'Password must be at least 8 characters.'
            }
          }
        };
      }

      return await client.post('/auth/admin/signup', {
        firstName,
        lastName,
        email,
        username,
        password,
        confirmPassword,
        phoneNumber,
        address,
        dateOfBirth
      });
    },
    onSuccess: async () => {
      HandleSuccess({ message: 'Admin added successfully', toast, router });
      setFirstName('');
      setLastName('');
      setEmail('');
      setUsername('');
      setPassword('');
      setConfirmPassword('');
      setPhoneNumber('');
      setAddress('');
      setDateOfBirth('');
    },
    onError: async (error: any) => {
      HandleError({ error, toast, router });
    }
  });

  const postData = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addAdmin();
  };

  return (
    <>
      <form onSubmit={postData}>
        <SimpleGrid>
          <Field>
            <FormLabel w={150}>First Name</FormLabel>
            <InputField
              value={firstName}
              onChange={(e: any) => setFirstName(e.target.value)}
              type={'text'}
              required
              placeholder="Enter first name"
            />
          </Field>
          <Field>
            <FormLabel w={150}>Last Name</FormLabel>
            <InputField
              value={lastName}
              onChange={(e: any) => setLastName(e.target.value)}
              type={'text'}
              required
              placeholder="Enter last name"
            />
          </Field>
          <Field>
            <FormLabel w={150}>Email</FormLabel>
            <InputField
              value={email}
              onChange={(e: any) => setEmail(e.target.value)}
              type={'email'}
              required
              placeholder="Enter email"
            />
          </Field>
          <Field>
            <FormLabel w={150}>Username</FormLabel>
            <InputField
              value={username}
              onChange={(e: any) => setUsername(e.target.value)}
              type={'text'}
              required
              placeholder="Enter username"
            />
          </Field>
          <Field>
            <FormLabel w={150}>New Password</FormLabel>
            <InputField
              value={password}
              onChange={(e: any) => setPassword(e.target.value)}
              type={'password'}
              required
              placeholder="Enter password"
            />
          </Field>
          <Field>
            <FormLabel w={150}>Confirm Password</FormLabel>
            <InputField
              value={confirmPassword}
              onChange={(e: any) => setConfirmPassword(e.target.value)}
              type={'password'}
              required
              placeholder="Confirm password"
            />
          </Field>
          <Field>
            <FormLabel w={150}>Phone Number</FormLabel>
            <InputField
              value={phoneNumber}
              onChange={(e: any) => setPhoneNumber(e.target.value)}
              type={'number'}
              required
              placeholder="Enter phone number"
            />
          </Field>
          <Field>
            <FormLabel w={150}>Address</FormLabel>
            <InputField
              value={address}
              onChange={(e: any) => setAddress(e.target.value)}
              type={'text'}
              required
              placeholder="Enter address"
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
        <SubmitButton isLoading={isLoading} type={'submit'} leftIcon={<IconPlus fontSize="25" />}>
          Add Admin
        </SubmitButton>
      </form>
    </>
  );
}
