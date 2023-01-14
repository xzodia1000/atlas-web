import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import SidebarWithHeader from '../components/navbar';

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

const components = [
  {
    name: 'home',
    component: <HomeComponent />
  },
  {
    name: 'moderation',
    component: <ModerationComponent />
  },
  {
    name: 'notification-control',
    component: <NotificationComponent />
  },
  {
    name: 'appeals',
    component: <AppealsComponent />
  },
  {
    name: 'reported-posts',
    component: <ReportedPostsComponent />
  },
  {
    name: 'post-analytics',
    component: <PostAnalyticsComponent />
  },
  {
    name: 'event-analytics',
    component: <EventAnalyticsComponent />
  }
];
const regex = /#([^?]*)/;

const Dashboard: NextPage = () => {
  const router = useRouter();
  const currentHash = router.asPath.split('#')[1];
  const [activeComponent, setActiveComponent] = useState<any>();
  const prevRoute = useRef<string>('');
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
      <SidebarWithHeader>{activeComponent}</SidebarWithHeader>
    </>
  );
};

export default Dashboard;
