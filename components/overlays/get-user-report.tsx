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

const GetUserReport = ({ id, setModal }: any) => {
  const { data, isSuccess, isLoading, isError } = useQuery({
    queryKey: ['user-report'],
    queryFn: async () => client.get(`/report/user-reports/${id}`).then((res) => res.data.data[0])
  });

  console.log(data);

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
                    Report User
                  </Text>
                  <Text fontSize="lg">
                    {data.reportedUser.username} ({data.reportedUser.id})
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
                      Reported At
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
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
      {isError && <ServerError />}
    </>
  );
};

export default GetUserReport;
