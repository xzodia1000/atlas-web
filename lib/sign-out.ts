import { NextRouter } from 'next/router';

export default function SignOut(router: NextRouter) {
  localStorage.getItem('token') != null
    ? localStorage.removeItem('token')
    : sessionStorage.removeItem('token');

  router.push('/login');
}
