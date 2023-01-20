import {
  Flex,
  Table,
  TableContainer,
  Tbody,
  Thead,
  Tr,
  Spacer,
  TableCaption,
  Td,
  Menu,
  MenuButton,
  MenuDivider,
  Spinner,
  Center,
  useToast
} from '@chakra-ui/react';
import {
  IconArrowDown,
  IconArrowUp,
  IconChevronDown,
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
  SmallButton,
  SortItem,
  SortList,
  SortMenu,
  TableButton,
  TableData,
  TableHeader
} from '../../styles/components-styles';

const GetPost = dynamic(() => import('../overlays/get-post').then((mod) => mod.default));
const GetPostReport = dynamic(() =>
  import('../overlays/get-post-report').then((mod) => mod.default)
);
const GetUser = dynamic(() => import('../overlays/get-user').then((mod) => mod.default));
const ServerError = dynamic(() => import('../server-error').then((mod) => mod.default));

const LinkIcon = <IconExternalLink color="#EF694D" />;

const ReportedPosts = () => {
  const toast = useToast();

  const [sort, setSort] = useState('DESC');
  const [page, setPage] = useState(1);
  const [nextPage, setNextPage] = useState(true);
  const [previousPage, setPreviousPage] = useState(true);

  const [reportModal, setReportModal] = useState('');
  const [postModal, setPostModal] = useState('');
  const [userModal, setUserModal] = useState('');

  const getReportedPosts = async () => {
    const { data } = await client.get(`/report/reported-posts?order=${sort}&page=${page}&take=10`);
    setPage(data.meta.page);
    setNextPage(!data.meta.hasNextPage);
    setPreviousPage(!data.meta.hasPreviousPage);
    return data;
  };

  const { isLoading, isError, isSuccess, data, refetch } = useQuery(
    ['reported-posts', page, sort],
    getReportedPosts
  );

  const { isLoading: isBanning, mutate: banPost } = useMutation({
    mutationFn: async ({ postid, reportid }: any) => {
      return await client.post(`/report/ban-post/${postid}/${reportid}`);
    },
    onSuccess: async () => {
      refetch();
      return toast({
        title: 'Success!',
        description: 'Post banned successfully.',
        status: 'success',
        duration: 9000,
        isClosable: true,
        position: 'bottom-right'
      });
    },
    onError: async (error: any) => {
      return toast({
        title: 'Error',
        description: error.response.data.message,
        status: 'error',
        duration: 9000,
        isClosable: true,
        position: 'bottom-right'
      });
    }
  });

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
                      Post ID {LinkIcon}
                    </Flex>
                  </TableHeader>
                  <TableHeader>
                    <Flex alignItems="center" gap={2}>
                      Posted By {LinkIcon}
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
                        onClick={() => setReportModal(report.reportedPost.id)}>
                        {report.id}
                      </TableData>
                      <TableData
                        className="isLink"
                        onClick={() => setUserModal(report.reportedBy.id)}>
                        {report.reportedBy.username}
                      </TableData>
                      <TableData
                        className="isLink"
                        onClick={() => setPostModal(report.reportedPost.id)}>
                        {report.reportedPost.id}
                      </TableData>
                      <TableData
                        className="isLink"
                        onClick={() => setUserModal(report.reportedPost.postedBy.id)}>
                        {report.reportedPost.postedBy.username}
                      </TableData>
                      <TableData>{Capitalize(report.reason)}</TableData>
                      <TableData>{Capitalize(report.status)}</TableData>
                      <Td>
                        <TableButton
                          isLoading={isBanning}
                          onClick={() =>
                            banPost({
                              postid: report.reportedPost.id,
                              reportid: report.id
                            })
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
      {reportModal !== '' && <GetPostReport id={reportModal} setModal={setReportModal} />}
      {userModal !== '' && <GetUser id={userModal} setModal={setUserModal} />}
      {postModal !== '' && <GetPost id={postModal} setModal={setPostModal} />}
    </>
  );
};

export default ReportedPosts;
