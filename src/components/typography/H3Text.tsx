import React from 'react';
import { Typography } from '@mui/material';
import { styled, SxProps } from '@mui/material/styles';

interface TitleProps {
  text: string;
  style?: SxProps;
}

const TypographyStyled = styled(Typography)(() => ({
  fontFamily: '"Saira", sans-serif',
  fontSize: '24px',
  fontStyle: 'normal',
  fontWeight: 400,
  lineHeight: '34px',
  letterSpacing: '0em',
  textAlign: 'center',
}));

const H3Text: React.FC<TitleProps> = ({ text, style }) => {
  return <TypographyStyled sx={style}>{text}</TypographyStyled>;
};

export default H3Text;
