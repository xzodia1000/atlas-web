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

export const HandleError = ({ error, toast, router }: any) => {
  try {
    return toast({
      title: 'Error!',
      description: error.response.data.message,
      status: 'error',
      duration: 9000,
      isClosable: true,
      position: 'bottom-right'
    });
  } catch (error) {
    router.push('/dashboard#server-error');
  }
};
