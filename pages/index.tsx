import Head from 'next/head';
import { useAuthContext } from '../lib/auth-context';

export default function Home() {
  const { token } = useAuthContext();

  console.log(token);

  return (
    <>
      <Head>
        <title>atlas</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1>Home</h1>
    </>
  );
}
