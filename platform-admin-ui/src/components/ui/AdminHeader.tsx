import type { FC, ReactNode } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AdbIcon from '@mui/icons-material/Adb';

/**
 * @interface IAdminHeaderProps
 * @description Props for the AdminHeader component.
 */
export interface IAdminHeaderProps {
  /**
   * Callback function to handle the toggling of the mobile navigation drawer.
   */
  onDrawerToggle: () => void;
  /**
   * Optional React node for user-related controls, such as a profile menu,
   * which will be rendered on the right side of the header.
   */
  userMenu?: ReactNode;
}

/**
 * The main application header for the Admin Dashboard.
 *
 * This component is part of the main `AdminLayout` and provides a consistent
 * top bar across all authenticated pages. It includes the application title/logo,
 * a toggle button for mobile navigation, and a slot for user-specific actions.
 * Its design must be responsive as per REQ-1-060.
 *
 * @component
 * @param {IAdminHeaderProps} props - The component props.
 * @returns {JSX.Element} The rendered admin header.
 */
const AdminHeader: FC<IAdminHeaderProps> = ({ onDrawerToggle, userMenu }) => {
  const theme = useTheme();

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: theme.zIndex.drawer + 1,
        backgroundColor: 'background.paper',
        color: 'text.primary',
        boxShadow: theme.shadows[1],
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
      elevation={0}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onDrawerToggle}
          sx={{ mr: 2, display: { md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        <AdbIcon sx={{ display: 'flex', mr: 1, color: 'primary.main' }} />
        <Typography
          variant="h6"
          noWrap
          component="a"
          href="/dashboard"
          sx={{
            mr: 2,
            display: 'flex',
            fontFamily: 'monospace',
            fontWeight: 700,
            letterSpacing: '.3rem',
            color: 'inherit',
            textDecoration: 'none',
          }}
        >
          ADMIN
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        {userMenu && <Box>{userMenu}</Box>}
      </Toolbar>
    </AppBar>
  );
};

export default AdminHeader;