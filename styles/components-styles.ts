import {
  Button,
  chakra,
  Flex,
  IconButton,
  Input,
  MenuItem,
  MenuList,
  Tab,
  Td,
  Th
} from '@chakra-ui/react';
import { Rubik } from '@next/font/google';

const rubik = Rubik();

export const GoHomeButton = chakra(Button, {
  baseStyle: {
    h: '60px',
    w: '175px',
    bgColor: 'accent_yellow',
    color: 'accent_blue',
    fontSize: '20px',
    rounded: '10px',
    fontFamily: rubik.style.fontFamily,
    fontWeight: '450',
    _hover: { bgColor: 'accent_yellow_dark' }
  }
});

export const SettingsTab = chakra(Tab, {
  baseStyle: {
    mb: '10px',
    borderLeft: '5px solid',
    borderLeftColor: 'gray.900',
    _selected: {
      color: 'accent_red',
      borderColor: 'accent_red'
    },
    _hover: {
      borderColor: 'accent_red'
    }
  }
});

export const InputField = chakra(Input, {
  baseStyle: {
    h: '50px',
    w: '450px',
    borderRadius: '8px',
    bgColor: 'gray.700',
    border: '1px solid',
    borderColor: 'gray.700',

    _hover: { borderColor: 'accent_yellow' },
    _focus: { border: '3px solid', borderColor: 'accent_yellow', shadow: 'xl' }
  }
});

export const Field = chakra(Flex, {
  baseStyle: {
    mb: '30px',
    alignItems: 'center',
    gap: '20px'
  }
});

export const SubmitButton = chakra(Button, {
  baseStyle: {
    size: 'lg',
    h: '50px',
    maxW: 'max-content',
    minW: '200px',
    mt: '50px',
    borderRadius: '8px',
    color: 'accent_blue',
    bgColor: 'accent_yellow',
    fontFamily: rubik.style.fontFamily,
    fontSize: '20px',
    fontWeight: '450',

    _hover: { bgColor: 'accent_yellow_dark' },
    _loading: { _hover: { bgColor: 'accent_yellow', color: 'accent_blue' } }
  }
});

export const EditButton = chakra(Button, {
  baseStyle: {
    h: '100%',
    w: '100%',
    color: 'accent_white',
    bgColor: 'gray.800',
    fontFamily: rubik.style.fontFamily,
    fontSize: '30px',
    fontWeight: '450',

    _hover: { cursor: 'pointer', color: 'accent_red', bgColor: 'gray.800' }
  }
});

export const SmallButton = chakra(IconButton, {
  baseStyle: {
    color: 'accent_blue',
    bgColor: 'accent_yellow',
    _hover: { bgColor: 'accent_yellow_dark' },
    _disabled: { _hover: { bgColor: 'accent_yellow', color: 'accent_blue' } }
  }
});

export const TableHeader = chakra(Th, {
  baseStyle: {
    maxW: '200px',
    fontSize: '15px',
    color: 'accent_yellow'
  }
});

export const TableData = chakra(Td, {
  baseStyle: {
    maxW: '200px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    '&.isLink': {
      _hover: { cursor: 'pointer', color: 'accent_red' }
    }
  }
});

export const TableButton = chakra(Button, {
  baseStyle: {
    h: '25px',
    w: '70px',
    rounded: '5px',
    bgColor: 'accent_yellow',
    color: 'accent_blue',
    _hover: { bgColor: 'accent_yellow_dark' }
  }
});

export const AppMenu = chakra(Button, {
  baseStyle: {
    minW: '100px',
    maxW: 'max-content',
    bgColor: 'accent_yellow',
    color: 'accent_blue',
    _hover: { bgColor: 'accent_yellow_dark' },
    _active: { bgColor: 'accent_red', color: 'white' }
  }
});

export const AppMenuList = chakra(MenuList, {
  baseStyle: {
    bgColor: 'gray.900',
    borderColor: 'gray.700'
  }
});

export const AppMenuItem = chakra(MenuItem, {
  baseStyle: {
    bgColor: 'gray.900',
    _hover: { bgColor: 'accent_red', color: 'white' },
    '&.isActive': { leftIcon: 'IconCheck', color: 'accent_red', _hover: { color: 'white' } }
  }
});

export const ModalButton = chakra(Button, {
  baseStyle: {
    w: '50%',
    bgColor: 'accent_yellow',
    color: 'accent_blue',

    _hover: { bgColor: 'accent_yellow_dark' },
    _disabled: {
      _hover: { bgColor: 'accent_yellow', color: 'accent_blue' }
    },
    _loading: { _hover: { bgColor: 'accent_yellow', color: 'accent_blue' } }
  }
});
