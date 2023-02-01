import { Flex, Spacer, useToast, Text } from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useState } from 'react';
import client from '../../lib/axios-service';
import Capitalize from '../../lib/capitalize-letter';
import { HandleError, HandleSuccess } from '../../lib/system-feedback';
import ContentTable from '../content-table';
import DropdownMenu from '../dropdown-menu';
import TableButtons from '../table-buttons';

const GetAppeal = dynamic(() => import('../overlays/get-appeal').then((mod) => mod.default));
const GetPost = dynamic(() => import('../overlays/get-post').then((mod) => mod.default));
const GetUser = dynamic(() => import('../overlays/get-user').then((mod) => mod.default));

const TableHeaders = [
  { title: 'Appeal ID', link: true },
  { title: 'Appealed By', link: true },
  { title: 'Appealed Post', link: true },
  { title: 'Reason' },
  { title: 'Text' },
  { title: 'Status' },
  { title: 'Actions' }
];

const Appeals = () => {
  const toast = useToast();
  const router = useRouter();

  const [sort, setSort] = useState('DESC');
  const [page, setPage] = useState(1);
  const [nextPage, setNextPage] = useState(true);
  const [previousPage, setPreviousPage] = useState(true);

  const [appealModal, setAppealModal] = useState('');
  const [postModal, setPostModal] = useState('');
  const [userModal, setUserModal] = useState('');

  const [TableContent, setTableContent] = useState([]);

  const SortMenuOptions = [
    {
      title: 'Newest',
      value: 'DESC',
      function: () => {
        setSort('DESC');
        setPage(1);
      }
    },
    {
      title: 'Oldest',
      value: 'ASC',
      function: () => {
        setSort('ASC');
        setPage(1);
      }
    }
  ];

  const { isLoading, isSuccess, refetch, isRefetching } = useQuery({
    queryKey: ['post-appeals', page, sort],
    queryFn: async () => {
      return await client
        .get(`/appeals/post-appeals?order=${sort}&page=${page}&take=10`)
        .then((res) => res.data);
    },
    onSuccess: (data) => {
      setPage(data.meta.page);
      if (data.meta.itemCount === 10) {
        setNextPage(false);
      }
      setPreviousPage(!data.meta.previousPage);

      const tmpTableContent: any = [];
      for (let i = 0; i < data.data.length; i++) {
        tmpTableContent[i] = {
          report: [
            {
              data: data.data[i].id,
              link: true,
              function: () => setAppealModal(data.data[i])
            },
            {
              data: data.data[i].appealedBy.username,
              link: true,
              function: () => setUserModal(data.data[i].appealedBy.id)
            },
            {
              data: data.data[i].appealedPost.id,
              link: true,
              function: () => setPostModal(data.data[i].appealedPost.id)
            },
            { data: Capitalize(data.data[i].reportReason) },
            { data: data.data[i].text },
            { data: Capitalize(data.data[i].status) }
          ],
          actions: [
            {
              title: 'Accept',
              function: () => appeal({ action: 'accept', postid: data.data[i].appealedPost.id }),
              isDisabled: data.data[i].status !== 'pending review'
            },
            {
              title: 'Reject',
              function: () => appeal({ action: 'reject', postid: data.data[i].appealedPost.id }),
              isDisabled: data.data[i].status !== 'pending review'
            }
          ]
        };
      }

      setTableContent(tmpTableContent);
    },
    onError: (error: any) => {
      HandleError({ error, toast, router });
    }
  });

  const { mutate: appeal } = useMutation({
    mutationFn: async ({ action, postid }: any) => {
      return await client.patch(`/appeals/${action}-appeal/${postid}`);
    },
    onSuccess: () => {
      refetch();
      HandleSuccess({ toast, message: 'Appeal has been handled' });
    },
    onError: (error: any) => {
      HandleError({ error, toast, router });
    }
  });

  return (
    <>
      <Flex h="100%" direction="column">
        <Flex mb="10px" alignItems="center" gap={3}>
          <DropdownMenu options={SortMenuOptions} title="Sort" currentOption={sort} />
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
          success={isSuccess}
          loading={isLoading || isRefetching}
        />
        <Text color="accent_red" mt="10px" textAlign="center">
          Page {page}
        </Text>
      </Flex>
      {appealModal !== '' && <GetAppeal id={appealModal} setModal={setAppealModal} />}
      {userModal !== '' && <GetUser id={userModal} setModal={setUserModal} />}
      {postModal !== '' && <GetPost id={postModal} setModal={setPostModal} />}
    </>
  );
};

export default Appeals;
