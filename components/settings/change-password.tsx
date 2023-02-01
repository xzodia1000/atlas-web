import { FormLabel, SimpleGrid, useToast } from '@chakra-ui/react';
import { IconDownload } from '@tabler/icons';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';
import client from '../../lib/axios-service';
import { HandleError, HandleSuccess } from '../../lib/system-feedback';
import { Field, InputField, SubmitButton } from '../../styles/components-styles';

export default function ChangePassword() {
  const toast = useToast();
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { isLoading: updating, mutate: updatePassword } = useMutation<any, Error>({
    mutationFn: async () => {
      if (currentPassword === newPassword) {
        throw {
          response: {
            data: {
              message: 'New password cannot be the same as old password.'
            }
          }
        };
      }
      if (newPassword !== confirmPassword) {
        throw {
          response: {
            data: {
              message: 'Passwords do not match.'
            }
          }
        };
      }
      if (newPassword.length < 8) {
        throw {
          response: {
            data: {
              message: 'Password must be at least 8 characters.'
            }
          }
        };
      }

      return await client.patch('/user/password', {
        currentPassword,
        password: newPassword,
        confirmPassword
      });
    },
    onSuccess: async () => {
      HandleSuccess({ message: 'Password updated successfully.', toast });
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
    updatePassword();
  };

  return (
    <>
      <form onSubmit={postData}>
        <SimpleGrid>
          <Field>
            <FormLabel w={150}>Current Password</FormLabel>
            <InputField
              value={currentPassword}
              onChange={(e: any) => setCurrentPassword(e.target.value)}
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
        <SubmitButton leftIcon={<IconDownload fontSize="25" />} isLoading={updating} type="submit">
          Change Password
        </SubmitButton>
      </form>
    </>
  );
}
