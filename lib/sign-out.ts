import { NextRouter } from 'next/router';

/**
 * Sign out the user by removing the token from local storage and redirecting to the login page.
 * @param {NextRouter} router
 */
export default function SignOut(router: NextRouter) {
  localStorage.removeItem('token');
  router.push('/login');
}
