import {
  Text,
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
import { IconBan } from '@tabler/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import client from '../../lib/axios-service';
import Capitalize from '../../lib/capitalize-letter';
import { ModalButton } from '../../styles/components-styles';

const ServerError = dynamic(() => import('../server-error').then((mod) => mod.default));

const GetUser = ({ id, setModal }: any) => {
  const toast = useToast();

  const { data, isLoading, isSuccess, isError, refetch } = useQuery({
    queryKey: ['user'],
    queryFn: async () => client.get(`/user/profile/${id}`).then((res) => res.data)
  });

  const { isLoading: isBanLoading, mutate: banUser } = useMutation({
    mutationFn: async () => {
      return await client.post(`/report/ban-user/${id}`);
    },
    onSuccess: async () => {
      refetch();
      return toast({
        title: 'Success!',
        description: 'User banned successfully.',
        status: 'success',
        duration: 9000,
        isClosable: true,
        position: 'bottom-right'
      });
    },
    onError: async (error: any) => {
      return toast({
        title: 'Error',
        description: error.response.data.message,
        status: 'error',
        duration: 9000,
        isClosable: true,
        position: 'bottom-right'
      });
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
                <Flex direction="column">
                  <Text fontSize="xs" color="accent_yellow">
                    User ID
                  </Text>
                  <Text fontSize="lg">{id}</Text>
                </Flex>
                <Flex direction="column">
                  <Text fontSize="xs" color="accent_yellow">
                    Role
                  </Text>
                  <Text fontSize="lg">{Capitalize(data.role)}</Text>
                </Flex>
                <Flex gap={5}>
                  <Flex direction="column">
                    <Text fontSize="xs" color="accent_yellow">
                      First Name
                    </Text>
                    <Text fontSize="lg">{data.firstName}</Text>
                  </Flex>
                  <Flex direction="column">
                    <Text fontSize="xs" color="accent_yellow">
                      Last Name
                    </Text>
                    <Text fontSize="lg">{data.lastName}</Text>
                  </Flex>
                </Flex>
                <Flex direction="column">
                  <Text fontSize="xs" color="accent_yellow">
                    Email
                  </Text>
                  <Text fontSize="lg">{data.email}</Text>
                </Flex>
                <Flex direction="column">
                  <Text fontSize="xs" color="accent_yellow">
                    Gender
                  </Text>
                  <Text fontSize="lg">
                    {data.gender === 'undefined' ? 'Prefer not to say' : Capitalize(data.gender)}
                  </Text>
                </Flex>
                <Flex direction="column">
                  <Text fontSize="xs" color="accent_yellow">
                    Date of Birth
                  </Text>
                  <Text fontSize="lg">{data.dateOfBirth.substring(0, 10)}</Text>
                </Flex>
                <Flex direction="column">
                  <Text fontSize="xs" color="accent_yellow">
                    Phone Number
                  </Text>
                  <Text fontSize="lg">{data.phoneNumber}</Text>
                </Flex>
                <Flex direction="column">
                  <Text fontSize="xs" color="accent_yellow">
                    Address
                  </Text>
                  <Text fontSize="lg">{data.address}</Text>
                </Flex>
                <Flex gap={5}>
                  <Flex direction="column">
                    <Text fontSize="xs" color="accent_yellow">
                      Account Created
                    </Text>
                    <Text fontSize="lg">{data.createdAt.substring(0, 10)}</Text>
                  </Flex>
                  <Flex direction="column">
                    <Text fontSize="xs" color="accent_yellow">
                      Last Updated
                    </Text>
                    <Text fontSize="lg">{data.updatedAt.substring(0, 10)}</Text>
                  </Flex>
                </Flex>
              </Flex>
            </ModalBody>
          )}
          <ModalFooter>
            <ModalButton
              isDisabled={isLoading || isBanLoading}
              leftIcon={<IconBan />}
              onClick={banUser}>
              Ban User
            </ModalButton>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {isError && <ServerError />}
    </>
  );
};

export default GetUser;
