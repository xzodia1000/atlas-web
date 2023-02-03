import { Flex, Text } from '@chakra-ui/react';

/*
 * Module for displaying details with title and description
 * @param title - title of detail
 * @param des - description of detail
 */
const DetailDisplay = ({ title, des }: any) => {
  return (
    <>
      {typeof title === 'string' && (
        <Flex direction="column">
          <Text fontSize="xs" color="accent_yellow">
            {title}
          </Text>
          <Text fontSize="lg">{des}</Text>
        </Flex>
      )}
      {typeof title === 'object' && (
        <Flex gap={5}>
          {title.map((item: any, index: number) => (
            <Flex key={index} direction="column">
              <Text fontSize="xs" color="accent_yellow">
                {item}
              </Text>
              <Text fontSize="lg">{des[index]}</Text>
            </Flex>
          ))}
        </Flex>
      )}
    </>
  );
};

export default DetailDisplay;
