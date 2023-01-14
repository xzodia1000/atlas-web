import { useQuery } from '@tanstack/react-query';
import Head from 'next/head';
import client from '../../lib/axios-service';

export default function ReportedPosts() {
  const { isLoading, isError, isSuccess, data } = useQuery({
    queryKey: ['reported-posts'],
    queryFn: () => client.get('/report/reported-posts', { params: {} }).then((res) => res.data)
  });
  console.log(data);
  return (
    <>
      <Head>
        <title>atlas - Reported Posts</title>
        <meta name="description" content="Reported posts page for atlas admin panel" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.png" />
      </Head>
    </>
  );
}
