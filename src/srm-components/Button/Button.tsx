/* eslint-disable max-len */
import React, { FC } from 'react';
import { Button } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { styled } from '@mui/material/styles';
import styles from './Button.module.css';

export interface ButtonProps {
  type: string;
  title: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  isIconVisible?: boolean;
  disable?: boolean;
  loading?: boolean;
}

const ButtonLoader = styled('div')({
  '&': {
    display: 'flex',
    justifyContent: 'center',
  },
  '.loader': {
    color: 'rgb(127, 70, 251)',
  },
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ConnectSwapButton = styled(Button)(({ theme }) => ({
  'height': '64px',
  'width': '100%',
  'maxHeight': '64px',
  'maxWidth': '434px',
  'color': '#FFFFFF',
  'background': 'rgba(1, 86, 255, 0.3)',
  'borderRadius': '8px',
  'border': 'solid 3px transparent',
  'backgroundImage':
    'linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)), linear-gradient(101deg, #EC26F5, #0156FF)',
  'backgroundOrigin': 'border-box',
  'backgroundClip': 'content-box, border-box',
  'boxShadow': '2px 500px rgb(3, 46, 131) inset',
  // #0156FF
  'textTransform': 'none',
  'fontFamily': '"Spy Agency", sans-serif',
  'fontSize': '20px',
  'fontStyle': 'normal',
  'textAlign': 'center',
  '&:hover': {
    border: 'none',
    borderColor: 'rgb(127, 70, 251)',
    background: 'linear-gradient(257.52deg, #0156FF -5.37%, #9F5AE5 84.69%)',
    boxShadow: '0px 0px 16px #9F5AE5',
  },
}));

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SwapButton = styled(Button)(({ theme }) => ({
  'height': '64px',
  'width': '100%',
  'maxHeight': '64px',
  'maxWidth': '434px',
  'color': '#FFFFFF',
  'background': 'rgba(1, 86, 255, 0.3)',
  'borderRadius': '8px',
  'border': 'solid 3px transparent',
  'backgroundImage':
    'linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)), linear-gradient(101deg, #EC26F5, #0156FF)',
  'backgroundOrigin': 'border-box',
  'backgroundClip': 'content-box, border-box',
  'boxShadow': '2px 500px rgb(3, 46, 131) inset',
  'textTransform': 'none',
  'fontFamily': '"Spy Agency", sans-serif',
  'fontSize': '20px',
  'fontStyle': 'normal',
  'fontWeight': 112,
  'letterSpacing': '-0.01em',
  'textAlign': 'center',
  '&:hover': {
    border: 'none',
    borderColor: 'rgb(203, 72, 239)',
    background: 'linear-gradient(266.19deg, #F337F8 -9.56%, #9F5AE5 102.3%)',
    boxShadow: '0px 0px 16px #9F5AE5',
  },
  '&:disabled': {
    color: '#FFFFFF',
    opacity: '0.5',
  },
}));

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const DoneButton = styled(Button)(({ theme }) => ({
  'height': '100%',
  'width': '100%',
  'maxHeight': '51px',
  'maxWidth': '169px',
  'color': '#FFFFFF',
  'background':
    // eslint-disable-next-line max-len
    'linear-gradient(black, black) padding-box, linear-gradient(266.19deg, #EC26F5 -9.56%, #9F5AE5 102.3%) border-box',
  'borderRadius': '17px',
  'border': '2px solid transparent',
  'textTransform': 'none',
  'fontFamily': '"Saira", sans-serif',
  'fontSize': '16px',
  'fontStyle': 'normal',
  'fontWeight': 400,
  'lineHeight': '29px',
  'letterSpacing': '-0.01em',
  'textAlign': 'center',
  '&:hover': {
    background:
      // eslint-disable-next-line max-len
      'linear-gradient(250.38deg, #EC26F5 -1.07%, #9F5AE5 92.17%) padding-box, linear-gradient(250.38deg, #EC26F5 -1.07%, #9F5AE5 92.17%) border-box',
    boxShadow: '0px 0px 16px #9F5AE5',
  },
}));

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const LaunchTheAppButton = styled(Button)(({ theme }) => ({
  'height': '100%',
  'width': '100%',
  'maxHeight': '60px',
  'maxWidth': '602px',
  'color': '#FFFFFF',
  'background':
    // eslint-disable-next-line max-len
    'linear-gradient(black, black) padding-box, linear-gradient(266.19deg, #EC26F5 -9.56%, #9F5AE5 102.3%) border-box',
  'borderRadius': '20px',
  'border': '2px solid transparent',
  'textTransform': 'none',
  'fontFamily': '"Spy Agency", sans-serif',
  'fontSize': '24px',
  'fontStyle': 'normal',
  'fontWeight': 400,
  'lineHeight': '30px',
  'letterSpacing': '-0.01em',
  'textAlign': 'center',
  '&:hover': {
    background:
      // eslint-disable-next-line max-len
      'linear-gradient(250.38deg, #EC26F5 -1.07%, #9F5AE5 92.17%) padding-box, linear-gradient(250.38deg, #EC26F5 -1.07%, #9F5AE5 92.17%) border-box',
    boxShadow: '0px 0px 16px #9F5AE5',
  },
}));

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SubscribeButton = styled(Button)(({ theme }) => ({
  'height': '100%',
  'width': '100%',
  'maxHeight': '50px',
  'maxWidth': '297px',
  'color': '#FFFFFF',
  'background': '#0056FD',
  'borderRadius': '26px',
  'border': '3px solid transparent',
  '&:hover': {
    background:
      'linear-gradient(257.52deg, #0156FF -5.37%, #9F5AE5 84.69%) padding-box, linear-gradient(257.52deg, #0156FF -5.37%, #9F5AE5 84.69%) border-box',
    boxShadow: '0px 0px 16px #9F5AE5',
  },
}));

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ConnectButton = styled(Button)(({ theme }) => ({
  'height': '100%',
  'width': '100%',
  'maxHeight': '41px',
  'maxWidth': '163px',
  'color': '#FFFFFF',
  'background': '#0056FD',
  'borderRadius': '36px',
  'border': '3px solid transparent',
  'textTransform': 'none',
  'fontFamily': '"Spy Agency", sans-serif',
  'fontSize': '11px',
  'fontStyle': 'normal',
  'fontWeight': 112,
  'letterSpacing': '-0.01em',
  'textAlign': 'center',
  '&:hover': {
    background:
      'linear-gradient(257.52deg, #0156FF -5.37%, #9F5AE5 84.69%) padding-box, linear-gradient(257.52deg, #0156FF -5.37%, #9F5AE5 84.69%) border-box',
    boxShadow: '0px 0px 16px #9F5AE5',
  },
}));

const ButtonComponent: FC<ButtonProps> = ({
  type,
  title,
  onClick,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isIconVisible = true,
  disable = false,
  loading = false,
}) => {
  let StyledButton: any;

  if (type === 'connectSwap') {
    StyledButton = ConnectSwapButton;
  } else if (type === 'swap') {
    StyledButton = SwapButton;
  } else if (type === 'launch') {
    StyledButton = LaunchTheAppButton;
  } else if (type === 'subscribe') {
    StyledButton = SubscribeButton;
  } else if (type === 'connect') {
    StyledButton = ConnectButton;
  } else {
    StyledButton = DoneButton;
  }

  return (
    <div className={disable ? styles.button_disable_container : styles.button_container}>
      <StyledButton onClick={onClick} disabled={disable}>
        {loading ? (
          <ButtonLoader>
            <CircularProgress className="loader" />
          </ButtonLoader>
        ) : (
          title
        )}
      </StyledButton>
    </div>
  );
};

export default ButtonComponent;
