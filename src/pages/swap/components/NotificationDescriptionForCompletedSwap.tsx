import React from 'react';
import { Box, Typography } from '@mui/material';
import { MintInfo } from '@solana/spl-token';
import TransactionLink from '../../../components/TransactionLink';
import { getFormattedAmount } from '../../../utils';

interface CompletedSwapDescriptionProps {
  signature: string;
  fromAmount: number;
  toAmount: number;
  fromMintAccount: MintInfo | undefined | null;
  toMintAccount: MintInfo | undefined | null;
  fromTokenSymbol: string | undefined;
  toTokenSymbol: string | undefined;
}

const NotificationDescriptionForCompletedSwap: React.FC<CompletedSwapDescriptionProps> = ({
  signature,
  fromAmount,
  toAmount,
  fromMintAccount,
  toMintAccount,
  fromTokenSymbol,
  toTokenSymbol,
}) => {
  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'left',
        justifyContent: 'center',
      }}
    >
      <Typography
        sx={{
          fontFamily: '"Saira", sans-serif',
          fontSize: '16px',
          fontStyle: 'normal',
          fontWeight: 400,
          lineHeight: '29px',
          letterSpacing: '0em',
          textAlign: 'left',
        }}
      >
        You traded{' '}
        <b>
          {getFormattedAmount(fromMintAccount, fromAmount)} {fromTokenSymbol}
        </b>{' '}
        for at least{' '}
        <b>
          {getFormattedAmount(toMintAccount, toAmount)} {toTokenSymbol}
        </b>
        .
      </Typography>
      <TransactionLink signature={signature} />
    </Box>
  );
};

export default NotificationDescriptionForCompletedSwap;
