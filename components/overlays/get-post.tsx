import {
  Modal,
  ModalOverlay,
  ModalContent,
  Center,
  ModalHeader,
  ModalCloseButton,
  Spinner,
  ModalBody,
  Image,
  Flex,
  Text,
  ModalFooter,
  useToast
} from '@chakra-ui/react';
import { IconChevronRight, IconHammer } from '@tabler/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import client from '../../lib/axios-service';
import Capitalize from '../../lib/capitalize-letter';
import { ModalButton } from '../../styles/components-styles';

const ServerError = dynamic(() => import('../server-error').then((mod) => mod.default));

const GetPost = ({ id, setModal }: any) => {
  const toast = useToast();

  const { data, isLoading, isSuccess, isError } = useQuery({
    queryKey: ['post'],
    queryFn: async () => client.get(`/post/${id}`).then((res) => res.data)
  });

  const { isLoading: isUnbanLoading, mutate: unbanPost } = useMutation({
    mutationFn: async () => {
      return await client.post(`/report/unban-post/${id}`);
    },
    onSuccess: async () => {
      return toast({
        title: 'Success!',
        description: 'Post unbanned successfully.',
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
            <ModalHeader> </ModalHeader>
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
            <ModalBody mt="5px">
              <Flex direction="column" gap={5}>
                <Center>
                  <Image src={data.imageUrl} alt="" rounded="5px" />
                </Center>
                <Flex direction="column">
                  <Text fontSize="xs" color="accent_yellow">
                    Post ID
                  </Text>
                  <Text fontSize="lg">{id}</Text>
                </Flex>
                {data.imageId !== '' && (
                  <Flex direction="column">
                    <Text fontSize="xs" color="accent_yellow">
                      Image ID
                    </Text>
                    <Text fontSize="lg">{data.imageId}</Text>
                  </Flex>
                )}
                <Flex direction="column">
                  <Text fontSize="xs" color="accent_yellow">
                    Caption
                  </Text>
                  <Text fontSize="lg">{data.caption}</Text>
                </Flex>
                <Flex direction="column">
                  <Text fontSize="xs" color="accent_yellow">
                    Posted by
                  </Text>
                  <Text fontSize="lg">{data.postedBy.username}</Text>
                </Flex>
                <Flex direction="column">
                  <Text fontSize="xs" color="accent_yellow">
                    Type
                  </Text>
                  <Text fontSize="lg">{data.type}</Text>
                </Flex>
                <Flex direction="column">
                  <Text fontSize="xs" color="accent_yellow">
                    Tag
                  </Text>
                  <Text fontSize="lg">{data.tag}</Text>
                </Flex>
                <Flex direction="column">
                  <Text fontSize="xs" color="accent_yellow">
                    Visibility
                  </Text>
                  <Text fontSize="lg">{Capitalize(data.visibility)}</Text>
                </Flex>
                <Flex direction="column">
                  <Text fontSize="xs" color="accent_yellow">
                    Number of Comments
                  </Text>
                  <Text fontSize="lg">{data.comments.length}</Text>
                </Flex>
                <Flex direction="column">
                  <Text fontSize="xs" color="accent_yellow">
                    Location
                  </Text>
                  <Text fontSize="lg">{data.location}</Text>
                </Flex>
                <Flex gap={5}>
                  <Flex direction="column">
                    <Text fontSize="xs" color="accent_yellow">
                      Post Created
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
          <ModalFooter gap={5}>
            <ModalButton
              isDisabled={isLoading || isUnbanLoading || !data.isTakenDown}
              leftIcon={<IconHammer />}
              onClick={unbanPost}>
              Unban Post
            </ModalButton>
            <ModalButton rightIcon={<IconChevronRight />}>View More Details</ModalButton>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {isError && <ServerError />}
    </>
  );
};

export default GetPost;
