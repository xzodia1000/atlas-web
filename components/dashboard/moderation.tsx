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
const GetUser = dynamic(() => import('../overlays/get-user').then((mod) => mod.default));
const GetUserReport = dynamic(() =>
  import('../overlays/get-user-report').then((mod) => mod.default)
);

// Table headers
const TableHeaders = [
  {
    title: 'Report ID',
    link: true
  },
  {
    title: 'Reported By',
    link: true
  },
  {
    title: 'Reported User',
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

// This is the reported users page
const Moderation = () => {
  const toast = useToast();
  const router = useRouter();

  const [sort, setSort] = useState('DESC');
  const [page, setPage] = useState(1);
  const [nextPage, setNextPage] = useState(true);
  const [previousPage, setPreviousPage] = useState(true);

  const [reportModal, setReportModal] = useState('');
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

  // Get reported users
  const { isLoading, isSuccess, refetch, isRefetching } = useQuery({
    queryKey: ['reported-users', page, sort],
    queryFn: async () => {
      // Get reported users from the server
      return await client
        .get(`/report/reported-users?order=${sort}&page=${page}&take=10`)
        .then((res) => res.data);
    },
    onSuccess: async (data) => {
      // Set pagination
      setPage(data.meta.page);
      setNextPage(!data.meta.hasNextPage);
      setPreviousPage(!data.meta.hasPreviousPage);

      const tmpTableContent: any = [];
      for (let i = 0; i < data.data.length; i++) {
        // Format the data for the table content
        tmpTableContent[i] = {
          report: [
            {
              data: data.data[i].id,
              link: true,
              function: () => setReportModal(data.data[i].reportedUser.id)
            },
            {
              data: data.data[i].reportedBy.username,
              link: true,
              function: () => setUserModal(data.data[i].reportedBy.id)
            },
            {
              data: data.data[i].reportedUser.username,
              link: true,
              function: () => setUserModal(data.data[i].reportedUser.id)
            },
            { data: Capitalize(data.data[i].reason) },
            { data: Capitalize(data.data[i].status) }
          ],
          actions: [
            {
              title: 'Ban',
              function: () =>
                banUser({ userid: data.data[i].reportedUser.id, reportid: data.data[i].id }),
              isDisabled: data.data[i].status !== 'pending review'
            }
          ]
        };
      }

      // Set the table content
      setTableContent(tmpTableContent);
    },
    onError: async (error: any) => {
      HandleError({ error, toast, router });
    }
  });

  // Function to ban a user
  const { mutate: banUser } = useMutation({
    mutationFn: async ({ userid, reportid }: any) => {
      // Ban the user
      await client.post(`/report/ban-user/${userid}/${reportid}`);
    },
    onSuccess: async () => {
      // Refetch the data
      refetch();
      HandleSuccess({ message: 'User has been banned.', toast });
    },
    onError: async (error: any) => {
      HandleError({ error, toast, router });
    }
  });

  return (
    <>
      <Flex h="100%" direction="column">
        <Flex mb="10px" alignItems="center">
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
          loading={isLoading || isRefetching}
          success={isSuccess}
        />
        <Text color="accent_red" mt="10px" textAlign="center">
          Page {page}
        </Text>
      </Flex>
      {reportModal !== '' && <GetUserReport id={reportModal} setModal={setReportModal} />}
      {userModal !== '' && <GetUser id={userModal} setModal={setUserModal} />}
    </>
  );
};

export default Moderation;
