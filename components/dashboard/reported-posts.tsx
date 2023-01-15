import { useQuery } from '@tanstack/react-query';
import client from '../../lib/axios-service';
const ReportedPosts = () => {
  const { isLoading, isError, isSuccess, data } = useQuery({
    queryKey: ['reported-posts'],
    queryFn: () => client.get('/report/reported-posts', { params: {} }).then((res) => res.data)
  });
  console.log(data);
  return <></>;
};

export default ReportedPosts;
