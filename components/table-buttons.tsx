import { Flex } from '@chakra-ui/react';
import { IconChevronLeft, IconChevronRight, IconRefresh } from '@tabler/icons';
import { SmallButton } from '../styles/components-styles';

const TableButtons = ({ next, previous, refetch }: any) => {
  return (
    <Flex gap={3}>
      <SmallButton onClick={refetch} icon={<IconRefresh />} />
      <SmallButton
        onClick={previous.function}
        isDisabled={previous.value}
        icon={<IconChevronLeft />}
      />
      <SmallButton onClick={next.function} isDisabled={next.value} icon={<IconChevronRight />} />
    </Flex>
  );
};

export default TableButtons;
