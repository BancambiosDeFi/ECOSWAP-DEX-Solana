import React from 'react';
import { PublicKey } from '@solana/web3.js';
import Paper from '@mui/material/Paper';
import { makeStyles } from '@mui/styles';
import { useState } from 'react';
import { Box, List, Popper, TextField, Typography } from '@mui/material';
import { Autocomplete } from '@mui/lab';

import { useSwapContext } from '@serum/swap-ui';
import { ReactComponent as SearchIcon } from '../../../assets/icons/search.svg';
import { ReactComponent as ArrowRightIcon } from '../../../assets/icons/arrowRight.svg';
import { ReactComponent as PolygonIcon } from '../../../assets/icons/polygon.svg';
import { useContentContext } from '../ContentContext';

const useStyles = makeStyles(theme => ({
  paperStyle: ({ isInputFocus }: any) => ({
    background:
      'linear-gradient(#35363A, #35363A) padding-box, linear-gradient(266.19deg, #0156FF -9.56%, #EC26F5 102.3%) border-box !important',
    border: isInputFocus ? '3px solid transparent' : 'none',
  }),
  inputBase: {
    '& .MuiOutlinedInput-notchedOutline': {
      border: 'none',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      border: 'none',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      border: 'none',
    },
    'flex': 1,
    'ml': 1,
    'color': 'white !important',
    'fontFamily': '"Saira", sans-serif !important',
    'fontSize': '24px !important',
    'fontWeight': '700 !important',
    'opacity': 1,
    '&::placeholder': {
      fontFamily: '"Saira", sans-serif !important',
      fontSize: '24px !important',
      fontWeight: '700 !important',
      opacity: 1,
      paddingLeft: '15px',
      color: '#BDC1C6 !important',
    },
  },
  noBorder: {
    border: 'none',
  },
  paper: {
    position: 'absolute',
    left: '-317px',
    color: 'white',
    borderRadius: '40px !important',
    background: '#35363A !important',
    marginTop: '5px',
    padding: '30px',
    width: '600px',
    // display: 'flex',
    // alignItems: 'center !important',
    justifyContent: 'center !important',
  },
  listBox: {
    'maxHeight': '460px !important',
    'maxWidth': '600px !important',
    '&::-webkit-scrollbar': {
      left: '-50px',
      width: 10,
      borderRadius: '8px',
      boxShadow: 'inset 0 0 6px rgba(0,0,0,0.3)',
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: '#707070',
      borderRadius: '8px',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#c4c4c4',
      borderRadius: '8px',
      maxWidth: '60px',
    },
  },
  popupIcon: {
    width: '18px !important',
    height: '18px !important',
    marginRight: '10px !important',
  },
  searchIcon: {
    width: '20px',
    height: '20px',
    margin: '20px 0px 20px 20px',
  },
}));

export default function SearchForPairingsComponent({ type }) {
  const [isInputFocus, setInputFocus] = useState<boolean>(false);
  const classes = useStyles({ isInputFocus });
  const { pairs } = useContentContext();

  const handleFocus = () => {
    setInputFocus(!isInputFocus);
  };

  const PopperMy = function (props) {
    return <Popper {...props} style={{ position: 'relative', left: 417 }} />;
  };

  return (
    <Paper
      className={classes.paperStyle}
      sx={{
        p: '2px 4px',
        display: 'flex !important',
        alignItems: 'center !important',
        width: 600,
        height: 60,
        borderRadius: '20px',
        background: '#35363A',
      }}
    >
      <SearchIcon className={classes.searchIcon} />
      <Autocomplete
        PopperComponent={PopperMy}
        onFocus={handleFocus}
        onBlur={handleFocus}
        disableClearable
        className={classes.inputBase}
        options={pairs}
        fullWidth
        popupIcon={<PolygonIcon />}
        getOptionLabel={option => option.from.symbol + ' to ' + option.to.symbol}
        classes={{
          paper: classes.paper,
          // popper: classes.popper,
          input: classes.inputBase,
          listbox: classes.listBox,
          popupIndicator: classes.popupIcon,
        }}
        renderOption={(props, option) => <ListItem props={props} option={option} />}
        renderInput={params => (
          <TextField
            {...params}
            inputProps={{
              ...params.inputProps,
              autoComplete: 'new-password', // disable autocomplete and autofill
            }}
            placeholder={'Try : Sol to USDC'}
          />
        )}
      />
    </Paper>
  );
}

function ListItem({ props, option }) {
  const [errorDownloading, setErrorDownloading] = useState(false);
  const { setFromMint, setToMint } = useSwapContext();

  return (
    <List
      style={{
        maxWidth: '500px',
        height: '75px',
        display: errorDownloading ? 'none' : 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}
      component="li"
      onClickCapture={() => {
        const fromMint = new PublicKey(option.from.address);
        const toMint = new PublicKey(option.to.address);
        setFromMint(fromMint);
        setToMint(toMint);
      }}
      {...props}
    >
      <Box width="105" style={{ display: 'flex', justifyContent: 'column', alignItems: 'center' }}>
        <img
          loading="lazy"
          width="51"
          src={option.fromImg}
          alt=""
          onError={() => setErrorDownloading(true)}
        />
        <Typography
          style={{
            paddingLeft: '9px',
            fontFamily: '"Saira", sans-serif',
            fontSize: '24px',
            fontWeight: 700,
            color: 'white',
          }}
        >
          {option.from.symbol}
        </Typography>
      </Box>
      <ArrowRightIcon />
      <Box width="105" style={{ display: 'flex', justifyContent: 'column', alignItems: 'center' }}>
        <img
          loading="lazy"
          width="51"
          src={option.toImg}
          alt=""
          onError={() => setErrorDownloading(true)}
        />
        <Typography
          style={{
            paddingLeft: '9px',
            fontFamily: '"Saira", sans-serif',
            fontSize: '24px',
            fontWeight: 700,
            color: 'white',
          }}
        >
          {option.to.symbol}
        </Typography>
      </Box>
    </List>
  );
}
