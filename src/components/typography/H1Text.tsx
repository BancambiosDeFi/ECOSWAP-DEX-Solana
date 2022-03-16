import React from 'react';
import { Typography } from '@mui/material';
import { styled, SxProps } from '@mui/material/styles';

interface TitleProps {
  text: string;
  style?: SxProps;
}

const TypographyStyled = styled(Typography)(() => ({
  fontFamily: '"Spy Agency", sans-serif',
  fontSize: '64px',
  fontStyle: 'normal',
  fontWeight: 700,
  lineHeight: '80px',
  letterSpacing: '0em',
  textAlign: 'center',
}));

const H1Text: React.FC<TitleProps> = ({ text, style }) => {
  return <TypographyStyled sx={style}>{text}</TypographyStyled>;
};

export default H1Text;
