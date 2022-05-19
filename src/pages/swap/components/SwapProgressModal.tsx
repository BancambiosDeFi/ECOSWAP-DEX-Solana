import React from 'react';
import { Box, CircularProgress } from '@mui/material';
import SubtitleText from '../../../components/typography/SubtitleText';
import ModalWrapper from '../../../components/ModalWrapper';

interface SwapProgressModalProps {
  open: boolean;
  handleClose: () => void;
}

const SwapProgressModal: React.FC<SwapProgressModalProps> = ({ open, handleClose }) => {
  return (
    <ModalWrapper open={open} handleClose={handleClose} title="Token Swapping in progress">
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <CircularProgress style={{ color: '#0156FF' }} thickness={6} size={50} />
      </Box>
    </ModalWrapper>
  );
};

export default SwapProgressModal;
