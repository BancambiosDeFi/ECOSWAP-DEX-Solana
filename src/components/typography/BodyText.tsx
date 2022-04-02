import React from 'react';
import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { SxProps } from '@mui/system';

interface TitleProps {
  text: string;
  style?: SxProps;
}

const TypographyStyled = styled(Typography)(() => ({
  fontFamily: '"Saira", sans-serif',
  fontSize: '16px',
  fontStyle: 'normal',
  fontWeight: 400,
  lineHeight: '29px',
  letterSpacing: '0em',
  textAlign: 'center',
}));

const BodyText: React.FC<TitleProps> = ({ text, style }) => {
  return <TypographyStyled sx={style}>{text}</TypographyStyled>;
};

export default BodyText;
