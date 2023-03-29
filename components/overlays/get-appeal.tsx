import {
  Center,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay
} from '@chakra-ui/react';
import IDetails from '../../interfaces/IDetails';
import Capitalize from '../../lib/capitalize-letter';
import DetailDisplay from '../detail-display';

// This is the appeal modal
const GetAppeal = ({ id, setModal }: any) => {
  // Format the data into a format that can be displayed by the DetailDisplay component
  const appeal: { data: IDetails[] | null } = {
    data: [
      { title: 'Appeal ID', des: id.id },
      { title: 'Appeal by', des: id.appealedBy.username },
      { title: 'Appeal Post ID', des: id.appealedPost.id },
      { title: 'Text', des: id.text },
      { title: 'Report Reason', des: Capitalize(id.reportReason) },
      { title: 'Status', des: Capitalize(id.status) },
      {
        title: ['Appealed at', 'Last updated'],
        des: [id.createdAt.substring(0, 10), id.updatedAt.substring(0, 10)]
      }
    ]
  };

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
          <ModalCloseButton />
          <ModalBody>
            <Flex direction="column" gap={5}>
              {appeal.data?.map((item: IDetails, index: number) => (
                <DetailDisplay key={index} title={item.title} des={item.des} />
              ))}
            </Flex>
          </ModalBody>
          <ModalFooter />
        </ModalContent>
      </Modal>
    </>
  );
};

export default GetAppeal;
