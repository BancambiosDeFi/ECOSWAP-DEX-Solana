import React from 'react';
import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { SxProps } from '@mui/system';

interface TitleProps {
  text: string;
  style?: SxProps;
}

const TypographyStyled = styled(Typography)(() => ({
  fontFamily: 'Saira',
  fontSize: '24px',
  fontWeight: 500,
  lineHeight: '38px',
  letterSpacing: '0em',
  textAlign: 'center',
}));

const H3Text: React.FC<TitleProps> = ({ text, style }) => {
  return <TypographyStyled sx={style}>{text}</TypographyStyled>;
};

export default H3Text;
