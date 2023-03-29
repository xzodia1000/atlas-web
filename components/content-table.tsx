import {
  Center,
  Flex,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Thead,
  Tr
} from '@chakra-ui/react';
import { IconExternalLink } from '@tabler/icons';
import { TableButton, TableData, TableHeader } from '../styles/components-styles';

// This component is used to render the table for the reports
const ContentTable = ({ headers, content, success, loading }: any) => {
  return (
    <TableContainer
      h="100%"
      border={'2px solid'}
      borderColor="gray.700"
      rounded="10px"
      overflowY="scroll">
      {loading && (
        <Center h="100%">
          <Spinner size={'xl'} thickness={'5px'} color={'accent_red'} />
        </Center>
      )}
      <Table variant="striped" colorScheme="whiteAlpha">
        {success && (
          <>
            <Thead>
              <Tr>
                {headers.map((header: any) => (
                  <TableHeader key={header.title}>
                    <Flex alignItems="center" gap={2}>
                      {header.title}
                      {header.link === true ? <IconExternalLink color="#EF694D" /> : null}
                    </Flex>
                  </TableHeader>
                ))}
              </Tr>
            </Thead>

            <Tbody>
              {content.map((report: any, index: number) => (
                <Tr key={'report' + index}>
                  {report.report.map((field: any, index: number) => (
                    <TableData
                      key={index}
                      className={field.link === true ? 'isLink' : ''}
                      onClick={field.link === true ? field.function : null}>
                      {field.data}
                    </TableData>
                  ))}
                  <Td>
                    <Flex gap={5}>
                      {report.actions.map((action: any, index: number) => (
                        <TableButton
                          key={index}
                          onClick={action.function}
                          isDisabled={action.isDisabled}>
                          {action.title}
                        </TableButton>
                      ))}
                    </Flex>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </>
        )}
      </Table>
    </TableContainer>
  );
};

export default ContentTable;
