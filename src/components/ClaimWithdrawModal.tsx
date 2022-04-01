import { Box, CircularProgress } from '@mui/material';
import React from 'react';
import FmdBadIcon from '@mui/icons-material/FmdBad';
import ButtonComponent from '../srm-components/Button/Button';
import ModalWrapper from './ModalWrapper';
import SubtitleText from './typography/SubtitleText';
import SmallText from './typography/SmallText';

interface CreateInvestorAccountModalProps {
  handleClose: () => void;
  isLoading: boolean;
  open: boolean;
  isError: boolean;
  errorMessage: string;
  wallet: string;
}

const ClaimWithdrawModal: React.FC<CreateInvestorAccountModalProps> = ({
  open,
  isLoading,
  isError,
  errorMessage,
  handleClose,
  wallet,
}) => {
  return (
    <ModalWrapper open={open} handleClose={handleClose} title="Withdrawing impact funds">
      {isError ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '70px',
          }}
        >
          <FmdBadIcon sx={{ color: 'rgb(183,82,230)', fontSize: 90, marginBottom: '10px' }} />
          <SubtitleText text={`Sorry, ${errorMessage.toLowerCase()}. Try again later.`} />
        </Box>
      ) : isLoading ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          <CircularProgress style={{ color: 'rgb(183,82,230)' }} thickness={6} size={50} />
          <SmallText style={{ p: 2 }} text={'Processing'} />
        </Box>
      ) : (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: { xs: 'stretch', md: 'center' },
            flexDirection: 'column',
            height: '100%',
            width: '100%',
          }}
        >
          <Box sx={{ p: { xs: 1, md: 3 } }}>
            <SubtitleText text={'Withdrawal of impact funds was successful on this wallet:'} />
            <SmallText
              style={{
                p: 1,
                backgroundColor: '#202124',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
              }}
              text={wallet}
            />
          </Box>
          <Box
            sx={{
              width: '100%',
              display: { xs: 'flex' },
              justifyContent: 'center',
            }}
          >
            <Box sx={{ width: '75%' }}>
              <ButtonComponent
                type="done"
                isIconVisible={false}
                onClick={handleClose}
                title="Done"
              />
            </Box>
          </Box>
        </Box>
      )}
    </ModalWrapper>
  );
};

export default ClaimWithdrawModal;
