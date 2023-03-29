import { Flex } from '@chakra-ui/react';
import { UserAvatarCard, UserCard, UserStatCard } from '../dashboard-cards/user-cards';

// This is the dashboard page
const Dashboard = () => {
  return (
    <>
      <Flex h="100%" w="100%" direction="column">
        <Flex h="250px" w="100%" direction="row" gap="16px">
          <UserCard />
          <UserStatCard />
          <UserAvatarCard />
        </Flex>
      </Flex>
    </>
  );
};

export default Dashboard;
