import React, { forwardRef } from 'react';
import {
  Button as MuiButton,
  ButtonProps as MuiButtonProps,
  CircularProgress,
  styled,
} from '@mui/material';

export interface ButtonProps extends MuiButtonProps {
  /**
   * If `true`, a loading indicator is shown.
   * @default false
   */
  loading?: boolean;
}

const StyledButton = styled(MuiButton)<ButtonProps>(({ theme, ownerState }) => ({
  ...(ownerState.loading && {
    color: 'transparent', // Hide button text
  }),
}));

const ButtonContent = styled('span')({
  position: 'relative',
  display: 'inherit',
  alignItems: 'inherit',
  justifyContent: 'inherit',
});

const LoadingSpinner = styled(CircularProgress)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  marginTop: '-12px',
  marginLeft: '-12px',
  color: theme.palette.primary.contrastText, // Default for contained primary
}));

/**
 * A shared Button component that wraps MUI's Button and adds a `loading` state.
 * It enforces consistent styling and behavior across the application.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      loading = false,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <StyledButton
        ref={ref}
        disabled={disabled || loading}
        ownerState={{ loading }}
        {...props}
      >
        <ButtonContent>
          {children}
        </ButtonContent>
        {loading && (
          <LoadingSpinner 
            size={24} 
            thickness={4} 
            color={props.color === 'inherit' || props.variant === 'outlined' || props.variant === 'text' ? 'primary' : 'inherit'} 
          />
        )}
      </StyledButton>
    );
  }
);

Button.displayName = 'Button';