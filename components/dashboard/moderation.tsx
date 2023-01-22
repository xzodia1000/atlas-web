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

const GetUser = dynamic(() => import('../overlays/get-user').then((mod) => mod.default));
const GetUserReport = dynamic(() =>
  import('../overlays/get-user-report').then((mod) => mod.default)
);
const ServerError = dynamic(() => import('../overlays/server-error').then((mod) => mod.default));

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

const Moderation = () => {
  const toast = useToast();
  const [serverError, setServerError] = useState(false);

  const [sort, setSort] = useState('DESC');
  const [page, setPage] = useState(1);
  const [nextPage, setNextPage] = useState(true);
  const [previousPage, setPreviousPage] = useState(true);

  const [reportModal, setReportModal] = useState('');
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
    queryKey: ['reported-users', page, sort],
    queryFn: async () => {
      return await client
        .get(`/report/reported-users?order=${sort}&page=${page}&take=10`)
        .then((res) => res.data);
    },
    onSuccess: async (data) => {
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
          action: {
            title: 'Ban',
            function: () =>
              banUser({ userid: data.data[i].reportedUser.id, reportid: data.data[i].id })
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

  const { mutate: banUser } = useMutation({
    mutationFn: async ({ userid, reportid }: any) => {
      await client.post(`/report/ban-user/${userid}/${reportid}}`);
    },
    onSuccess: async () => {
      refetch();
      HandleSuccess({ message: 'User has been banned.', toast });
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
          <SmallButton isDisabled={previousPage} onClick={() => setPage(page - 1)}>
            <IconChevronLeft />
          </SmallButton>
          <SmallButton
            isDisabled={nextPage}
            aria-label="Next page"
            onClick={() => setPage(page + 1)}
            icon={<IconChevronRight />}
          />
        </Flex>
        <ContentTable
          headers={TableHeaders}
          content={TableContent}
          caption={TableCaption}
          loading={isLoading}
          success={isSuccess}
        />
      </Flex>
      {reportModal !== '' && <GetUserReport id={reportModal} setModal={setReportModal} />}
      {userModal !== '' && <GetUser id={userModal} setModal={setUserModal} />}
      {serverError && <ServerError />}
    </>
  );
};

export default Moderation;
