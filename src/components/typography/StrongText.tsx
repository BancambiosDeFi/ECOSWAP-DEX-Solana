import React from 'react';
import { Typography } from '@mui/material';
import { styled, SxProps } from '@mui/material/styles';

interface TitleProps {
  text: string;
  style?: SxProps;
}

const TypographyStyled = styled(Typography)(() => ({
  fontFamily: '"Saira", sans-serif',
  fontSize: '16px',
  fontStyle: 'normal',
  fontWeight: 800,
  lineHeight: '40px',
  letterSpacing: '0em',
  textAlign: 'center',
}));

const SmallText: React.FC<TitleProps> = ({ text, style }) => {
  return <TypographyStyled sx={style}>{text}</TypographyStyled>;
};

export default SmallText;
