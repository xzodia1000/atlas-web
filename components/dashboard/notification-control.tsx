import { Flex, Textarea, useToast } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import client from '../../lib/axios-service';
import Capitalize from '../../lib/capitalize-letter';
import { HandleError, HandleSuccess } from '../../lib/system-feedback';
import { InputField, SubmitButton } from '../../styles/components-styles';
import DropdownMenu from '../dropdown-menu';
import ServerError from '../overlays/server-error';

const NotificationControl = () => {
  const toast = useToast();
  const [serverError, setServerError] = useState(false);

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [targetGroup, setTargetGroup] = useState('all');
  const [targetUserId, setTargetUserId] = useState(null);

  const MenuOptions = [
    {
      title: 'All',
      value: 'all',
      function: () => setTargetGroup('all')
    },
    {
      title: 'Influencers',
      value: 'influencers',
      function: () => setTargetGroup('influencers')
    },
    {
      title: 'Celebrities',
      value: 'celebrity',
      function: () => setTargetGroup('celebrity')
    },
    {
      title: 'Single User',
      value: 'singleUser',
      function: () => setTargetGroup('singleUser')
    }
  ];

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
      HandleSuccess({ message: 'Notification sent successfully', toast });
    },
    onError: async (error: any) => {
      try {
        HandleError({ error, toast });
      } catch (error) {
        setServerError(true);
      }
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
          <DropdownMenu
            options={MenuOptions}
            title={targetGroup === 'singleUser' ? 'Single User' : Capitalize(targetGroup)}
            currentOption={targetGroup}
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
      {serverError && <ServerError />}
    </>
  );
};

export default NotificationControl;
