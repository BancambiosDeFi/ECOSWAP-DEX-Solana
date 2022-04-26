import React from 'react';
import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowTopRight from '../assets/icons/arrow-down-left.svg';

interface TransactionLinkProps {
  signature: string;
}

const TypographyStyled = styled(Typography)(() => ({
  fontFamily: '"Saira", sans-serif',
  fontSize: '16px',
  fontStyle: 'normal',
  fontWeight: 800,
  lineHeight: '40px',
  letterSpacing: '0em',
  textAlign: 'left',
  color: '#FFFFFF',
  marginTop: '10px',
}));

const TransactionLink: React.FC<TransactionLinkProps> = ({ signature }) => {
  return (
    <>
      <TypographyStyled>
        <a
          style={{
            textDecoration: 'none',
            fontWeight: 600,
            textAlign: 'center',
            color: 'rgba(189, 193, 198, 1)',
          }}
          target="_blank"
          rel="noopener noreferrer"
          href={`https://solscan.io/tx/${signature}`}
        >
          View on Solscan <img alt={'logo'} src={ArrowTopRight} style={{ marginLeft: '4px' }} />
        </a>
      </TypographyStyled>
    </>
  );
};

export default TransactionLink;
