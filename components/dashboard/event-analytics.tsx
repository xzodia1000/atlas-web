import { Flex, Spacer, useToast, Text } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useState } from 'react';
import client from '../../lib/axios-service';
import { HandleError } from '../../lib/system-feedback';
import ContentTable from '../content-table';
import DropdownMenu from '../dropdown-menu';
import TableButtons from '../table-buttons';

// Dynamic imports
const GetUser = dynamic(() => import('../overlays/get-user').then((mod) => mod.default));
const GetEvent = dynamic(() => import('../overlays/get-event').then((mod) => mod.default));

// Table headers
const TableHeaders = [
  { title: 'Event ID', link: true },
  { title: 'Event Host', link: true },
  { title: 'Event Name' },
  { title: 'Event Active Date' },
  { title: 'Number of Participants' }
];

// This is the event analytics page
const Events = () => {
  const toast = useToast();
  const router = useRouter();

  const [sort, setSort] = useState('DESC');
  const [page, setPage] = useState(1);
  const [nextPage, setNextPage] = useState(true);
  const [previousPage, setPreviousPage] = useState(true);

  const [userModal, setUserModal] = useState('');
  const [eventModal, setEventModal] = useState('');

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

  // Fuction to get the event analytics
  const { isLoading, isSuccess, refetch, isRefetching } = useQuery({
    queryKey: ['event-analytics', page, sort],
    queryFn: async () => {
      // Get the active events from the API
      return await client
        .get(`/event/active-events?order=${sort}&page=${page}&take=13`)
        .then((res) => res.data);
    },
    onSuccess: (data) => {
      // Set the next and previous page
      setNextPage(!data.meta.hasNextPage);
      setPreviousPage(!data.meta.hasPreviousPage);

      const tmpTableContent: any = [];
      for (let i = 0; i < data.data.length; i++) {
        // Add the data to the table
        tmpTableContent[i] = {
          report: [
            {
              data: data.data[i].id,
              link: true,
              function: () => setEventModal(data.data[i].id)
            },
            {
              data: data.data[i].creator.username,
              link: true,
              function: () => setUserModal(data.data[i].creator.id)
            },
            {
              data: data.data[i].name
            },
            {
              data: data.data[i].date.substring(0, 10)
            },
            {
              data: data.data[i].numberOfParticipants
            }
          ],
          actions: []
        };
      }

      // Set the table content
      setTableContent(tmpTableContent);
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
      {userModal !== '' && <GetUser id={userModal} setModal={setUserModal} />}
      {eventModal !== '' && <GetEvent id={eventModal} setModal={setEventModal} />}
    </>
  );
};

export default Events;
