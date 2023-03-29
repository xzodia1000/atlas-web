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

// Dynamic imports
const GetPost = dynamic(() => import('../overlays/get-post').then((mod) => mod.default));
const GetPostReport = dynamic(() =>
  import('../overlays/get-post-report').then((mod) => mod.default)
);
const GetUser = dynamic(() => import('../overlays/get-user').then((mod) => mod.default));

// Table headers
const TableHeaders = [
  { title: 'Reported ID', link: true },
  { title: 'Reported By', link: true },
  { title: 'Post ID', link: true },
  { title: 'Post by', link: true },
  { title: 'Reason' },
  { title: 'Status' },
  { title: 'Actions' }
];

// This is the reported posts page
const ReportedPosts = () => {
  const toast = useToast();
  const router = useRouter();

  const [sort, setSort] = useState('DESC');
  const [page, setPage] = useState(1);
  const [nextPage, setNextPage] = useState(true);
  const [previousPage, setPreviousPage] = useState(true);

  const [reportModal, setReportModal] = useState('');
  const [postModal, setPostModal] = useState('');
  const [userModal, setUserModal] = useState('');

  const [TableContent, setTableContent] = useState([]);

  // Sort menu options
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

  // Fetch reported posts
  const { isLoading, isSuccess, refetch, isRefetching } = useQuery({
    queryKey: ['reported-posts', page, sort],
    queryFn: async () => {
      // Get reported posts from server
      return await client
        .get(`/report/reported-posts?order=${sort}&page=${page}&take=13`)
        .then((res) => res.data);
    },
    onSuccess: async (data: any) => {
      // Set table content on success
      setPage(data.meta.page); // Set page number
      if (data.meta.itemCount === 10) {
        setNextPage(false); // If there are 10 items, there is a next page
      }
      setPreviousPage(!data.meta.hasPreviousPage); // If there is a previous page, set previous page to false

      const tmpTableContent: any = [];
      // Loop through reported posts
      for (let i = 0; i < data.data.length; i++) {
        // Format data for table content and add to tmpTableContent
        if (data.data[i].reportedPost) {
          tmpTableContent[i] = {
            report: [
              {
                data: data.data[i].id,
                link: true,
                function: () => setReportModal(data.data[i].reportedPost.id)
              },
              {
                data: data.data[i].reportedBy.username,
                link: true,
                function: () => setUserModal(data.data[i].reportedBy.id)
              },
              {
                data: data.data[i].reportedPost.id,
                link: true,
                function: () => setPostModal(data.data[i].reportedPost.id)
              },
              {
                data: data.data[i].reportedPost.postedBy.username,
                link: true,
                function: () => setUserModal(data.data[i].reportedPost.postedBy.id)
              },
              { data: Capitalize(data.data[i].reason) },
              { data: Capitalize(data.data[i].status) }
            ],
            actions: [
              {
                title: 'Ban',
                function: () =>
                  banPost({ postid: data.data[i].reportedPost.id, reportid: data.data[i].id }),
                isDisabled: data.data[i].status !== 'pending review'
              }
            ]
          };
        }
      }

      // Set table content
      setTableContent(tmpTableContent);
    },
    onError: async (error: any) => {
      HandleError({ error, toast, router });
    }
  });

  // Ban post mutation function
  const { mutate: banPost } = useMutation({
    mutationFn: async ({ postid, reportid }: any) => {
      // Send ban post request to server
      return await client.post(`/report/ban-post/${postid}/${reportid}`);
    },
    onSuccess: async () => {
      // Refetch data on success
      refetch();
      HandleSuccess({ message: 'Post has been taken down.', toast });
    },
    onError: async (error: any) => {
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
      {reportModal !== '' && <GetPostReport id={reportModal} setModal={setReportModal} />}
      {userModal !== '' && <GetUser id={userModal} setModal={setUserModal} />}
      {postModal !== '' && <GetPost id={postModal} setModal={setPostModal} />}
    </>
  );
};

export default ReportedPosts;
