import { Flex, Menu, MenuButton } from '@chakra-ui/react';
import { IconCheck, IconChevronDown } from '@tabler/icons';
import { AppMenu, AppMenuItem, AppMenuList } from '../styles/components-styles';

/*
 * Module for displaying dropdown menu
 * @param options - array of options
 * @param title - title of dropdown menu
 * @param currentOption - current option
 */
const DropdownMenu = ({ options, title, currentOption }: any) => {
  return (
    <Menu>
      <MenuButton as={AppMenu} rightIcon={<IconChevronDown />}>
        {title}
      </MenuButton>
      <AppMenuList>
        {options.map((option: any) => (
          <AppMenuItem
            key={option.value}
            className={currentOption == option.value ? 'isActive' : ''}
            onClick={option.function}>
            <Flex alignItems="center" gap={2}>
              {currentOption === option.value ? <IconCheck /> : null} {option.title}
            </Flex>
          </AppMenuItem>
        ))}
      </AppMenuList>
    </Menu>
  );
};

export default DropdownMenu;
