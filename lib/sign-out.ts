import { NextRouter } from 'next/router';

export default function SignOut(router: NextRouter) {
  localStorage.removeItem('token');
  router.push('/login');
}
