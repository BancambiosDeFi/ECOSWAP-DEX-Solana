import React from 'react';
import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

interface TransactionLinkProps {
  signature: string;
  index: number;
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

const TransactionLink: React.FC<TransactionLinkProps> = ({ signature, index }) => {
  return (
    <>
      <TypographyStyled>
        <a
          key={index}
          style={{ textDecoration: 'none', fontWeight: 600 }}
          target="_blank"
          rel="noopener noreferrer"
          href={`https://solscan.io/tx/${signature}`}
        >
          Transaction {index}
        </a>
      </TypographyStyled>
    </>
  );
};

export default TransactionLink;
