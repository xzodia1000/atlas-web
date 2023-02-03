/**
 * Module for handling success responses
 * @param message - message to be displayed
 * @param toast - chakra toast
 * @returns success toast with message
 */
export const HandleSuccess = ({ message, toast }: any) => {
  return toast({
    title: 'Success!',
    description: message,
    status: 'success',
    duration: 9000,
    isClosable: true,
    position: 'bottom-right'
  });
};

/**
 * Module for handling error responses
 * @param error - error response
 * @param toast - chakra toast
 * @param router - next router
 * @returns error toast with message
 * @returns redirect to login page when token expires
 * @returns redirect to server error page when server error occurs
 */
export const HandleError = ({ error, toast, router }: any) => {
  try {
    if (error.response.data.message === 'Unauthorized') {
      router.push('/dashboard#session-expired');
    } else {
      return toast({
        title: 'Error!',
        description: error.response.data.message,
        status: 'error',
        duration: 9000,
        isClosable: true,
        position: 'bottom-right'
      });
    }
  } catch (error) {
    if (router.pathname !== '/dashboard#server-error') {
      router.push('/dashboard#server-error');
    }
  }
};
