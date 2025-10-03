import type { FC } from 'react';
import { Skeleton, Stack, Box } from '@mui/material';
import type { SkeletonProps } from '@mui/material';

/**
 * @interface ISkeletonLoaderProps
 * @description Props for the SkeletonLoader component.
 */
export interface ISkeletonLoaderProps {
  /**
   * The number of skeleton items to render.
   * @default 1
   */
  count?: number;
  /**
   * The variant of the skeleton.
   * @see {@link SkeletonProps.variant}
   * @default 'text'
   */
  variant?: SkeletonProps['variant'];
  /**
   * The height of each skeleton item. Can be a number (pixels) or a string.
   */
  height?: number | string;
  /**
   * The width of each skeleton item. Can be a number (pixels) or a string.
   */
  width?: number | string;
  /**
   * The spacing between skeleton items if count > 1.
   * @default 1
   */
  spacing?: number;
  /**
   * Additional sx props to be applied to the container Box.
   */
  sx?: SkeletonProps['sx'];
}

/**
 * A reusable skeleton loader component for indicating loading states.
 * This component abstracts MUI's Skeleton to provide a simple, repeatable
 * pattern for placeholders across the application.
 *
 * It supports rendering multiple skeleton items with configurable shape, size, and spacing.
 * This is crucial for improving perceived performance on data-heavy pages like data tables.
 *
 * @component
 * @param {ISkeletonLoaderProps} props - The component props.
 * @returns {JSX.Element} The rendered skeleton loader.
 */
const SkeletonLoader: FC<ISkeletonLoaderProps> = ({
  count = 1,
  variant = 'text',
  height = 40,
  width,
  spacing = 2,
  sx,
}) => {
  // Create an array to map over for rendering multiple skeletons
  const skeletons = Array.from({ length: count });

  return (
    <Box sx={sx}>
      <Stack spacing={spacing}>
        {skeletons.map((_, index) => (
          <Skeleton
            key={index}
            variant={variant}
            height={height}
            width={width}
            animation="wave"
          />
        ))}
      </Stack>
    </Box>
  );
};

export default SkeletonLoader;