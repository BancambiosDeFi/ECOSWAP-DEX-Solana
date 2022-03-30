import React, { useState, useCallback } from 'react';
import { PublicKey } from '@solana/web3.js';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import { makeStyles } from '@mui/styles';
import { autocompleteClasses, Box, List, Popper, TextField, Typography } from '@mui/material';
import { Autocomplete } from '@mui/lab';

// eslint-disable-next-line import/no-unresolved
import { useTokenMap, useSwapContext } from '@serum/swap-ui';
import { getRaydiumAllPoolKeysFetcher } from '../../../utils/raydiumRequests';
import { useConnection } from '../../../srm-utils/connection';
import { ReactComponent as SearchIcon } from '../../../assets/icons/search.svg';
import { ReactComponent as ArrowRightIcon } from '../../../assets/icons/arrowRight.svg';
import { ReactComponent as PolygonIcon } from '../../../assets/icons/polygon.svg';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const useStyles = makeStyles(theme => ({
  paperStyle: ({ isInputFocus }: any) => ({
    background:
      // eslint-disable-next-line max-len
      'linear-gradient(#202124, #202124) padding-box, linear-gradient(266.19deg, #0156FF -9.56%, #EC26F5 102.3%) border-box !important',
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
    border: '1px solid #0156FF',
    borderRadius: '8px',
    background: '#0A0C0E !important',
    marginTop: '5px',
    padding: '15px',
    width: '600px',
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
  loaderWrap: {
    display: 'flex',
    justifyContent: 'center',
  },
  loader: {
    '&&': {
      color: 'rgb(127, 70, 251)',
    },
  },
}));

const REQUIRED_PAIRS_QTY = 120;

interface TokenPair {
  from: {
    symbol: string;
    address: string;
  };
  fromImg?: string;
  to: {
    symbol: string;
    address: string;
  };
  toImg?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function SearchForPairingsComponent({ type, width }) {
  const [isInputFocus, setInputFocus] = useState<boolean>(false);
  const classes = useStyles({ isInputFocus });
  const [pairs, setPairs] = useState<TokenPair[]>([]);
  const [loader, setLoader] = useState<boolean>(false);
  const connection = useConnection();
  const tokenMap = useTokenMap();
  const widthComponent = width === 'auto' ? '430' : 600;
  const marginComponent = width === 'auto' ? '18px' : '0px';

  const handleFocus = () => {
    setInputFocus(!isInputFocus);
  };

  const PopperMy = function (props) {
    return (
      <Popper
        {...props}
        style={{
          position: 'relative',
          left: 417,
        }}
      />
    );
  };

  const fetchPairs = useCallback(async () => {
    const numberOfRetries = 3;
    const fetchPoolKeys = getRaydiumAllPoolKeysFetcher(connection, numberOfRetries);

    setLoader(true);
    try {
      const poolKeys = await fetchPoolKeys();
      const requiredQtyOfPoolKeys = poolKeys.slice(0, REQUIRED_PAIRS_QTY);
      const fetchedPairs = requiredQtyOfPoolKeys
        .reduce((swapPairs: TokenPair[], poolKey) => {
          const fromToken = tokenMap.get(poolKey.baseMint.toString());
          const toToken = tokenMap.get(poolKey.quoteMint.toString());
          if (fromToken && toToken) {
            swapPairs.push({
              from: {
                symbol: fromToken?.symbol,
                address: fromToken?.address,
              },
              fromImg: fromToken?.logoURI,
              to: {
                symbol: toToken?.symbol,
                address: toToken?.address,
              },
              toImg: toToken?.logoURI,
            });
          }

          return swapPairs;
        }, [])
        .filter(pair => pair.fromImg && pair.toImg);

      setLoader(false);
      setPairs(fetchedPairs);
    } catch (error) {
      console.log(error);
      setLoader(false);
    }
  }, [connection]);

  return (
    <Paper
      role="isExistSearchComponent"
      className={classes.paperStyle}
      sx={{
        p: '2px 4px',
        display: 'flex !important',
        alignItems: 'center !important',
        width: widthComponent,
        height: 60,
        borderRadius: '8px',
        background: '#202124',
        margin: marginComponent,
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
        onOpen={() => {
          if (!pairs.length) {
            fetchPairs();
          }
        }}
        loading={loader}
        loadingText={<CircularProgress className={classes.loader} />}
        // noOptionsText="noOptionsText..."
        popupIcon={<PolygonIcon />}
        getOptionLabel={option => option.from.symbol + ' to ' + option.to.symbol}
        classes={{
          paper: classes.paper,
          // popper: classes.popper,
          input: classes.inputBase,
          listbox: classes.listBox,
          popupIndicator: classes.popupIcon,
          loading: classes.loaderWrap,
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
        width: '100%',
        height: '75px',
        display: errorDownloading ? 'none' : 'grid',
        gridTemplateColumns: '2fr 1fr 1fr',
      }}
      component="li"
      onClickCapture={() => {
        const fromMint = new PublicKey(option.from.address);
        const toMint = new PublicKey(option.to.address);
        setFromMint(fromMint);
        setToMint(toMint);
      }}
      key={`${option.from.symbol}/${option.to.symbol}`}
      {...props}
    >
      <Box width="105" style={{ display: 'flex', justifyContent: 'column', alignItems: 'center' }}>
        <img
          loading="lazy"
          width="45px"
          height="45px"
          src={option.fromImg}
          alt=""
          onError={() => setErrorDownloading(true)}
        />
        <Typography
          style={{
            paddingLeft: '9px',
            fontFamily: '"Saira", sans-serif',
            fontSize: '20px',
            fontWeight: 700,
            color: 'white',
          }}
        >
          {option.from.symbol}
        </Typography>
      </Box>
      <ArrowRightIcon />
      <Box width="105" style={{ display: 'flex', justifyContent: 'column', alignItems: 'end' }}>
        <img
          loading="lazy"
          width="45px"
          src={option.toImg}
          alt=""
          onError={() => setErrorDownloading(true)}
        />
        <Typography
          style={{
            paddingLeft: '9px',
            fontFamily: '"Saira", sans-serif',
            fontSize: '20px',
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
