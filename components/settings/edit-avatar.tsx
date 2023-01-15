import { Avatar, Center, SkeletonCircle, useToast, VStack } from '@chakra-ui/react';
import { IconPencil, IconUpload } from '@tabler/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import client from '../../lib/axios-service';
import { SubmitButton, EditButton } from '../../styles/settings-styles';
import ServerError from '../server-error';

export default function EditProfile() {
  const toast = useToast();
  const inputFile = useRef<HTMLInputElement | null>(null);

  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  async function getAvatar() {
    const { data } = await client.get('/user/avatar');
    setAvatarUrl(data.profilePictureUrl);
    return data;
  }
  const { isLoading, isError, isSuccess } = useQuery(['avatar'], getAvatar);

  const { isLoading: updating, mutate: updateAvatar } = useMutation<any, Error>({
    mutationFn: async () => {
      if (avatar === null) return;
      const formData = new FormData();
      formData.append('avatar', avatar);
      console.log('image' + formData.get('avatar'));
      return await client.patch('/user/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    },
    onSuccess: () => {
      setAvatar(null);
      toast({
        title: 'Avatar Updated',
        description: 'Your avatar has been updated.',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'bottom-right'
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response.data.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-right'
      });
    }
  });
  return (
    <>
      {isLoading && (
        <Center>
          <SkeletonCircle h="300px" w="300px" />
        </Center>
      )}
      {isError && <ServerError />}
      {isSuccess && (
        <Center>
          <VStack gap={10}>
            {!updating && (
              <Avatar
                border={'3px solid'}
                h="300px"
                w="300px"
                src={avatarUrl !== null ? avatarUrl : undefined}
              />
            )}
            {updating && <SkeletonCircle h="300px" w="300px" />}
            <input
              id="avatar-input"
              type="file"
              ref={inputFile}
              accept="image/*"
              onChange={(e: any) => {
                setAvatar(e.target.files[0]);
                setAvatarUrl(URL.createObjectURL(e.target.files[0]));
              }}
              style={{ display: 'none' }}
            />
            <EditButton
              leftIcon={<IconUpload size={40} />}
              htmlFor="avatar-input"
              onClick={() => inputFile.current?.click()}>
              Browse Picture
            </EditButton>
            <SubmitButton
              isDisabled={avatar === null}
              _disabled={{ _hover: { bgColor: 'accent_yellow', color: 'accent_blue' } }}
              isLoading={updating}
              leftIcon={<IconPencil />}
              onClick={updateAvatar}>
              Change Avatar
            </SubmitButton>
          </VStack>
        </Center>
      )}
    </>
  );
}
