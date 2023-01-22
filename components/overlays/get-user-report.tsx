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
  Text,
  useToast
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import client from '../../lib/axios-service';
import Capitalize from '../../lib/capitalize-letter';
import { HandleError } from '../../lib/system-feedback';
const ServerError = dynamic(() => import('./server-error').then((mod) => mod.default));

const GetUserReport = ({ id, setModal }: any) => {
  const toast = useToast();
  const [serverError, setServerError] = useState(false);

  const { data, isSuccess, isLoading } = useQuery({
    queryKey: ['user-report'],
    queryFn: async () => {
      return await client
        .get(`/report/user-reports/${id}`)
        .then((res) => res.data.data[0])
        .then((data) => data);
    },
    onError: async (error: any) => {
      try {
        HandleError({ error, toast });
      } catch (error) {
        setServerError(true);
      }
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
      {serverError && <ServerError />}
    </>
  );
};

export default GetUserReport;
