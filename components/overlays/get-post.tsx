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
  useToast,
  Box
} from '@chakra-ui/react';
import { IconChevronRight, IconHammer } from '@tabler/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useState } from 'react';
import IDetails from '../../interfaces/IDetails';
import client from '../../lib/axios-service';
import Capitalize from '../../lib/capitalize-letter';
import { HandleError, HandleSuccess } from '../../lib/system-feedback';
import { ModalButton } from '../../styles/components-styles';
import DetailDisplay from '../detail-display';

const listType: { data: IDetails[] | null } | null = { data: null };

const GetPost = ({ id, setModal }: any) => {
  const toast = useToast();
  const router = useRouter();
  const [post, setPost] = useState(listType);
  const [analytics, setAnalytics] = useState<{ data: IDetails[] | null } | null>(null);

  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ['post'],
    queryFn: async () => {
      return await client.get(`/post/${id}`).then((res) => res.data);
    },
    onSuccess: async (data: any) => {
      const tmpPost = {
        data: [
          { title: 'Post ID', des: data.id },
          { title: 'Image ID', des: data.imageId !== '' ? data.imageId : 'No image' },
          { title: 'Caption', des: data.caption },
          { title: 'Posted by', des: `${data.postedBy.username} (${data.postedBy.id})` },
          { title: 'Type', des: data.type },
          { title: 'Tag', des: data.tag },
          { title: 'Visibility', des: Capitalize(data.visibility) },
          { title: 'Location', des: data.location },
          {
            title: ['Posted Created', 'Last Updated'],
            des: [data.createdAt.substring(0, 10), data.updatedAt.substring(0, 10)]
          }
        ]
      };

      setPost(tmpPost);
    },
    onError: async (error: any) => {
      HandleError({ error, toast, router });
    }
  });

  useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      return await client.get(`/analytics/admin/post/${id}`).then((res) => res.data);
    },
    onSuccess: async (data: any) => {
      const tmpPost = {
        data: [
          { title: 'Total Interactions', des: data.interactionCount },
          { title: 'Total Likes', des: data.likeCount },
          { title: 'Total Comments', des: data.commentCount },
          { title: 'Total Reports', des: data.reportCount },
          { title: 'Total Appeals', des: data.appealCount },
          { title: 'Banned Post', des: data.isTakenDown.toString() },
          { title: 'Part of Scrapbook', des: data.isPartOfScrapbook.toString() },
          { title: 'Posted On', des: data.createdAt.substring(0, 10) }
        ]
      };

      setAnalytics(tmpPost);
    },
    onError: async (error: any) => {
      HandleError({ error, toast, router });
    },
    enabled: analytics !== null
  });

  const { isLoading: isUnbanLoading, mutate: unbanPost } = useMutation({
    mutationFn: async () => {
      return await client.post(`/report/unban-post/${id}`).then((res) => res.data);
    },
    onSuccess: async () => {
      HandleSuccess({ message: 'Post has been unbanned', toast });
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
            <ModalHeader>{analytics !== null ? 'Analytics' : ''}</ModalHeader>
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
                {analytics === null && (
                  <>
                    <Center>
                      {data.imageUrl !== '' && (
                        <Box
                          bgColor="gray.700"
                          h="300px"
                          w="300px"
                          rounded="5px"
                          backgroundImage={data.imageUrl}
                          backgroundSize="cover"
                          backgroundPosition="center"
                        />
                      )}
                    </Center>
                    {post.data?.map((item: IDetails, index: number) => (
                      <DetailDisplay key={index} title={item.title} des={item.des} />
                    ))}
                  </>
                )}
                {analytics !== null &&
                  analytics.data?.map((item: IDetails, index: number) => (
                    <DetailDisplay key={index} title={item.title} des={item.des} />
                  ))}
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
            <ModalButton
              rightIcon={<IconChevronRight />}
              onClick={() => (analytics === null ? setAnalytics(listType) : setAnalytics(null))}>
              {analytics === null ? 'View Analytics' : 'View Post'}
            </ModalButton>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GetPost;
