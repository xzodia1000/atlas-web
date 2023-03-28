import { Flex } from '@chakra-ui/react';
import { IconChevronLeft, IconChevronRight, IconRefresh } from '@tabler/icons';
import { SmallButton } from '../styles/components-styles';

/*
 * Module for displaying table buttons (refresh, next page, previous page)
 * @param next - next page function and value
 * @param previous - previous page function and value
 * @param refetch - refetch function
 */
const TableButtons = ({ next, previous, refetch }: any) => {
  return (
    <Flex gap={3}>
      <SmallButton id="refresh" onClick={refetch} icon={<IconRefresh />} />
      <SmallButton
        id="previous"
        onClick={previous.function}
        isDisabled={previous.value}
        icon={<IconChevronLeft />}
      />
      <SmallButton
        id="next"
        onClick={next.function}
        isDisabled={next.value}
        icon={<IconChevronRight />}
      />
    </Flex>
  );
};

export default TableButtons;
