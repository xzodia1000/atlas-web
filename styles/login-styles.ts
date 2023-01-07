import { Button, chakra, Checkbox, Input } from '@chakra-ui/react';

// Button, Input, and Checkbox are Chakra UI components with custom styles.
export const LoginButton = chakra(Button, {
  baseStyle: {
    size: 'lg',
    h: '50px',
    w: '200px',
    borderRadius: '8px',
    bgColor: 'accent_yellow',
    shadow: 'lg',
    fontSize: '20px',

    _hover: { bgColor: 'accent_red', color: 'accent_white' }
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

    _hover: { border: '3px solid', borderColor: 'accent_yellow' },
    _focus: { border: '3px solid', borderColor: 'accent_yellow', shadow: 'xl' }
  }
});

export const RememberMe = chakra(Checkbox, {
  baseStyle: {
    colorScheme: 'accent_yellow',
    borderColor: 'accent_blue'
  }
});
