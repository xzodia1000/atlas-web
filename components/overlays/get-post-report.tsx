import {
  Modal,
  ModalOverlay,
  ModalContent,
  Center,
  ModalHeader,
  ModalCloseButton,
  Spinner,
  ModalBody,
  Flex,
  ModalFooter,
  Text
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import client from '../../lib/axios-service';
import Capitalize from '../../lib/capitalize-letter';
const ServerError = dynamic(() => import('../server-error').then((mod) => mod.default));

const GetPostReport = ({ id, setModal }: any) => {
  const { data, isLoading, isSuccess, isError } = useQuery({
    queryKey: ['post-report'],
    queryFn: async () => client.get(`/report/post-reports/${id}`).then((res) => res.data.data[0])
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
            <ModalBody>
              <Flex direction="column" gap={5}>
                <Flex direction="column">
                  <Text fontSize="xs" color="accent_yellow">
                    Report ID
                  </Text>
                  <Text fontSize="lg">{data.id}</Text>
                </Flex>
                <Flex direction="column">
                  <Text fontSize="xs" color="accent_yellow">
                    Report by
                  </Text>
                  <Text fontSize="lg">
                    {data.reportedBy.username} ({data.reportedBy.id})
                  </Text>
                </Flex>
                <Flex direction="column">
                  <Text fontSize="xs" color="accent_yellow">
                    Reason
                  </Text>
                  <Text fontSize="lg">{Capitalize(data.reason)}</Text>
                </Flex>
                <Flex direction="column">
                  <Text fontSize="xs" color="accent_yellow">
                    Status
                  </Text>
                  <Text fontSize="lg">{Capitalize(data.status)}</Text>
                </Flex>
                <Flex gap={5}>
                  <Flex direction="column">
                    <Text fontSize="xs" color="accent_yellow">
                      Reported at
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
                <Flex direction="column">
                  <Text fontSize="xs" color="accent_yellow">
                    Reported Post ID
                  </Text>
                  <Text fontSize="lg">{data.reportedPost.id}</Text>
                </Flex>
                <Flex direction="column">
                  <Text fontSize="xs" color="accent_yellow">
                    Posted by
                  </Text>
                  <Text fontSize="lg">
                    {data.reportedPost.postedBy.username} ({data.reportedPost.postedBy.id})
                  </Text>
                </Flex>
                <Flex gap={5}>
                  <Flex direction="column">
                    <Text fontSize="xs" color="accent_yellow">
                      Post Created
                    </Text>
                    <Text fontSize="lg">{data.reportedPost.createdAt.substring(0, 10)}</Text>
                  </Flex>
                  <Flex direction="column">
                    <Text fontSize="xs" color="accent_yellow">
                      Last Updated
                    </Text>
                    <Text fontSize="lg">{data.reportedPost.updatedAt.substring(0, 10)}</Text>
                  </Flex>
                </Flex>
              </Flex>
            </ModalBody>
          )}
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
      {isError && <ServerError />}
    </>
  );
};

export default GetPostReport;
