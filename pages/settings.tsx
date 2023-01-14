import {
  Tabs,
  TabList,
  Box,
  TabPanels,
  TabPanel,
  Drawer,
  DrawerContent,
  useDisclosure
} from '@chakra-ui/react';
import Head from 'next/head';
import { SettingsTab } from '../styles/settings-styles';
import EditProfile from '../components/settings/edit-profile';
import ChangePassword from '../components/settings/change-password';
import SecuritySettings from '../components/settings/security';

export default function Settings() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Head>
        <title>atlas - Settings</title>
        <meta name="description" content="Settings page for atlas admin panel" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.png" />
      </Head>
      {/* <Tabs isLazy orientation="vertical" variant={'unstyled'}>
        <Box
          position={'fixed'}
          h={'calc(100% - 90px)'}
          w={'210px'}
          mt={'80px'}
          mb={'10px'}
          ml={'10px'}
          border={'5px solid'}
          borderColor={'accent_blue'}
          rounded={10}
          bgColor={'accent_white'}>
          <TabList m={'10px'}>
            <SettingsTab>Edit Profile</SettingsTab>
            <SettingsTab>Edit Avatar</SettingsTab>
            <SettingsTab>Change Password</SettingsTab>
            <SettingsTab>Add New Admin</SettingsTab>
            <SettingsTab>Security Settings</SettingsTab>
          </TabList>
        </Box>
        <Box
          position={'fixed'}
          overflow={'auto'}
          h={'calc(100% - 90px)'}
          w={'calc(100% - 240px)'}
          ml={'230px'}
          mt={'80px'}
          mb={'10px'}
          mr={'10px'}
          border={'5px solid'}
          borderColor={'accent_blue'}
          rounded={10}>
          <TabPanels>
            <TabPanel>{EditProfile()}</TabPanel>
            <TabPanel>change avatar</TabPanel>
            <TabPanel>{ChangePassword()}</TabPanel>
            <TabPanel>add new admin</TabPanel>
            <TabPanel>{SecuritySettings()}</TabPanel>
          </TabPanels>
        </Box>
      </Tabs> */}
      <Tabs isLazy orientation="vertical" variant={'unstyled'}>
        <Box
          pos={'fixed'}
          h={'100vh'}
          w={60}
          bgColor={'gray.900'}
          borderRight="1px"
          borderRightColor={'gray.700'}>
          <TabList mt={'80px'} ml="10px">
            <SettingsTab>Edit Profile</SettingsTab>
            <SettingsTab>Edit Avatar</SettingsTab>
            <SettingsTab>Change Password</SettingsTab>
            <SettingsTab>Add New Admin</SettingsTab>
            <SettingsTab>Security Settings</SettingsTab>
          </TabList>
        </Box>

        <Box
          pos={'fixed'}
          h={20}
          w={'calc(100vw - 240px)'}
          ml={60}
          bgColor={'gray.900'}
          borderBottom="1px"
          borderBottomColor={'gray.700'}></Box>

        <Box
          pos={'fixed'}
          h={'calc(100vh - 20px)'}
          w={'calc(100vw - 240px)'}
          mt={20}
          ml={60}
          p={5}
          bgColor={'gray.800'}
          overflow={'auto'}>
          <TabPanels>
            <TabPanel>{EditProfile()}</TabPanel>
            <TabPanel>change avatar</TabPanel>
            <TabPanel>{ChangePassword()}</TabPanel>
            <TabPanel>add new admin</TabPanel>
            <TabPanel>{SecuritySettings()}</TabPanel>
          </TabPanels>
        </Box>
      </Tabs>
    </>
  );
}
