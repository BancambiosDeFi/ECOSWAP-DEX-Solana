import React from 'react';
import FmdBadIcon from '@mui/icons-material/FmdBad';
import { Box } from '@mui/material';
import ButtonComponent from '../../../srm-components/Button/Button';
import SubtitleText from '../../../components/typography/SubtitleText';
import SmallText from '../../../components/typography/SmallText';
import ModalWrapper from '../../../components/ModalWrapper';

interface EcoContributionErrorModalProps {
  open: boolean;
  errorMessage: string;
  handleClose: () => void;
  startSwapTransaction: () => Promise<void>;
}

const EcoContributionErrorModal: React.FC<EcoContributionErrorModalProps> = ({
  open,
  errorMessage,
  handleClose,
  startSwapTransaction,
}) => {
  return (
    <ModalWrapper open={open} handleClose={handleClose} title="Token swapping">
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
          <SubtitleText style={{ color: '#FFFFFF' }} text={'Eco-contribution error'} />
          <SmallText style={{ marginTop: '8px', color: '#FFFFFF' }} text={errorMessage} />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
          <ButtonComponent type="done" isIconVisible={false} onClick={handleClose} title="CANCEL" />
          <ButtonComponent
            type="done"
            isIconVisible={false}
            onClick={startSwapTransaction}
            title="CONTINUE"
          />
        </Box>
      </Box>
    </ModalWrapper>
  );
};

export default EcoContributionErrorModal;
