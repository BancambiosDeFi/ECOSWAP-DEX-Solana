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
    <ModalWrapper open={open} handleClose={handleClose} title="Token swapping">
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <CircularProgress style={{ color: 'rgb(183,82,230)' }} thickness={6} size={50} />
        <SubtitleText style={{ color: '#FFFFFF', p: 2 }} text="Transaction in progress" />
      </Box>
    </ModalWrapper>
  );
};

export default SwapProgressModal;
