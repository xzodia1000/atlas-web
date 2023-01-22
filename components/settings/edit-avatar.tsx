import { Avatar, Center, SkeletonCircle, useToast, VStack } from '@chakra-ui/react';
import { IconPencil, IconUpload } from '@tabler/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import client from '../../lib/axios-service';
import { HandleError, HandleSuccess } from '../../lib/system-feedback';
import { SubmitButton, EditButton } from '../../styles/components-styles';
import ServerError from '../overlays/server-error';

export default function EditProfile() {
  const toast = useToast();
  const [serverError, setServerError] = useState(false);

  const inputFile = useRef<HTMLInputElement | null>(null);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const { isLoading, isSuccess } = useQuery({
    queryKey: ['avatar'],
    queryFn: async () => {
      return await client.get('/user/avatar').then((res) => res.data);
    },
    onSuccess: async (data) => {
      setAvatarUrl(data.profilePictureUrl);
    },
    onError: async (error: any) => {
      try {
        HandleError({ error, toast });
      } catch (error) {
        setServerError(true);
      }
    }
  });

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
    onSuccess: async () => {
      setAvatar(null);
      HandleSuccess({ message: 'Avatar updated', toast });
    },
    onError: async (error: any) => {
      try {
        HandleError({ error, toast });
      } catch (error) {
        setServerError(true);
      }
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
          </VStack>
        </Center>
      )}
      {serverError && <ServerError />}
    </>
  );
}
