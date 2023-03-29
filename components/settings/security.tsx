import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Flex,
  Text,
  useToast
} from '@chakra-ui/react';
import { IconTrash } from '@tabler/icons';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';
import { ModalButton } from '../../styles/components-styles';
import SignOut from '../../lib/sign-out';
import client from '../../lib/axios-service';
import { HandleError, HandleSuccess } from '../../lib/system-feedback';

// This is the security settings component
export default function SecuritySettings() {
  const toast = useToast();
  const router = useRouter();
  const cancelRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  // Function to delete account
  const { isLoading, mutate: deleteAccount } = useMutation<any, Error>({
    mutationFn: async () => {
      // Delete account on server
      return await client.delete('/user/delete');
    },
    onSuccess: async () => {
      // Handle success
      HandleSuccess({ toast, message: 'Account deleted successfully' });

      // Sign out user and redirect to login page
      SignOut(router);
    },
    onError: async (error: any) => {
      // Handle error
      HandleError({ toast, error, router });
      setIsOpen(false);
    }
  });
  return (
    <>
      <Flex direction="column" gap={5}>
        <Button
          onClick={() => setIsOpen(true)}
          w="max-content"
          leftIcon={<IconTrash />}
          bgColor="error_red"
          isLoading={isLoading}
          _loading={{ bgColor: 'error_red' }}
          _focus={{ bgColor: 'error_red' }}
          _hover={{ bgColor: 'red' }}>
          Delete Account
        </Button>
        <Text color="error_red" fontSize="lg">
          Deleting your account will delete all your data and you will no longer be able to access
          your account.
        </Text>
      </Flex>

      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        isCentered>
        <AlertDialogOverlay bg="blackAlpha.300" backdropFilter="blur(10px) hue-rotate(90deg)" />
        <AlertDialogContent bgColor={'gray.800'}>
          <AlertDialogHeader color={'accent_red'}>Delete Account</AlertDialogHeader>
          <AlertDialogBody>
            Are you sure you want to delete your account? This action cannot be undone.
          </AlertDialogBody>
          <AlertDialogFooter gap={5}>
            <ModalButton
              bgColor="accent_red"
              _hover={{ bgColor: 'red' }}
              onClick={() => deleteAccount()}>
              Yes
            </ModalButton>
            <ModalButton
              bgColor="#38a169"
              _focus={{ bgColor: '#38a169' }}
              _hover={{ bgColor: 'green' }}
              onClick={() => setIsOpen(false)}>
              No
            </ModalButton>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
