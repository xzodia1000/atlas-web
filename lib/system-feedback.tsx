// Toast for handling success responses
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

// Toast for handling error responses
export const HandleError = ({ error, toast, router }: any) => {
  try {
    // If the token is expired, open the session expired modal
    if (error.response.data.message === 'Unauthorized') {
      router.push('/dashboard#session-expired');
    } else {
      // Otherwise, open the error toast
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
    // If the server is down, open the server error modal
    if (router.pathname !== '/dashboard#server-error') {
      router.push('/dashboard#server-error');
    }
  }
};
