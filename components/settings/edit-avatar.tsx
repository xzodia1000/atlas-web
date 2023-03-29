import { Avatar, Center, SkeletonCircle, useToast, VStack } from '@chakra-ui/react';
import { IconPencil, IconTrash, IconUpload } from '@tabler/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';
import client from '../../lib/axios-service';
import { HandleError, HandleSuccess } from '../../lib/system-feedback';
import { SubmitButton, EditButton } from '../../styles/components-styles';

// This is the edit avatar component
export default function EditProfile() {
  const toast = useToast();
  const router = useRouter();

  const inputFile = useRef<HTMLInputElement | null>(null); // Reference to input file
  const [avatar, setAvatar] = useState<File | null>(null); // State to store avatar
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null); // State to store avatar url

  // Function to get current avatar
  const { data, isLoading, isSuccess, refetch } = useQuery({
    queryKey: ['avatar'],
    queryFn: async () => {
      // Get current avatar from server
      return await client.get('/user/avatar').then((res) => res.data);
    },
    onSuccess: async (data) => {
      // Set avatar url
      setAvatarUrl(data.profilePictureUrl);
    },
    onError: async (error: any) => {
      // Handle error
      HandleError({ error, toast, router });
    }
  });

  // Function to update avatar
  const { isLoading: updating, mutate: updateAvatar } = useMutation<any, Error>({
    mutationFn: async () => {
      if (avatar === null) return; // Return if no avatar is selected
      const formData = new FormData(); // Create new form data
      formData.append('avatar', avatar); // Append avatar image file to form data

      if (data !== '') {
        // If avatar already exists, use patch request
        return await client.patch('/user/avatar', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        // If avatar does not exist, use post request
        return await client.post('/user/avatar', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }
    },
    onSuccess: async () => {
      setAvatar(null); // Set avatar url to null to force image to reload
      refetch(); // Refetch avatar
      HandleSuccess({ message: 'Avatar updated', toast }); // Handle success
    },
    onError: async (error: any) => {
      // Handle error
      HandleError({ error, toast, router });
    }
  });

  // Function to delete avatar
  const { isLoading: deleting, mutate: deleteAvatar } = useMutation<any, Error>({
    mutationFn: async () => {
      // Delete avatar from server
      return await client.delete('/user/avatar');
    },
    onSuccess: async () => {
      setAvatarUrl(null); // Set avatar url to null to force image to reload
      refetch(); // Refetch avatar
      HandleSuccess({ message: 'Avatar deleted', toast }); // Handle success
    },
    onError: async (error: any) => {
      // Handle error
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
