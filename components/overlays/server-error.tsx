import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter
} from '@chakra-ui/react';
import { IconLogout, IconRefresh } from '@tabler/icons';
import { useRouter } from 'next/router';
import { useRef } from 'react';
import SignOut from '../../lib/sign-out';
import { ModalButton } from '../../styles/components-styles';

const ServerError = () => {
  const router = useRouter();
  const cancelRef = useRef(null);

  return (
    <>
      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        isOpen={true}
        onClose={() => null}
        isCentered>
        <AlertDialogOverlay bg="blackAlpha.300" backdropFilter="blur(10px) hue-rotate(90deg)" />
        <AlertDialogContent bgColor={'gray.800'}>
          <AlertDialogHeader color={'#E53E3E'}>Server Error</AlertDialogHeader>
          <AlertDialogBody>
            There was an error while processing your request. Please try again later.
          </AlertDialogBody>
          <AlertDialogFooter gap={5}>
            <ModalButton rightIcon={<IconLogout />} onClick={() => SignOut(router)}>
              Sign Out
            </ModalButton>
            <ModalButton rightIcon={<IconRefresh />} onClick={() => router.back()}>
              Retry
            </ModalButton>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ServerError;
