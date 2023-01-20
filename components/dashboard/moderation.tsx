import {
  Flex,
  Menu,
  MenuButton,
  MenuDivider,
  Spacer,
  TableContainer,
  Center,
  Spinner,
  Table,
  TableCaption,
  Thead,
  Tr,
  Tbody,
  Td,
  useToast
} from '@chakra-ui/react';
import {
  IconChevronDown,
  IconArrowDown,
  IconArrowUp,
  IconChevronLeft,
  IconChevronRight,
  IconExternalLink
} from '@tabler/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import client from '../../lib/axios-service';
import Capitalize from '../../lib/capitalize-letter';
import {
  SortMenu,
  SortList,
  SortItem,
  SmallButton,
  TableHeader,
  TableData,
  TableButton
} from '../../styles/components-styles';

const GetUser = dynamic(() => import('../overlays/get-user').then((mod) => mod.default));
const GetUserReport = dynamic(() =>
  import('../overlays/get-user-report').then((mod) => mod.default)
);
const ServerError = dynamic(() => import('../server-error').then((mod) => mod.default));

const LinkIcon = <IconExternalLink color="#EF694D" />;

const Moderation = () => {
  const toast = useToast();
  const [sort, setSort] = useState('DESC');
  const [page, setPage] = useState(1);
  const [nextPage, setNextPage] = useState(true);
  const [previousPage, setPreviousPage] = useState(true);

  const [reportModal, setReportModal] = useState('');
  const [userModal, setUserModal] = useState('');

  const getReportedUsers = async () => {
    const { data } = await client.get(`/report/reported-users?order=${sort}&page=${page}&take=10`);
    setPage(data.meta.page);
    setNextPage(!data.meta.hasNextPage);
    setPreviousPage(!data.meta.hasPreviousPage);
    return data;
  };

  const { isLoading, isError, isSuccess, data, refetch } = useQuery(
    ['reported-users', page, sort],
    getReportedUsers
  );

  const { isLoading: isBanning, mutate: banUser } = useMutation({
    mutationFn: async ({ userid, reportid }: any) => {
      await client.post(`/report/ban-user/${userid}/${reportid}}`);
    },
    onSuccess: () => {
      refetch();
      return toast({
        title: 'Success!',
        description: 'User banned successfully.',
        status: 'success',
        duration: 9000,
        isClosable: true,
        position: 'bottom-right'
      });
    },
    onError: () => {
      return toast({
        title: 'Error!',
        description: 'Something went wrong.',
        status: 'error',
        duration: 9000,
        isClosable: true,
        position: 'bottom-right'
      });
    }
  });

  console.log(data);

  return (
    <>
      <Flex h="100%" direction="column">
        <Flex mb="10px" alignItems="center" gap={3}>
          <Menu>
            <MenuButton as={SortMenu} rightIcon={<IconChevronDown />}>
              Sort
            </MenuButton>
            <SortList bgColor="gray.900" borderColor="gray.700">
              <SortItem
                className={sort === 'DESC' ? 'isActive' : ''}
                onClick={() => {
                  setSort('DESC');
                  setPage(1);
                }}>
                Reported Date <IconArrowDown />
              </SortItem>
              <MenuDivider />
              <SortItem
                className={sort === 'ASC' ? 'isActive' : ''}
                onClick={() => {
                  setSort('ASC');
                  setPage(1);
                }}>
                Reported Date <IconArrowUp />
              </SortItem>
            </SortList>
          </Menu>
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
        <TableContainer h="100%" border={'2px solid'} borderColor="gray.700" rounded="10px">
          {isLoading && (
            <Center h="100%">
              <Spinner size={'xl'} thickness={'5px'} color={'accent_red'} />
            </Center>
          )}
          {isError && <ServerError />}
          {isSuccess && (
            <Table variant="striped" colorScheme="whiteAlpha">
              <TableCaption color="accent_yellow" mt="100%" placement="bottom">
                Page {page}
              </TableCaption>
              <Thead>
                <Tr>
                  <TableHeader>
                    <Flex alignItems="center" gap={2}>
                      Report ID {LinkIcon}
                    </Flex>
                  </TableHeader>
                  <TableHeader>
                    <Flex alignItems="center" gap={2}>
                      Reported By {LinkIcon}
                    </Flex>
                  </TableHeader>
                  <TableHeader>
                    <Flex alignItems="center" gap={2}>
                      Reported User {LinkIcon}
                    </Flex>
                  </TableHeader>
                  <TableHeader>Reason</TableHeader>
                  <TableHeader minW="250px">Status</TableHeader>
                  <TableHeader>Actions</TableHeader>
                </Tr>
              </Thead>
              <Tbody>
                {isSuccess &&
                  data.data.map((report: any) => (
                    <Tr key={report.id}>
                      <TableData
                        className="isLink"
                        onClick={() => setReportModal(report.reportedUser.id)}>
                        {report.id}
                      </TableData>
                      <TableData
                        className="isLink"
                        onClick={() => setUserModal(report.reportedBy.id)}>
                        {report.reportedBy.username}
                      </TableData>
                      <TableData
                        className="isLink"
                        onClick={() => setUserModal(report.reportedUser.id)}>
                        {report.reportedUser.username}
                      </TableData>
                      <TableData>{Capitalize(report.reason)}</TableData>
                      <TableData>{Capitalize(report.status)}</TableData>
                      <Td>
                        <TableButton
                          isLoading={isBanning}
                          onClick={() =>
                            banUser({ userid: report.reportedUser.id, reportid: report.id })
                          }>
                          Ban
                        </TableButton>
                      </Td>
                    </Tr>
                  ))}
              </Tbody>
            </Table>
          )}
        </TableContainer>
      </Flex>
      {reportModal !== '' && <GetUserReport id={reportModal} setModal={setReportModal} />}
      {userModal !== '' && <GetUser id={userModal} setModal={setUserModal} />}
    </>
  );
};

export default Moderation;
