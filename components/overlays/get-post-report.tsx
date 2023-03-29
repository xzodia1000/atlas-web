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

// This is the post report modal
const GetPostReport = ({ id, setModal }: any) => {
  const toast = useToast();
  const router = useRouter();
  const [report, setReport] = useState(listType);

  // Function to get user report
  const { isLoading, isSuccess } = useQuery({
    queryKey: ['post-report'],
    queryFn: async () => {
      // Get user report data from server
      return await client.get(`/report/post-reports/${id}`).then((res) => res.data.data[0]);
    },
    onSuccess(data: any) {
      // Format the data into a format that can be displayed by the DetailDisplay component
      const tmpReport = {
        data: [
          { title: 'Report ID', des: data.id },
          { title: 'Report by', des: `${data.reportedBy.username} (${data.reportedBy.id})` },
          { title: 'Reason', des: Capitalize(data.reason) },
          { title: 'Status', des: Capitalize(data.status) },
          {
            title: ['Reported at', 'Last updated'],
            des: [data.createdAt.substring(0, 10), data.updatedAt.substring(0, 10)]
          },
          { title: 'Reported Post ID', des: data.reportedPost.id },
          {
            title: 'Posted by',
            des: `${data.reportedPost.postedBy.username} (${data.reportedPost.postedBy.id})`
          },
          {
            title: ['Post Created', 'Last updated'],
            des: [
              data.reportedPost.createdAt.substring(0, 10),
              data.reportedPost.updatedAt.substring(0, 10)
            ]
          }
        ]
      };

      // Set the report data
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

export default GetPostReport;
