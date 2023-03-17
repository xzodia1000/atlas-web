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

const GetEventReport = ({ id, setModal }: any) => {
  const toast = useToast();
  const router = useRouter();
  const [report, setReport] = useState(listType);

  const { isLoading, isSuccess } = useQuery({
    queryKey: ['event'],
    queryFn: async () => {
      return await client.get(`/event/${id}`).then((res) => res.data);
    },
    onSuccess(data: any) {
      const tmpReport = {
        data: [
          { title: 'Event ID', des: data.id },
          { title: 'Event Name', des: data.name },
          { title: 'Event Host', des: `${data.creator.username}` },
          { title: 'Description', des: Capitalize(data.description) },
          { title: 'Event Active Date', des: data.date.substring(0, 10) },
          { title: 'Number of Participants', des: data.numberOfParticipants },
          { title: 'Visibility', des: Capitalize(data.visibility) },
          {
            title: ['Latitude', 'Longitude'],
            des: [data.latitude, data.longitude]
          },
          {
            title: ['Event Created', 'Last updated'],
            des: [data.createdAt.substring(0, 10), data.updatedAt.substring(0, 10)]
          }
        ]
      };

      setReport(tmpReport);
    },
    onError: async (error: any) => {
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
                {report.data?.map((item: IDetails, index: number) => (
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

export default GetEventReport;
