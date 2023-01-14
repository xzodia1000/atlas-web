import {
  Avatar,
  Box,
  BoxProps,
  CloseButton,
  Drawer,
  DrawerContent,
  Flex,
  FlexProps,
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
  IconMenu2,
  IconMessageReport,
  IconChevronDown,
  TablerIcon
} from '@tabler/icons';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';
import client from '../lib/axios-service';

interface LinkItemProps {
  name: string;
  icon: TablerIcon;
  url: string;
}

const LinkItems: LinkItemProps[] = [
  { name: 'Dashboard', icon: IconHome, url: '/dashboard#home' },
  { name: 'Moderation', icon: IconExclamationCircle, url: '/dashboard#moderation' },
  { name: 'Notifications', icon: IconBellMinus, url: '/dashboard#notification-control' },
  { name: 'Appeals', icon: IconMessageReport, url: '/dashboard#appeals' },
  { name: 'Reported Posts', icon: IconMessageReport, url: '/dashboard#reported-posts' },
  { name: 'Post Analytics', icon: IconChartAreaLine, url: '/dashboard#post-analytics' },
  { name: 'Event Analytics', icon: IconCalendarEvent, url: '/dashboard#event-analytics' }
];
export default function SidebarWithHeader({ children }: { children: ReactNode }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box minH="100vh" bg={'gray.800'}>
      <SidebarContent onClose={() => onClose} display={{ base: 'none', md: 'block' }} />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full">
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {children}
      </Box>
    </Box>
  );
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  return (
    <Box
      transition="3s ease"
      bg={'gray.900'}
      borderRight="1px"
      borderRightColor={'gray.700'}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}>
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
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => (
        <NavItem key={link.name} icon={link.icon} url={link.url}>
          {link.name}
        </NavItem>
      ))}
    </Box>
  );
};

interface NavItemProps extends FlexProps {
  icon: TablerIcon;
  url: string;
  children: any;
}
const NavItem = ({ icon, url, children, ...rest }: NavItemProps) => {
  const router = useRouter();
  return (
    <Flex
      className={
        router.asPath === url || (router.asPath === '/dashboard' && url === '/dashboard#home')
          ? 'isActive'
          : ''
      }
      align="center"
      p="4"
      mx="4"
      borderRadius="lg"
      role="group"
      cursor="pointer"
      onClick={() => router.push(url, undefined, { shallow: true })}
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
      {...rest}>
      {icon && <Icon mr="4" fontSize="25" as={icon} />}
      {children}
    </Flex>
  );
};

interface MobileProps extends FlexProps {
  onOpen: () => void;
}
const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  const router = useRouter();
  const title = LinkItems.find((link) => link.url === router.asPath)?.name ?? 'Dashboard';

  const {
    isLoading: profileLoading,
    isError: profileError,
    isSuccess: profileSuccess,
    data: profileData
  } = useQuery({
    queryKey: ['profile'],
    queryFn: () => client.get('/user/profile').then((res) => res.data)
  });

  const {
    isLoading: avatarLoading,
    isError: avatarError,
    isSuccess: avatarSuccess,
    data: avatar
  } = useQuery({
    queryKey: ['avatar'],
    queryFn: () => client.get('/user/avatar').then((res) => res.data)
  });

  return (
    <>
      <Flex
        ml={{ base: 0, md: 60 }}
        px={{ base: 4, md: 4 }}
        height="20"
        alignItems="center"
        bg={'gray.900'}
        borderBottomWidth="1px"
        borderBottomColor={'gray.700'}
        justifyContent={{ base: 'space-between', md: 'flex-end' }}
        {...rest}>
        <Text w={'max-content'} fontSize={30} color={'accent_yellow_light'}>
          {title}
        </Text>
        <Spacer />
        <Flex>
          <IconButton
            display={{ base: 'flex', md: 'none' }}
            onClick={onOpen}
            variant="outline"
            aria-label="open menu"
            icon={<IconMenu2 />}
          />

          <HStack spacing={{ base: '0', md: '6' }}>
            <Flex alignItems={'center'}>
              <Menu>
                <MenuButton py={2} transition="all 0.3s" _focus={{ boxShadow: 'none' }}>
                  <HStack>
                    {avatarLoading && <SkeletonCircle size={'32px'} />}
                    {avatarSuccess && <Avatar size={'sm'} src={avatar} />}
                    <VStack
                      display={{ base: 'none', md: 'flex' }}
                      alignItems="flex-start"
                      spacing="1px"
                      ml="2">
                      {profileLoading && <Skeleton h="15px" w={100} />}
                      {profileSuccess && (
                        <Text fontSize="sm">
                          {profileData.firstName + ' ' + profileData.lastName}
                        </Text>
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
                    Settings
                  </MenuItem>
                  <MenuDivider />
                  <MenuItem
                    bg={'gray.900'}
                    _hover={{
                      bg: 'accent_red',
                      color: 'white'
                    }}>
                    Sign out
                  </MenuItem>
                </MenuList>
              </Menu>
            </Flex>
          </HStack>
        </Flex>
      </Flex>
    </>
  );
};
