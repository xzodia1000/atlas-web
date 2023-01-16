import { Box, Flex, Spacer, Text } from '@chakra-ui/react';
import Head from 'next/head';
import { GoHomeButton } from '../styles/components-styles';
import { IconHome, IconLogout } from '@tabler/icons';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import SignOut from '../lib/sign-out';

// Dynamic imports
const EditProfile = dynamic(() =>
  import('../components/settings/edit-profile').then((mod) => mod.default)
);
const EditAvatar = dynamic(() =>
  import('../components/settings/edit-avatar').then((mod) => mod.default)
);
const ChangePassword = dynamic(() =>
  import('../components/settings/change-password').then((mod) => mod.default)
);
const SecuritySettings = dynamic(() =>
  import('../components/settings/security').then((mod) => mod.default)
);

// Components
const components = [
  {
    name: 'edit-profile',
    title: 'Edit Profile',
    component: <EditProfile />
  },
  {
    name: 'edit-avatar',
    title: 'Edit Avatar',
    component: <EditAvatar />
  },
  {
    name: 'change-password',
    title: 'Change Password',
    component: <ChangePassword />
  },
  {
    name: 'add-new-admin',
    title: 'Add New Admin',
    component: <div>add new admin</div>
  },
  {
    name: 'security-settings',
    title: 'Security Settings',
    component: <SecuritySettings />
  }
];

// Regex
const regex = /#([^?]*)/;

const Settings: NextPage = () => {
  // Router instance
  const router = useRouter();

  // Get current hash
  const currentHash = router.asPath.split('#')[1];

  // Active component
  const [activeComponent, setActiveComponent] = useState<any>();

  // Previous route
  const prevRoute = useRef<string>('');

  // Set title
  const title =
    components.find((component) => component.name === router.asPath.split('#')[1])?.title ??
    'Settings';

  // Set active component
  useEffect(() => {
    if (prevRoute.current === currentHash) {
      return;
    }
    const component = components.filter(
      (component) => component.name === regex.exec(router.asPath)?.[1] ?? 'edit-profile'
    );
    if (component.length > 0) {
      setActiveComponent(component[0].component);
    } else {
      setActiveComponent(components[0].component);
    }
    return () => {
      prevRoute.current = currentHash;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);
  return (
    <>
      <Head>
        <title>Settings - {title}</title>
        <meta name="description" content="Settings page for atlas admin panel" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.png" />
      </Head>

      <SideBar />
      <Box
        pos={'fixed'}
        h={'calc(100vh - 80px)'}
        w={'calc(100vw - 240px)'}
        mt={'80px'}
        ml={'240px'}
        p={'30px'}
        bgColor={'gray.800'}
        overflow={'auto'}>
        {activeComponent}
      </Box>
      <TopBar />
    </>
  );
};

const SideBar = () => {
  const router = useRouter();
  return (
    <Flex
      pos={'fixed'}
      h={'100vh'}
      w={'240px'}
      direction={'column'}
      bgColor={'gray.900'}
      borderRight="1px"
      borderRightColor={'gray.700'}>
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Box h={'calc(100% - 20px)'} w={'100%'}>
          <GoHomeButton
            leftIcon={<IconHome size={30} />}
            onClick={() => router.push('/dashboard#home')}>
            Go Home
          </GoHomeButton>
        </Box>
      </Flex>
      {components.map((component) => (
        <Flex
          key={component.name}
          className={
            router.asPath.split('#')[1] === component.name ||
            (router.asPath === '/settings' && component.name === 'edit-profile')
              ? 'isActive'
              : ''
          }
          align="center"
          p="4"
          mx="4"
          role="group"
          cursor="pointer"
          borderLeft={'3px solid'}
          borderLeftColor={'gray.900'}
          _hover={{
            borderLeft: '5px solid',
            borderLeftColor: 'accent_red'
          }}
          sx={{
            '&.isActive': {
              color: 'accent_red',
              borderLeftColor: 'accent_red'
            }
          }}
          onClick={() => router.push('/settings#' + component.name)}>
          {component.title}
        </Flex>
      ))}
      <Spacer />
      <Flex
        onClick={() => SignOut(router)}
        mx="8"
        p="4"
        mb="20px"
        alignItems="center"
        gap="2"
        cursor="pointer"
        rounded="10px"
        _hover={{
          bgColor: 'accent_red',
          color: 'white'
        }}>
        <IconLogout size={30} />
        Sign out
      </Flex>
    </Flex>
  );
};

const TopBar = () => {
  const router = useRouter();
  // Set title
  const title =
    components.find((component) => component.name === router.asPath.split('#')[1])?.title ??
    'Edit Profile';
  return (
    <Box
      pos={'fixed'}
      h={'80px'}
      w={'calc(100vw - 240px)'}
      ml={'240px'}
      p={'16px'}
      bgColor={'gray.900'}
      borderBottom="1px"
      borderBottomColor={'gray.700'}>
      <Text fontSize={30} color={'white'}>
        Settings - {title}
      </Text>
    </Box>
  );
};

export default Settings;
