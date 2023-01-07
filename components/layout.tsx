import { useRouter } from 'next/router';
import Navbar from './navbar';

export default function Layout({ children }: any) {
  const router = useRouter();
  const loginNav = router.pathname === '/login' ? false : true;

  let title;
  switch (router.pathname) {
    case '/dashboard':
      title = 'Dashboard';
      break;
    case '/dashboard/moderation':
      title = 'Moderation';
      break;
    case '/dashboard/notification-control':
      title = 'Notification Control';
      break;
    case '/dashboard/appeals':
      title = 'Appeals';
      break;
    case '/dashboard/reported-posts':
      title = 'Reported Posts';
      break;
    case '/dashboard/post-analysis':
      title = 'Post Analysis';
      break;
    case '/dashboard/events':
      title = 'Events';
      break;
    case '/dashboard/settings':
      title = 'Settings';
      break;
    default:
      title = 'atlas';
  }

  return (
    <>
      {loginNav && Navbar(title)}
      <main>{children}</main>
    </>
  );
}
