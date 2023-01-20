import { Flex, Textarea, useToast } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import client from '../../lib/axios-service';
import { InputField, SubmitButton } from '../../styles/components-styles';

const NotificationControl = () => {
  const toast = useToast();

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [targetGroup, setTargetGroup] = useState('all');
  const [targetUserId, setTargetUserId] = useState('');

  const { isLoading: sending, mutate: sendNotification } = useMutation<any, Error>({
    mutationFn: async () => {
      return await client.post('/notification/send', {
        title,
        body,
        targetGroup,
        targetUserId
      });
    },
    onSuccess: async () => {
      return toast({
        title: 'Success!',
        description: 'Notification sent successfully',
        status: 'success',
        duration: 9000,
        isClosable: true,
        position: 'bottom-right'
      });
    }
  });

  const post = async (e: any) => {
    e.preventDefault();
    sendNotification();
  };

  return (
    <>
      <form onSubmit={post}>
        <Flex direction="column" gap={5}>
          <InputField
            onChange={(e: any) => setTitle(e.target.value)}
            type="text"
            placeholder="Title"
            required
          />
          <Textarea
            onChange={(e: any) => setBody(e.target.value)}
            bgColor="gray.700"
            borderRadius="8px"
            border="1px solid"
            borderColor="gray.700"
            _hover={{ borderColor: 'accent_yellow' }}
            _focus={{ border: '3px solid', borderColor: 'accent_yellow', shadow: 'xl' }}
            placeholder="Body"
            required
          />
          <SubmitButton isLoading={sending} type="submit" mt={0}>
            Send Notification
          </SubmitButton>
        </Flex>
      </form>
    </>
  );
};

export default NotificationControl;
