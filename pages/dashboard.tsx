import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

// Dynamic imports
const HomeComponent = dynamic(() =>
  import('../components/dashboard/home').then((mod) => mod.default)
);
const ModerationComponent = dynamic(() =>
  import('../components/dashboard/moderation').then((mod) => mod.default)
);
const NotificationComponent = dynamic(() =>
  import('../components/dashboard/notification-control').then((mod) => mod.default)
);
const AppealsComponent = dynamic(() =>
  import('../components/dashboard/appeals').then((mod) => mod.default)
);
const ReportedPostsComponent = dynamic(() =>
  import('../components/dashboard/reported-posts').then((mod) => mod.default)
);
const PostAnalyticsComponent = dynamic(() =>
  import('../components/dashboard/post-analytics').then((mod) => mod.default)
);
const EventAnalyticsComponent = dynamic(() =>
  import('../components/dashboard/event-analytics').then((mod) => mod.default)
);
const ServerError = dynamic(() =>
  import('../components/overlays/server-error').then((mod) => mod.default)
);
const SessionExpired = dynamic(() =>
  import('../components/overlays/session-expired').then((mod) => mod.default)
);
const NavbarComponent = dynamic(() => import('../components/navbar').then((mod) => mod.default));

// Components
const components = [
  {
    name: 'home',
    title: 'Dashboard',
    component: <HomeComponent />
  },
  {
    name: 'moderation',
    title: 'Moderation',
    component: <ModerationComponent />
  },
  {
    name: 'notification-control',
    title: 'Notifications',
    component: <NotificationComponent />
  },
  {
    name: 'appeals',
    title: 'Appeals',
    component: <AppealsComponent />
  },
  {
    name: 'reported-posts',
    title: 'Reported Posts',
    component: <ReportedPostsComponent />
  },
  {
    name: 'post-analytics',
    title: 'Post Analytics',
    component: <PostAnalyticsComponent />
  },
  {
    name: 'event-analytics',
    title: 'Event Analytics',
    component: <EventAnalyticsComponent />
  },
  {
    name: 'server-error',
    title: 'Server Error',
    component: <ServerError />
  },
  {
    name: 'session-expired',
    title: 'Session Expired',
    component: <SessionExpired />
  }
];
const regex = /#([^?]*)/;

const Dashboard: NextPage = () => {
  // Router instance
  const router = useRouter();

  // Get current hash
  const currentHash = router.asPath.split('#')[1];

  // Active component
  const [activeComponent, setActiveComponent] = useState<any>();

  // Previous route
  const prevRoute = useRef<string>('');

  // Set title
  const title =
    components.find((component) => component.name === router.asPath.split('#')[1])?.title ??
    'Dashboard';

  // Set active component
  useEffect(() => {
    if (prevRoute.current === currentHash) {
      return;
    }
    const component = components.filter(
      (component) => component.name === regex.exec(router.asPath)?.[1] ?? 'home'
    );
    if (component.length > 0) {
      setActiveComponent(component[0].component);
    } else {
      setActiveComponent(components[0].component);
    }
    return () => {
      prevRoute.current = currentHash;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <>
      <Head>
        <title>atlas - {title}</title>
        <meta name="description" content={title + ' page for atlas admin panel'} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.png" />
      </Head>
      <NavbarComponent>{activeComponent}</NavbarComponent>
    </>
  );
};

export default Dashboard;
