import { Box, CircularProgress, Typography } from '@mui/material';
import React from 'react';
import ModalWrapper from './ModalWrapper';
import FmdBadIcon from '@mui/icons-material/FmdBad';
import ButtonComponent from '../srm-components/Button/Button';
import SubtitleText from './typography/SubtitleText';
import SmallText from './typography/SmallText';
import { styled } from '@mui/material/styles';

interface CreateInvestorAccountModalProps {
  handleClose: () => void;
  startSwapTransaction: () => void;
  isLoading: boolean;
  open: boolean;
  isError: boolean;
  errorMessage: string;
  transactionLink: string;
}

const TypographyStyled = styled(Typography)(() => ({
  fontFamily: '"Saira", sans-serif',
  fontSize: '12px',
  fontStyle: 'normal',
  fontWeight: 600,
  lineHeight: '19px',
  letterSpacing: '0em',
  textAlign: 'center',
  color: '#FFFFFF',
  marginTop: '10px',
}));

const SwapConfirmationModal: React.FC<CreateInvestorAccountModalProps> = ({
  open,
  isLoading,
  isError,
  errorMessage,
  handleClose,
  startSwapTransaction,
  transactionLink,
}) => {
  const transactionLinkElement = (
    <a
      style={{ textDecoration: 'none', fontWeight: 600 }}
      target="_blank"
      rel="noopener noreferrer"
      href={`https://solscan.io/tx/${transactionLink}`}
    >
      here
    </a>
  );

  return (
    <ModalWrapper open={open} handleClose={handleClose} title="Token swapping">
      {isError ? (
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <FmdBadIcon sx={{ color: 'rgb(183,82,230)', fontSize: 90, marginBottom: '10px' }} />
            <SubtitleText style={{ color: '#FFFFFF' }} text="Eco-contribution error" />
            <SmallText style={{ marginTop: '8px', color: '#FFFFFF' }} text={errorMessage} />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
            <ButtonComponent
              type="done"
              isIconVisible={false}
              onClick={handleClose}
              title="CANCEL"
            />
            <ButtonComponent
              type="done"
              isIconVisible={false}
              onClick={startSwapTransaction}
              title="CONTINUE"
            />
          </Box>
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
          <SubtitleText style={{ color: '#FFFFFF', p: 2 }} text="Transaction in progress" />
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
            <SubtitleText style={{ color: '#FFFFFF' }} text="Swap transaction was successful!" />
            <TypographyStyled>
              Please see the transaction details {transactionLinkElement}.
            </TypographyStyled>
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
                title="DONE"
              />
            </Box>
          </Box>
        </Box>
      )}
    </ModalWrapper>
  );
};

export default SwapConfirmationModal;
