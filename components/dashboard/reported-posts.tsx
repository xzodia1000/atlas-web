import { Table, TableContainer, Tbody, Th, Thead, Tr } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import client from '../../lib/axios-service';
const ReportedPosts = () => {
  const { isLoading, isError, isSuccess, data } = useQuery({
    queryKey: ['reported-posts'],
    queryFn: () => client.get('/report/reported-posts', { params: {} }).then((res) => res.data)
  });
  console.log(data);
  return (
    <>
      <TableContainer h="100%" border={'1px solid'} borderColor="gray.700" rounded="10px">
        <Table variant="unstyled">
          <Thead>
            <Tr>
              <Th>Post</Th>
              <Th>Reported By</Th>
              <Th>Reason</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {isSuccess &&
              data.data.map((post: any) => (
                <Tr key={post.id}>
                  <Th>{post.id}</Th>
                  <Th>{post.reportedBy.username}</Th>
                  <Th>{post.reason}</Th>
                  <Th>Actions</Th>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

export default ReportedPosts;
