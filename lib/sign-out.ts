import { NextRouter } from 'next/router';

export default function SignOut(router: NextRouter) {
  // Remove the token from local storage
  localStorage.removeItem('token');

  // Redirect to the login page
  router.push('/login');
}
