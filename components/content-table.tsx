import {
  Center,
  Flex,
  Spinner,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Thead,
  Tr
} from '@chakra-ui/react';
import { IconExternalLink } from '@tabler/icons';
import { TableButton, TableData, TableHeader } from '../styles/components-styles';

const ContentTable = ({ headers, content, caption, success, loading }: any) => {
  let i = 0;
  return (
    <TableContainer h="100%" border={'2px solid'} borderColor="gray.700" rounded="10px">
      {loading && (
        <Center h="100%">
          <Spinner size={'xl'} thickness={'5px'} color={'accent_red'} />
        </Center>
      )}
      <Table variant="striped" colorScheme="whiteAlpha">
        <TableCaption color="accent_yellow" placement="bottom">
          {caption.title} {caption.data}
        </TableCaption>
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
        {success && (
          <Tbody>
            {content.map((report: any) => (
              <Tr key={'report' + i++}>
                {report.report.map((field: any) => (
                  <TableData
                    key={field.data}
                    className={field.link === true ? 'isLink' : ''}
                    onClick={field.link === true ? field.function : null}>
                    {field.data}
                  </TableData>
                ))}
                <Td>
                  <TableButton onClick={report.action.function}>{report.action.title}</TableButton>
                </Td>
              </Tr>
            ))}
          </Tbody>
        )}
      </Table>
    </TableContainer>
  );
};

export default ContentTable;
