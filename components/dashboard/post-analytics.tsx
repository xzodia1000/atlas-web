import { Flex, Spacer, Text, useToast } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useState } from 'react';
import client from '../../lib/axios-service';
import Capitalize from '../../lib/capitalize-letter';
import { HandleError } from '../../lib/system-feedback';
import ContentTable from '../content-table';
import TableButtons from '../table-buttons';

const GetPost = dynamic(() => import('../overlays/get-post').then((mod) => mod.default));
const GetUser = dynamic(() => import('../overlays/get-user').then((mod) => mod.default));

const TableHeaders = [
  { title: 'Post ID', link: true },
  { title: 'Posted By', link: true },
  { title: 'Visiblity' },
  { title: 'Location' },
  { title: 'Likes Count' },
  { title: 'Comments Count' },
  { title: 'Posted At' }
];

const PostAnalytics = () => {
  const toast = useToast();
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [nextPage, setNextPage] = useState(true);
  const [previousPage, setPreviousPage] = useState(true);

  const [postModal, setPostModal] = useState('');
  const [userModal, setUserModal] = useState('');

  const [TableContent, setTableContent] = useState([]);
  const TableCaption = {
    title: 'Page',
    data: page
  };

  const { isLoading, isSuccess, refetch, isRefetching } = useQuery({
    queryKey: ['post-analytics', page],
    queryFn: async () => {
      return await client.get(`/feed?page=${page}&take=13`).then((res) => res.data);
    },
    onSuccess: async (data: any) => {
      setPage(data.meta.page);
      setNextPage(!data.meta.hasNextPage);
      setPreviousPage(!data.meta.hasPreviousPage);

      const tmpTableContent: any = [];
      for (let i = 0; i < data.data.length; i++) {
        tmpTableContent[i] = {
          report: [
            {
              data: data.data[i].id,
              link: true,
              function: () => setPostModal(data.data[i].id)
            },
            {
              data: data.data[i].postedBy.username,
              link: true,
              function: () => setUserModal(data.data[i].postedBy.id)
            },
            { data: Capitalize(data.data[i].visibility) },
            { data: data.data[i].location },
            { data: data.data[i].likesCount },
            { data: data.data[i].comments.length },
            { data: data.data[i].createdAt.substring(0, 10) }
          ],
          actions: []
        };
      }

      setTableContent(tmpTableContent);
    },
    onError: (error: any) => {
      HandleError({ error, toast, router });
    }
  });

  return (
    <>
      <Flex h="100%" direction="column">
        <Flex mb="10px" alignItems="center" gap={3}>
          <Spacer />
          <TableButtons
            next={{ value: nextPage, function: () => setPage(page + 1) }}
            previous={{ value: previousPage, function: () => setPage(page - 1) }}
            refetch={() => refetch()}
          />
        </Flex>
        <ContentTable
          headers={TableHeaders}
          content={TableContent}
          caption={TableCaption}
          success={isSuccess}
          loading={isLoading || isRefetching}
        />
        <Text color="accent_red" mt="10px" textAlign="center">
          Page {page}
        </Text>
      </Flex>
      {userModal !== '' && <GetUser id={userModal} setModal={setUserModal} />}
      {postModal !== '' && <GetPost id={postModal} setModal={setPostModal} />}
    </>
  );
};

export default PostAnalytics;
