import { Avatar, Center, SkeletonCircle, useToast, VStack } from '@chakra-ui/react';
import { IconPencil, IconTrash, IconUpload } from '@tabler/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';
import client from '../../lib/axios-service';
import { HandleError, HandleSuccess } from '../../lib/system-feedback';
import { SubmitButton, EditButton } from '../../styles/components-styles';

export default function EditProfile() {
  const toast = useToast();
  const router = useRouter();

  const inputFile = useRef<HTMLInputElement | null>(null);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const { data, isLoading, isSuccess, refetch } = useQuery({
    queryKey: ['avatar'],
    queryFn: async () => {
      return await client.get('/user/avatar').then((res) => res.data);
    },
    onSuccess: async (data) => {
      setAvatarUrl(data.profilePictureUrl);
    },
    onError: async (error: any) => {
      HandleError({ error, toast, router });
    }
  });

  const { isLoading: updating, mutate: updateAvatar } = useMutation<any, Error>({
    mutationFn: async () => {
      if (avatar === null) return;
      const formData = new FormData();
      formData.append('avatar', avatar);
      console.log('image' + formData.get('avatar'));

      if (data !== '') {
        return await client.patch('/user/avatar', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        return await client.post('/user/avatar', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }
    },
    onSuccess: async () => {
      setAvatar(null);
      refetch();
      HandleSuccess({ message: 'Avatar updated', toast });
    },
    onError: async (error: any) => {
      HandleError({ error, toast, router });
    }
  });

  const { isLoading: deleting, mutate: deleteAvatar } = useMutation<any, Error>({
    mutationFn: async () => {
      return await client.delete('/user/avatar');
    },
    onSuccess: async () => {
      setAvatarUrl(null);
      refetch();
      HandleSuccess({ message: 'Avatar deleted', toast });
    },
    onError: async (error: any) => {
      HandleError({ error, toast, router });
    }
  });

  return (
    <>
      {isLoading && (
        <Center>
          <SkeletonCircle h="300px" w="300px" />
        </Center>
      )}
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
            <SubmitButton
              isDisabled={data === '' || updating}
              bgColor="error_red"
              _disabled={{ _hover: { bgColor: 'error_red' } }}
              _hover={{ bgColor: 'red' }}
              isLoading={deleting}
              leftIcon={<IconTrash />}
              onClick={deleteAvatar}>
              Delete Avatar
            </SubmitButton>
          </VStack>
        </Center>
      )}
    </>
  );
}
