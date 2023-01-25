import { Flex, Spacer, useToast } from '@chakra-ui/react';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import client from '../../lib/axios-service';
import Capitalize from '../../lib/capitalize-letter';
import { HandleError, HandleSuccess } from '../../lib/system-feedback';
import { SmallButton } from '../../styles/components-styles';
import ContentTable from '../content-table';
import DropdownMenu from '../dropdown-menu';
import TableButtons from '../table-buttons';

const GetPost = dynamic(() => import('../overlays/get-post').then((mod) => mod.default));
const GetPostReport = dynamic(() =>
  import('../overlays/get-post-report').then((mod) => mod.default)
);
const GetUser = dynamic(() => import('../overlays/get-user').then((mod) => mod.default));
const ServerError = dynamic(() => import('../overlays/server-error').then((mod) => mod.default));

const TableHeaders = [
  {
    title: 'Reported ID',
    link: true
  },
  {
    title: 'Reported By',
    link: true
  },
  {
    title: 'Post ID',
    link: true
  },
  {
    title: 'Post by',
    link: true
  },
  {
    title: 'Reason'
  },
  {
    title: 'Status'
  },
  {
    title: 'Actions'
  }
];

const ReportedPosts = () => {
  const toast = useToast();
  const [serverError, setServerError] = useState(false);

  const [sort, setSort] = useState('DESC');
  const [page, setPage] = useState(1);
  const [nextPage, setNextPage] = useState(true);
  const [previousPage, setPreviousPage] = useState(true);

  const [reportModal, setReportModal] = useState('');
  const [postModal, setPostModal] = useState('');
  const [userModal, setUserModal] = useState('');

  const [TableContent, setTableContent] = useState([]);
  const TableCaption = {
    title: 'Page',
    data: page
  };

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

  const { isLoading, isSuccess, refetch } = useQuery({
    queryKey: ['reported-posts', page, sort],
    queryFn: async () => {
      return await client
        .get(`/report/reported-posts?order=${sort}&page=${page}&take=10`)
        .then((res) => res.data);
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
          action: {
            title: 'Ban',
            function: () =>
              banPost({ postid: data.data[i].reportedPost.id, reportid: data.data[i].id })
          }
        };
      }

      setTableContent(tmpTableContent);
    },
    onError: async (error: any) => {
      try {
        HandleError({ error, toast });
      } catch (error) {
        setServerError(true);
      }
    }
  });

  const { mutate: banPost } = useMutation({
    mutationFn: async ({ postid, reportid }: any) => {
      return await client.post(`/report/ban-post/${postid}/${reportid}`);
    },
    onSuccess: async () => {
      refetch();
      HandleSuccess({ message: 'Post has been taken down.', toast });
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
          caption={TableCaption}
          success={isSuccess}
          loading={isLoading}
        />
      </Flex>
      {reportModal !== '' && <GetPostReport id={reportModal} setModal={setReportModal} />}
      {userModal !== '' && <GetUser id={userModal} setModal={setUserModal} />}
      {postModal !== '' && <GetPost id={postModal} setModal={setPostModal} />}
      {serverError && <ServerError />}
    </>
  );
};

export default ReportedPosts;
