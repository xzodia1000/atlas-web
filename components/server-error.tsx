import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter
} from '@chakra-ui/react';
import { IconHome } from '@tabler/icons';
import router from 'next/router';
import { useRef } from 'react';
import { SubmitButton } from '../styles/components-styles';

export default function ServerError() {
  const cancelRef = useRef(null);

  return (
    <>
      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        isOpen={true}
        onClose={() => {
          return 0;
        }}
        isCentered>
        <AlertDialogOverlay />
        <AlertDialogContent bgColor={'gray.700'}>
          <AlertDialogHeader color={'#E53E3E'}>Server Error</AlertDialogHeader>
          <AlertDialogBody>
            There was an error while processing your request. Please try again later.
          </AlertDialogBody>
          <AlertDialogFooter>
            <SubmitButton
              mt={0}
              leftIcon={<IconHome size={20} />}
              onClick={() => {
                router.push('/dashboard#home');
              }}>
              Go Home
            </SubmitButton>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
