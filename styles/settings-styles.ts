import { chakra, Flex, Input, Tab } from '@chakra-ui/react';

export const SettingsTab = chakra(Tab, {
  baseStyle: {
    mb: '10px',
    _selected: {
      color: 'accent_red',
      borderLeft: '3px solid',
      borderColor: 'accent_red'
    },
    _hover: {
      borderLeft: '5px solid',
      borderColor: 'accent_red'
    }
  }
});

export const InputField = chakra(Input, {
  baseStyle: {
    h: '50px',
    w: '450px',
    borderRadius: '8px',
    bgColor: '#F5F5F5',
    border: '3px solid',
    borderColor: 'accent_blue',

    _hover: { borderColor: 'accent_yellow' },
    _focus: { borderColor: 'accent_yellow', shadow: 'xl' }
  }
});

export const Field = chakra(Flex, {
  baseStyle: {
    mb: '30px',
    alignItems: 'center',
    gap: '20px'
  }
});
