import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Box,
  Center,
  chakra,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Image,
  Stack,
  useDisclosure
} from '@chakra-ui/react';
import {
  IconBellMinus,
  IconCalendarEvent,
  IconChartAreaLine,
  IconExclamationCircle,
  IconHome,
  IconLogout,
  IconMenu2,
  IconMessageReport,
  IconReport,
  IconSettings
} from '@tabler/icons';

export default function Navbar(title: string) {
  const router = useRouter();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const MenuOption = chakra(Flex, {
    baseStyle: {
      height: '50px',
      width: '100%',
      padding: '10px',
      gap: '10px',
      alignItems: 'center',
      color: 'accent_blue',
      bgColor: '#F5F5F5',
      border: '5px solid',
      borderColor: 'accent_blue',
      fontSize: '20px',
      borderRadius: '10px',
      '&:hover': {
        bgColor: 'accent_yellow'
      },
      '&.isActive': {
        bgColor: 'accent_yellow'
      }
    }
  });

  return (
    <>
      <Flex position={'fixed'} w={'100vw'} mt={'10px'}>
        <Link href={'/dashboard'}>
          <Image src={'/logo.png'} alt="logo" h={'60px'} w={'60px'} ml={'10px'} rounded={'10px'} />
        </Link>
        <Box
          ml={'10px'}
          mr={'10px'}
          h={'60px'}
          flex={'1'}
          rounded={'10px'}
          textAlign={'center'}
          fontSize={'30px'}
          bgColor={'accent_yellow'}
          color={'accent_blue'}
          border="5px solid"
          borderColor={'accent_blue'}>
          <Center h={'50px'}> {title} </Center>
        </Box>
        <Box
          bgColor={'accent_yellow'}
          color={'accent_blue'}
          border={'5px solid'}
          borderColor={'accent_blue'}
          h={'60px'}
          w={'60px'}
          mr={'10px'}
          rounded={'10px'}
          onClick={onOpen}
          sx={{
            '&:hover': {
              cursor: 'pointer',
              bgColor: 'accent_blue',
              color: '#FFFFFF'
            }
          }}>
          <Center h={'100%'}>
            <IconMenu2 size={'40px'}></IconMenu2>
          </Center>
        </Box>
      </Flex>
      <Drawer placement={'right'} size={'xs'} onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent
          mt={'10px'}
          mb={'10px'}
          mr={'10px'}
          rounded={'10px'}
          border={'5px solid'}
          borderColor={'accent_blue'}
          bgColor={'#F5F5F5'}>
          <DrawerCloseButton
            bgColor={'accent_yellow'}
            color={'accent_blue'}
            sx={{
              '&:hover': {
                bgColor: 'accent_red'
              }
            }}
          />
          <DrawerHeader borderBottomWidth="5px" borderBottomColor={'accent_blue'}>
            Menu
          </DrawerHeader>
          <DrawerBody>
            <Stack spacing={5} color={'accent_blue'}>
              <Link href={'/dashboard'}>
                <MenuOption mt={4} className={router.pathname === '/dashboard' ? 'isActive' : ''}>
                  <IconHome size={'30px'}></IconHome>
                  <h1>Dashboard</h1>
                </MenuOption>
              </Link>

              <Link href={'/dashboard/moderation'}>
                <MenuOption
                  className={router.pathname === '/dashboard/moderation' ? 'isActive' : ''}>
                  <IconExclamationCircle size={'30px'}></IconExclamationCircle>
                  <h1>Moderation</h1>
                </MenuOption>
              </Link>

              <Link href={'/dashboard/notification-control'}>
                <MenuOption
                  className={
                    router.pathname === '/dashboard/notification-control' ? 'isActive' : ''
                  }>
                  <IconBellMinus size={'30px'}></IconBellMinus>
                  <h1>Notification Control</h1>
                </MenuOption>
              </Link>

              <Link href={'/dashboard/appeals'}>
                <MenuOption className={router.pathname === '/dashboard/appeals' ? 'isActive' : ''}>
                  <IconReport size={'30px'}></IconReport>
                  <h1>Appeals</h1>
                </MenuOption>
              </Link>

              <Link href={'/dashboard/reported-posts'}>
                <MenuOption
                  className={router.pathname === '/dashboard/reported-posts' ? 'isActive' : ''}>
                  <IconMessageReport size={'30px'}></IconMessageReport>
                  <h1>Reported Posts</h1>
                </MenuOption>
              </Link>

              <Link href={'/dashboard/post-analysis'}>
                <MenuOption
                  className={router.pathname === '/dashboard/post-analysis' ? 'isActive' : ''}>
                  <IconChartAreaLine size={'30px'}></IconChartAreaLine>
                  <h1>Post Analysis</h1>
                </MenuOption>
              </Link>

              <Link href={'/dashboard/events'}>
                <MenuOption className={router.pathname === '/dashboard/events' ? 'isActive' : ''}>
                  <IconCalendarEvent size={'30px'}></IconCalendarEvent>
                  <h1>Events</h1>
                </MenuOption>
              </Link>
            </Stack>
          </DrawerBody>

          <DrawerFooter borderTopWidth="5px" borderTopColor={'accent_blue'}>
            <Flex gap={'20px'} alignItems="center">
              <Link href={'/dashboard/settings'}>
                <Box
                  sx={
                    router.pathname === '/dashboard/settings'
                      ? { bgColor: 'accent_yellow', border: '5px solid', rounded: '10px' }
                      : {}
                  }>
                  <IconSettings size={40}></IconSettings>
                </Box>
              </Link>
              <IconLogout size={40}></IconLogout>
            </Flex>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
