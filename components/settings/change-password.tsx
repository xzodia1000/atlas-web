import { FormLabel, SimpleGrid, useToast } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import { FormEvent, useState } from 'react';
import client from '../../lib/axios-service';
import { Field, InputField, SubmitButton } from '../../styles/settings-styles';

export default function ChangePassword() {
  const toast = useToast();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { isLoading: updating, mutate: updatePassword } = useMutation<any, Error>({
    mutationFn: async () => {
      if (newPassword.length < 8) {
        toast({
          title: 'Error',
          description: 'Password must be at least 8 characters.',
          status: 'error',
          duration: 9000,
          isClosable: true,
          position: 'bottom-right'
        });
        return;
      }
      if (newPassword !== confirmPassword) {
        toast({
          title: 'Error',
          description: 'Passwords do not match.',
          status: 'error',
          duration: 9000,
          isClosable: true,
          position: 'bottom-right'
        });
        return;
      }
      if (oldPassword === newPassword) {
        toast({
          title: 'Error',
          description: 'New password cannot be the same as old password.',
          status: 'error',
          duration: 9000,
          isClosable: true,
          position: 'bottom-right'
        });
        return;
      }
      return await client.patch('/user/password', {
        password: newPassword,
        confirmPassword
      });
    }
  });

  // Function to handle form submit
  const postData = async (event: FormEvent<HTMLFormElement>) => {
    // Prevent default form submit and prevents reloading page
    event.preventDefault();

    // Call mutation function to validate login
    updatePassword();
  };

  return (
    <>
      <form onSubmit={postData}>
        <SimpleGrid>
          <Field>
            <FormLabel w={150}>Old Password</FormLabel>
            <InputField
              value={oldPassword}
              onChange={(e: any) => setOldPassword(e.target.value)}
              type={'password'}
              required
              placeholder="Enter new password"
            />
          </Field>
          <Field>
            <FormLabel w={150}>New Password</FormLabel>
            <InputField
              value={newPassword}
              onChange={(e: any) => setNewPassword(e.target.value)}
              type={'password'}
              required
              placeholder="Enter new password"
            />
          </Field>
          <Field>
            <FormLabel w={150}>Confirm Password</FormLabel>
            <InputField
              value={confirmPassword}
              onChange={(e: any) => setConfirmPassword(e.target.value)}
              type={'password'}
              required
              placeholder="Confirm new password"
            />
          </Field>
        </SimpleGrid>
        <SubmitButton isLoading={updating} type="submit">
          Change Password
        </SubmitButton>
      </form>
    </>
  );
}
