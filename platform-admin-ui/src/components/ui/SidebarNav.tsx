'use client';

import type { FC } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  styled,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GavelIcon from '@mui/icons-material/Gavel';
import PeopleIcon from '@mui/icons-material/People';
import HistoryIcon from '@mui/icons-material/History';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import SettingsIcon from '@mui/icons-material/Settings';

/**
 * @interface INavItem
 * @description Defines the structure for a navigation item in the sidebar.
 */
interface INavItem {
  text: string;
  href: string;
  icon: JSX.Element;
}

const navItems: INavItem[] = [
  { text: 'Dashboard', href: '/dashboard', icon: <DashboardIcon /> },
  { text: 'Moderation', href: '/moderation', icon: <GavelIcon /> },
  { text: 'Users', href: '/users', icon: <PeopleIcon /> },
  { text: 'Audit Log', href: '/audit-log', icon: <HistoryIcon /> },
  { text: 'Feature Flags', href: '/settings/feature-flags', icon: <ToggleOnIcon /> },
];

const StyledListItemButton = styled(ListItemButton)<{ selected: boolean }>(({ theme, selected }) => ({
    ...(selected && {
      backgroundColor: theme.palette.action.selected,
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: theme.palette.primary.main,
        fontWeight: 600,
      },
    }),
  }),
);


/**
 * The primary navigation component for the Admin Dashboard sidebar.
 *
 * This component renders the list of navigation links that allow administrators
 * to move between the different sections of the application (e.g., Dashboard, Moderation).
 * It uses the Next.js `usePathname` hook to highlight the currently active route,
 * providing clear visual feedback to the user.
 *
 * @component
 * @returns {JSX.Element} The rendered sidebar navigation.
 */
const SidebarNav: FC = () => {
  const pathname = usePathname();

  return (
    <Box>
      <Toolbar />
      <List component="nav">
        {navItems.map((item) => {
          const isSelected = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <ListItem key={item.text} disablePadding>
              <StyledListItemButton
                component={Link}
                href={item.href}
                selected={isSelected}
                aria-current={isSelected ? 'page' : undefined}
              >
                <ListItemIcon sx={{ minWidth: '40px' }}>
                    {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </StyledListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};

export default SidebarNav;