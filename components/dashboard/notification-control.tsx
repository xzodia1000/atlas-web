import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Spacer,
  Text,
  Textarea,
  useToast
} from '@chakra-ui/react';
import { IconCheck, IconSearch } from '@tabler/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useState } from 'react';
import client from '../../lib/axios-service';
import Capitalize from '../../lib/capitalize-letter';
import { HandleError, HandleSuccess } from '../../lib/system-feedback';
import { AppMenu, InputField, SmallButton, SubmitButton } from '../../styles/components-styles';
import DropdownMenu from '../dropdown-menu';

// This is the user Interface
interface User {
  id: string;
  username: string;
}

// This is the notification control page
const NotificationControl = () => {
  const toast = useToast();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [targetGroup, setTargetGroup] = useState('all');
  const [targetUserId, setTargetUserId] = useState<User | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Filter menu options
  const MenuOptions = [
    {
      title: 'All',
      value: 'all',
      function: () => {
        setTargetGroup('all');
        setTargetUserId(null);
      }
    },
    {
      title: 'Influencers',
      value: 'influencers',
      function: () => {
        setTargetGroup('influencers');
        setTargetUserId(null);
      }
    },
    {
      title: 'Celebrities',
      value: 'celebrity',
      function: () => {
        setTargetGroup('celebrity');
        setTargetUserId(null);
      }
    },
    {
      title: 'Single User',
      value: 'singleUser',
      function: () => setTargetGroup('singleUser')
    }
  ];

  // This is the search user query
  const { isLoading: sending, mutate: sendNotification } = useMutation<any, Error>({
    mutationFn: async () => {
      if (targetGroup === 'singleUser') {
        // Send notification to a single user
        return await client.post('/notification/send', {
          title,
          body,
          targetGroup,
          targetUserId: targetUserId?.id
        });
      } else {
        // Send notification to a group
        return await client.post('/notification/send', {
          title,
          body,
          targetGroup
        });
      }
    },
    onSuccess: async () => {
      HandleSuccess({ message: 'Notification sent successfully', toast });
    },
    onError: async (error: any) => {
      HandleError({ error, toast, router });
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
          <Flex>
            <Flex direction="column" gap={5}>
              <Text fontSize={20}>Title</Text>
              <InputField
                onChange={(e: any) => setTitle(e.target.value)}
                type="text"
                placeholder="Title"
                required
              />
            </Flex>
            <Spacer />
            <Flex direction="column" gap={5} alignItems="flex-end">
              <Text fontSize={20}>Target Group</Text>
              <DropdownMenu
                options={MenuOptions}
                title={targetGroup === 'singleUser' ? 'Single User' : Capitalize(targetGroup)}
                currentOption={targetGroup}
              />
            </Flex>
          </Flex>
          <AppMenu
            isDisabled={targetGroup !== 'singleUser'}
            leftIcon={<IconSearch />}
            onClick={() => setIsDrawerOpen(true)}>
            {targetUserId === null || targetUserId.id === ''
              ? 'Search User'
              : targetUserId.username}
          </AppMenu>
          <Flex direction="column" gap={5}>
            <Text fontSize={20}>Body</Text>
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
          </Flex>
          <SubmitButton isLoading={sending} type="submit">
            Send Notification
          </SubmitButton>
        </Flex>
      </form>

      <SearchUser
        user={targetUserId}
        setUser={setTargetUserId}
        state={isDrawerOpen}
        setState={setIsDrawerOpen}
      />
    </>
  );
};

const SearchUser = ({ user, setUser, state, setState }: any) => {
  const { data, isSuccess } = useQuery({
    queryKey: ['users', user],
    queryFn: async () => {
      return await client
        .get(`/user/search?searchTerm=${user.username}&page=1`)
        .then((res) => res.data);
    },
    enabled: user !== null
  });

  return (
    <>
      <Drawer
        isOpen={state}
        placement="right"
        onClose={() => {
          setState(false);
          user?.id === '' ? setUser(null) : '';
        }}>
        <DrawerOverlay />
        <DrawerContent bgColor="gray.800">
          <DrawerCloseButton />
          <DrawerHeader>Search User</DrawerHeader>

          <DrawerBody>
            <Flex direction="column" gap={10}>
              <InputField
                value={user !== null ? user.username : ''}
                onChange={(e: any) =>
                  e.target.value === ''
                    ? setUser(null)
                    : setUser({ id: '', username: e.target.value })
                }
                w="100%"
                placeholder="Search User"
              />
              {isSuccess && (
                <Flex w="100%" direction="column" gap={5}>
                  {data.data.map((result: any) => (
                    <Box
                      key={result.id}
                      h="50px"
                      w="100%"
                      rounded="5px"
                      p="10px"
                      cursor="pointer"
                      _hover={{ bgColor: 'accent_red', color: 'accent_blue' }}
                      fontSize={20}
                      onClick={() => setUser({ id: result.id, username: result.username })}>
                      {result.username}
                    </Box>
                  ))}
                </Flex>
              )}
            </Flex>
          </DrawerBody>

          <DrawerFooter>
            <SmallButton
              icon={<IconCheck />}
              onClick={() => {
                setState(false);
                user?.id === '' ? setUser(null) : '';
              }}
            />
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default NotificationControl;
