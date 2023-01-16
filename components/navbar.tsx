import {
  Avatar,
  Box,
  Flex,
  HStack,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  useDisclosure,
  VStack,
  Text,
  Image,
  Skeleton,
  SkeletonCircle,
  Spacer
} from '@chakra-ui/react';
import {
  IconBellMinus,
  IconCalendarEvent,
  IconChartAreaLine,
  IconExclamationCircle,
  IconHome,
  IconMessageReport,
  IconChevronDown,
  IconReport,
  IconSettings,
  IconLogout
} from '@tabler/icons';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';
import client from '../lib/axios-service';
import SignOut from '../lib/sign-out';

const components = [
  {
    name: 'home',
    title: 'Dashboard',
    icon: IconHome
  },
  {
    name: 'moderation',
    title: 'Moderation',
    icon: IconExclamationCircle
  },
  {
    name: 'notification-control',
    title: 'Notifications',
    icon: IconBellMinus
  },
  {
    name: 'appeals',
    title: 'Appeals',
    icon: IconReport
  },
  {
    name: 'reported-posts',
    title: 'Reported Posts',
    icon: IconMessageReport
  },
  {
    name: 'post-analytics',
    title: 'Post Analytics',
    icon: IconChartAreaLine
  },
  {
    name: 'event-analytics',
    title: 'Event Analytics',
    icon: IconCalendarEvent
  }
];

export default function SidebarWithHeader({ children }: { children: ReactNode }) {
  return (
    <>
      <SiderBar />
      <Box
        pos={'fixed'}
        h={'calc(100vh - 80px)'}
        w={'calc(100vw - 240px)'}
        mt={'80px'}
        ml={'240px'}
        p={'16px'}
        bgColor={'gray.800'}
        overflow={'auto'}>
        {children}
      </Box>
      <TopBar />
    </>
  );
}

const SiderBar = () => {
  const router = useRouter();
  return (
    <Box
      pos={'fixed'}
      h={'100vh'}
      w={'240px'}
      bgColor={'gray.900'}
      borderRight="1px"
      borderRightColor={'gray.700'}>
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Flex
          h={'calc(100% - 20px)'}
          w={'100%'}
          bg={'accent_yellow'}
          alignItems="center"
          rounded={'10px'}>
          <Image src={'/logo.png'} alt="logo" ml="5px" h={'50px'} w={'50px'} rounded={'10px'} />
          <Flex direction={'column'}>
            <Text ml="2" fontSize="xl" color={'accent_blue'}>
              atlas.
            </Text>
            <Text ml="2" fontSize="xs" color="accent_blue">
              Admin Panel
            </Text>
          </Flex>
        </Flex>
      </Flex>
      {components.map((component) => (
        <Flex
          key={component.name}
          className={
            router.asPath.split('#')[1] === component.name ||
            (router.asPath === '/dashboard' && component.name === 'home')
              ? 'isActive'
              : ''
          }
          align="center"
          p="4"
          mx="4"
          borderRadius="lg"
          role="group"
          cursor="pointer"
          _hover={{
            bg: 'accent_red',
            color: 'white'
          }}
          sx={{
            '&.isActive': {
              color: 'accent_red',
              _hover: {
                color: 'white'
              }
            }
          }}
          onClick={() => router.push('/dashboard#' + component.name)}>
          <Icon mr="4" fontSize="25" as={component.icon} />
          {component.title}
        </Flex>
      ))}
    </Box>
  );
};

const TopBar = () => {
  const router = useRouter();
  const { onOpen } = useDisclosure();

  const {
    isLoading: profileLoading,
    isError: profileError,
    isSuccess: profileSuccess,
    data: profileData
  } = useQuery({
    queryKey: ['profile'],
    queryFn: () => client.get('/user/profile').then((res) => res.data)
  });

  const title =
    components.find((component) => component.name === router.asPath.split('#')[1])?.title ??
    'Dashboard';

  return (
    <Flex
      pos={'fixed'}
      h={'80px'}
      w={'calc(100vw - 240px)'}
      ml={'240px'}
      p={'16px'}
      bgColor={'gray.900'}
      borderBottom="1px"
      borderBottomColor={'gray.700'}
      justifyContent={'flex-end'}>
      <Text w={'max-content'} fontSize={30} color={'white'}>
        {title}
      </Text>
      <Spacer />
      <IconButton
        display={{ base: 'flex', md: 'none' }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
      />

      <HStack spacing="24px">
        <Flex alignItems={'center'}>
          <Menu>
            <MenuButton py={2} transition="all 0.3s" _focus={{ boxShadow: 'none' }}>
              <HStack>
                {profileLoading && <SkeletonCircle size={'32px'} />}
                {profileSuccess && <Avatar size={'sm'} src={profileData.profilePictureUrl} />}
                <VStack display="flex" alignItems="flex-start" spacing="1px" ml="2">
                  {profileLoading && <Skeleton h="15px" w={100} />}
                  {profileSuccess && (
                    <Text fontSize="sm">{profileData.firstName + ' ' + profileData.lastName}</Text>
                  )}
                  <Text fontSize="xs" color="gray.600">
                    Admin
                  </Text>
                </VStack>
                <Box display={{ base: 'none', md: 'flex' }}>
                  <IconChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList bg={'gray.900'} borderColor={'gray.700'}>
              <MenuItem
                onClick={() => router.push('/settings')}
                bg={'gray.900'}
                _hover={{
                  bg: 'accent_red',
                  color: 'white'
                }}>
                <Flex alignItems="center" gap="2">
                  <IconSettings />
                  Settings
                </Flex>
              </MenuItem>
              <MenuDivider />
              <MenuItem
                onClick={() => SignOut(router)}
                bg={'gray.900'}
                _hover={{
                  bg: 'accent_red',
                  color: 'white'
                }}>
                <Flex alignItems="center" gap="2">
                  <IconLogout />
                  Sign out
                </Flex>
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};
