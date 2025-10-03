import type { FC, ReactNode } from 'react';
import { Box, Typography, Divider } from '@mui/material';

/**
 * @interface IPageHeaderProps
 * @description Props for the PageHeader component.
 */
export interface IPageHeaderProps {
  /**
   * The main title to be displayed in the header.
   */
  title: string;
  /**
   * An optional description or subtitle to display below the main title.
   */
  description?: string;
  /**
   * Optional React node containing action buttons or other controls,
   * which will be rendered on the right side of the header.
   */
  actions?: ReactNode;
}

/**
 * A standardized component for rendering page titles and associated actions.
 *
 * This component ensures a consistent look and feel for the top of each page
 * within the admin dashboard. It provides a clear title, an optional description,
 * and a dedicated slot for action buttons (e.g., 'Add User', 'Export Data').
 *
 * Fulfills UI consistency requirements for pages specified in REQ-1-041, REQ-1-043, etc.
 *
 * @component
 * @param {IPageHeaderProps} props - The component props.
 * @returns {JSX.Element} The rendered page header.
 */
const PageHeader: FC<IPageHeaderProps> = ({ title, description, actions }) => {
  return (
    <Box component="header" mb={4}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'flex-start', md: 'center' },
          justifyContent: 'space-between',
          gap: 2,
          mb: 2,
        }}
      >
        <Box>
          <Typography variant="h4" component="h1" fontWeight="bold">
            {title}
          </Typography>
          {description && (
            <Typography variant="body1" color="text.secondary">
              {description}
            </Typography>
          )}
        </Box>
        {actions && <Box>{actions}</Box>}
      </Box>
      <Divider />
    </Box>
  );
};

export default PageHeader;