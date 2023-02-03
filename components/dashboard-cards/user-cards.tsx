import { Flex, Avatar, Box, useToast, Center, Spinner, Text, chakra } from '@chakra-ui/react';
import { IconExternalLink } from '@tabler/icons';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import IDetails from '../../interfaces/IDetails';
import client from '../../lib/axios-service';
import { HandleError } from '../../lib/system-feedback';
import DetailDisplay from '../detail-display';

const UserCardContainer = chakra(Box, {
  baseStyle: {
    h: '100%',
    w: '100%',
    overflow: 'scroll',
    bgColor: 'gray.900',
    rounded: '20px',
    border: '1px solid',
    borderColor: 'gray.700'
  }
});

const listType: { data: IDetails[] | null } = { data: null };

const UserCard = () => {
  const toast = useToast();
  const router = useRouter();
  const [userDetails, setUserDetails] = useState(listType);

  const { isLoading, isSuccess, data } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      return await client.get('/user/profile').then((res) => res.data);
    },
    onSuccess: (data: any) => {
      const tmpUserDetails = {
        data: [
          { title: 'Username', des: data.username },
          { title: 'Email', des: data.email },
          { title: ['First Name', 'Last Name'], des: [data.firstName, data.lastName] }
        ]
      };

      setUserDetails(tmpUserDetails);
    },
    onError: (error: any) => {
      HandleError({ error, toast, router });
    }
  });

  return (
    <UserCardContainer>
      {isLoading && (
        <Center h="100%" w="100%">
          <Spinner size={'xl'} thickness={'5px'} color={'accent_red'} />
        </Center>
      )}
      {isSuccess && (
        <Flex m="10px" h="calc(100% - 20px)" alignItems="center" justifyContent="center" gap={10}>
          <Avatar src={data.profilePictureUrl} h="150px" w="150px" />
          <Flex direction="column" gap={5}>
            {userDetails?.data?.map((userDetail: IDetails) => (
              <DetailDisplay key={userDetail.title} title={userDetail.title} des={userDetail.des} />
            ))}
          </Flex>
        </Flex>
      )}
    </UserCardContainer>
  );
};

const UserStatCard = () => {
  const toast = useToast();
  const router = useRouter();
  const [userDetails, setUserDetails] = useState(listType);

  const { isLoading, isSuccess } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      return await client.get('/user/profile').then((res) => res.data);
    },
    onSuccess: (data: any) => {
      const tmpUserDetails = {
        data: [
          { title: 'ID', des: data.id },
          { title: 'Account Created', des: data.createdAt.substring(0, 10) },
          { title: 'Account Updated', des: data.updatedAt.substring(0, 10) }
        ]
      };

      setUserDetails(tmpUserDetails);
    },
    onError: (error: any) => {
      // HandleError({ error, toast, router });
    }
  });

  return (
    <UserCardContainer>
      {isLoading && (
        <Center h="100%" w="100%">
          <Spinner size={'xl'} thickness={'5px'} color={'accent_red'} />
        </Center>
      )}
      {isSuccess && (
        <Flex m="10px" h="calc(100% - 20px)" alignItems="center" justifyContent="center" gap={10}>
          <Flex direction="column" gap={5}>
            {userDetails?.data?.map((userDetail: IDetails) => (
              <DetailDisplay key={userDetail.title} title={userDetail.title} des={userDetail.des} />
            ))}
          </Flex>
        </Flex>
      )}
    </UserCardContainer>
  );
};

const UserAvatarCard = () => {
  const toast = useToast();
  const router = useRouter();
  const [userDetails, setUserDetails] = useState(listType);

  const { isLoading, isSuccess, data } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      return await client.get('/user/profile').then((res) => res.data);
    },
    onSuccess: (data: any) => {
      const tmpUserDetails = {
        data: [
          { title: 'Profile Picture ID', des: data.profilePictureId },
          { title: 'Profile Picture Expiry', des: data.profilePictureExpiryDate.substring(0, 10) }
        ]
      };
      setUserDetails(tmpUserDetails);
    },
    onError: (error: any) => {
      // HandleError({ error, toast, router });
    }
  });

  return (
    <UserCardContainer>
      {isLoading && (
        <Center h="100%" w="100%">
          <Spinner size={'xl'} thickness={'5px'} color={'accent_red'} />
        </Center>
      )}
      {isSuccess && (
        <Flex m="10px" h="calc(100% - 20px)" alignItems="center" justifyContent="center" gap={10}>
          <Flex direction="column" gap={5}>
            {userDetails?.data?.map((userDetail: IDetails) => (
              <DetailDisplay key={userDetail.title} title={userDetail.title} des={userDetail.des} />
            ))}
            <Flex direction="column">
              <Text fontSize="xs" color="accent_yellow">
                Profile Picture URL
              </Text>
              <Link href={data.profilePictureUrl} passHref target="_blank">
                <Flex _hover={{ color: 'accent_red' }} gap={2} alignItems="center">
                  <Text fontSize="lg">Link to full picture</Text>
                  <IconExternalLink color="#EF694D" />
                </Flex>
              </Link>
            </Flex>
          </Flex>
        </Flex>
      )}
    </UserCardContainer>
  );
};

export { UserCard, UserStatCard, UserAvatarCard };
