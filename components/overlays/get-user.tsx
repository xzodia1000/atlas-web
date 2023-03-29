import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Avatar,
  Flex,
  Center,
  Spinner,
  useToast
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useState } from 'react';
import IDetails from '../../interfaces/IDetails';
import client from '../../lib/axios-service';
import Capitalize from '../../lib/capitalize-letter';
import { HandleError } from '../../lib/system-feedback';
import DetailDisplay from '../detail-display';

const listType: { data: IDetails[] | null } = { data: null };

// This is the modal that pops up when you click on a user in the user list
const GetUser = ({ id, setModal }: any) => {
  const toast = useToast();
  const router = useRouter();
  const [user, setUser] = useState(listType);

  // This is the query that gets the user data
  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      // Get user data from server
      return await client.get(`/user/profile/${id}`).then((res) => res.data);
    },
    onSuccess(data: any) {
      // Format the data into a format that can be displayed by the DetailDisplay component
      const tmpUser = {
        data: [
          { title: 'User ID', des: data.id },
          { title: 'Role', des: Capitalize(data.role) },
          { title: ['First name', 'Last name'], des: [data.firstName, data.lastName] },
          { title: 'Email', des: data.email },
          {
            title: 'Gender',
            des: data.gender === 'undefined' ? 'Prefer not to say' : Capitalize(data.gender)
          },
          { title: 'Date of Birth', des: data.dateOfBirth.substring(0, 10) },
          { title: 'Phone Number', des: data.phoneNumber },
          { title: 'Address', des: data.address },
          {
            title: ['Account Created', 'Last updated'],
            des: [data.createdAt.substring(0, 10), data.updatedAt.substring(0, 10)]
          }
        ]
      };

      // Set the user data
      setUser(tmpUser);
    },
    onError: async (error: any) => {
      // Handle error
      HandleError({ error, toast, router });
    }
  });

  return (
    <>
      <Modal
        onClose={() => {
          setModal('');
        }}
        isOpen={id !== ''}
        size="xl"
        scrollBehavior="inside"
        isCentered>
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px) hue-rotate(90deg)" />
        <ModalContent bgColor="gray.800">
          <Center>
            <ModalHeader>
              {isSuccess && data.username} {isLoading && ' '}
            </ModalHeader>
          </Center>
          <ModalCloseButton
            bgColor="accent_red"
            color="white"
            _hover={{ bgColor: 'accent_yellow', color: 'accent_blue' }}
          />
          {isLoading && (
            <Center>
              <Spinner size={'xl'} thickness={'5px'} color={'accent_red'} />
            </Center>
          )}
          {isSuccess && (
            <ModalBody>
              <Flex direction="column" gap={5}>
                <Center>
                  <Avatar size={'xl'} src={data.profilePictureUrl} />
                </Center>
                {user.data?.map((item: IDetails, index: number) => (
                  <DetailDisplay key={index} title={item.title} des={item.des} />
                ))}
              </Flex>
            </ModalBody>
          )}
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GetUser;
