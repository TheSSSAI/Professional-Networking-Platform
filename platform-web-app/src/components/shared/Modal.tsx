import React, { ReactNode } from 'react';
import {
  Modal as MuiModal,
  Box,
  Typography,
  IconButton,
  Divider,
  Fade,
  Backdrop,
  styled,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface ModalProps {
  /**
   * If `true`, the modal is open.
   */
  isOpen: boolean;
  /**
   * Callback fired when the component requests to be closed.
   */
  onClose: () => void;
  /**
   * The title of the modal, displayed in the header.
   */
  title: string;
  /**
   * The content of the modal.
   */
  children: ReactNode;
  /**
   * Optional content to be displayed in the modal's footer, e.g., action buttons.
   */
  footerContent?: ReactNode;
  /**
   * The maximum width of the modal.
   * @default 'sm'
   */
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
}

const ModalContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[24],
  display: 'flex',
  flexDirection: 'column',
  maxHeight: '90vh',
  overflow: 'hidden',
}));

const ModalHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(2, 3),
  flexShrink: 0,
}));

const ModalContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(0, 3, 3),
  overflowY: 'auto',
}));

const ModalFooter = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(2, 3),
  gap: theme.spacing(2),
  flexShrink: 0,
}));

/**
 * A shared, structured Modal component that wraps MUI's Modal.
 * It provides a consistent layout with a header, content area, and optional footer,
 * while enforcing accessibility best practices.
 */
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footerContent,
  maxWidth = 'sm',
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const modalId = `modal-title-${title.replace(/\s+/g, '-').toLowerCase()}`;
  const modalDescriptionId = `modal-description-${title.replace(/\s+/g, '-').toLowerCase()}`;


  return (
    <MuiModal
      open={isOpen}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
      aria-labelledby={modalId}
      aria-describedby={modalDescriptionId}
    >
      <Fade in={isOpen}>
        <ModalContainer sx={{ width: isMobile ? '95%' : theme.breakpoints.values[maxWidth || 'sm'] }}>
          <ModalHeader>
            <Typography id={modalId} variant="h6" component="h2" fontWeight={600}>
              {title}
            </Typography>
            <IconButton
              aria-label="close modal"
              onClick={onClose}
              sx={{
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          </ModalHeader>
          <Divider />
          <ModalContent>
            <Box id={modalDescriptionId} sx={{ mt: 2 }}>
                {children}
            </Box>
          </ModalContent>
          {footerContent && (
            <>
              <Divider />
              <ModalFooter>
                {footerContent}
              </ModalFooter>
            </>
          )}
        </ModalContainer>
      </Fade>
    </MuiModal>
  );
};