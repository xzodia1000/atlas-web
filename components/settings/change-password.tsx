import {
  Button,
  FormControl,
  FormLabel,
  InputGroup,
  InputRightElement,
  SimpleGrid
} from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import { FormEvent, useState } from 'react';
import client from '../../lib/axios-service';
import { InputField, LoginButton } from '../../styles/login-styles';
import Login from '../../pages/login';

export default function ChangePassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(false);

  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  const { isLoading: updating, mutate: updatePassword } = useMutation<any, Error>({
    mutationFn: async () => {
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
          <FormControl mb={4}>
            <FormLabel>New Password</FormLabel>
            <InputGroup>
              <InputField
                value={newPassword}
                onChange={(e: any) => setNewPassword(e.target.value)}
                type={show ? 'text' : 'password'}
                pr="4.5rem"
                required
                placeholder="Enter new password"
              />
              <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={handleClick}>
                  {show ? 'Hide' : 'Show'}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <FormControl mb={6}>
            <FormLabel>Confirm Password</FormLabel>
            <InputGroup>
              <InputField
                value={confirmPassword}
                onChange={(e: any) => setConfirmPassword(e.target.value)}
                type={show ? 'text' : 'password'}
                required
                placeholder="Confirm new password"
              />
              <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={handleClick}>
                  {show ? 'Hide' : 'Show'}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>
        </SimpleGrid>
        <LoginButton isLoading={updating} type="submit">
          Submit
        </LoginButton>
      </form>
    </>
  );
}
