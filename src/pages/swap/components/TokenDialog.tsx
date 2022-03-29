import React, { useState, useEffect, useMemo } from 'react';
import { PublicKey } from '@solana/web3.js';
import { TokenInfo } from '@solana/spl-token-registry';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';

// eslint-disable-next-line import/no-unresolved
import { useTokenMap } from '@serum/swap-ui';
import { ReactComponent as SearchIcon } from '../../../assets/icons/search.svg';

// TODO: replace '&&' with styled components
const useStyles = makeStyles(() => ({
  displayNone: {
    '&&': { display: 'none' },
  },
  scrollBar: {
    '&::-webkit-scrollbar': {
      width: 10,
      borderRadius: '8px',
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: '#707070',
      borderRadius: '8px',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#c4c4c4',
      borderRadius: '8px',
    },
  },
  dialogWrapper: {
    '&&': {
      backgroundColor: '#040506',
      position: 'absolute',
      top: '100px',
      width: '390px',
      maxHeight: '660px',
      padding: '40px',
      border: '1px solid #0156FF',
      borderRadius: '8px',
    },
  },
  dialogContent: {
    '&&': { padding: 0, border: 0, overflowX: 'hidden' },
  },
  dialogList: {
    '&&': {
      display: 'flex',
      flexWrap: 'wrap',
      width: '100%',
      boxSizing: 'border-box',
      padding: '0',
      marginTop: '-10px',
    },
  },
  dialogListItem: {
    '&&': {
      'display': 'flex',
      'width': '48%',
      'padding': '10px 2% 10px 0',
      'color': '#fff',

      '&:hover': {
        backgroundColor: 'rgb(189,193,198, 0.1)',
      },
    },
  },
  dialogListTokenNameWrap: {
    '&&': { marginLeft: '16px', overflow: 'hidden' },
  },
  dialogListTokenName: {
    '&&': {
      fontSize: '20px',
      lineHeight: '40px',
      fontWeight: 700,
      fontFamily: '"Saira", sans-serif',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
    },
  },
  dialogTitle: {
    '&&': { position: 'relative', padding: 0, marginBottom: '15px', height: '50px' },
  },
  dialogTitleTextField: {
    '&&': {
      'height': '100%',
      'boxSizing': 'border-box',
      '& .MuiTextField-root': {
        height: '100%',
      },
      '& .MuiOutlinedInput-notchedOutline': {
        border: 0,
      },
    },
  },
  dialogTitleInput: {
    '&&': {
      'position': 'relative',
      'height': '100%',
      'color': '#bdc1c6',
      'fontWeight': 600,
      'boxSizing': 'border-box',
      'padding': '16px 14px 16px 55px',
      'background': '#1e2022',
      'borderRadius': '16px',

      '&::placeholder': {
        fontFamily: '"Saira", sans-serif',
        fontSize: '18px',
        fontWeight: 700,
        opacity: 1,
        paddingLeft: '15px',
      },
    },
  },
  dialogTitleSearchIcon: {
    '&&': {
      position: 'absolute',
      width: '25px',
      height: '25px',
      top: '50%',
      left: '25px',
      transform: 'translate(0, -50%)',
    },
  },
  tokenIconSmall: { '&&': { width: '25px', height: '25px', borderRadius: '15px' } },
  tokenIconBig: { '&&': { width: '40px', height: '40px', borderRadius: '15px' } },
  dialogActions: {
    '&&': { marginBottom: '30px', padding: 0 },
  },
  commonBaseWrap: {
    '&&': {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
    },
  },
  commonBaseList: {
    '&&': {
      display: 'flex',
      justifyContent: 'space-between',
    },
  },
  commonBaseTitle: {
    '&&': {
      color: '#fff',
      fontSize: '14px',
      fontWeight: 800,
      marginBottom: '10px',
    },
  },
  commonBaseToken: {
    '&&': {
      display: 'flex',
      alignItems: 'center',
      borderRadius: '20px',
      background: '#707070',
      padding: '7px 12px',
      cursor: 'pointer',
    },
  },
  commonBaseTokenNameWrap: {
    '&&': {
      marginLeft: '5px',
    },
  },
  commonBaseTokenName: {
    '&&': {
      fontSize: '16px',
      lineHeight: '16px',
      fontWeight: 700,
      fontFamily: '"Saira", sans-serif',
      color: '#fff',
    },
  },
}));

const COMMON_BASE_TOKENS: string[] = ['Native SOL', 'USDT', 'USD Coin'];

export default function TokenDialog({
  open,
  onClose,
  setMint,
  tokenList = [],
}: {
  open: boolean;
  onClose: () => void;
  setMint: (mint: PublicKey) => void;
  tokenList: TokenInfo[];
}) {
  const [tokenFilter, setTokenFilter] = useState('');
  const [commonBaseTokens, setCommonBaseTokens] = useState<TokenInfo[]>([]);
  const filter = tokenFilter.toLowerCase();
  const styles = useStyles();
  const tokens = useMemo(
    () =>
      tokenList.filter(
        t =>
          t.symbol.toLowerCase().startsWith(filter) ||
          t.name.toLowerCase().startsWith(filter) ||
          t.address.toLowerCase().startsWith(filter),
      ),
    [tokenList, filter],
  );
  useEffect(() => {
    if (!commonBaseTokens.length) {
      setCommonBaseTokens(
        tokens.length ? tokens.filter(({ name }) => COMMON_BASE_TOKENS.includes(name)) : [],
      );
    }
  }, [tokens, commonBaseTokens]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      scroll={'paper'}
      PaperProps={{
        className: styles.dialogWrapper,
      }}
    >
      <DialogTitle className={styles.dialogTitle}>
        <TextField
          className={styles.dialogTitleTextField}
          placeholder={'Search name'}
          value={tokenFilter}
          fullWidth
          inputProps={{
            className: styles.dialogTitleInput,
          }}
          variant="outlined"
          onChange={e => setTokenFilter(e.target.value)}
        />
        <SearchIcon className={styles.dialogTitleSearchIcon} />
      </DialogTitle>
      <DialogActions className={styles.dialogActions}>
        <CommonBases
          commonBaseTokens={commonBaseTokens}
          onClick={mint => {
            setMint(mint);
            onClose();
          }}
        />
      </DialogActions>
      <DialogContent className={`${styles.dialogContent} ${styles.scrollBar}`} dividers={true}>
        <List className={styles.dialogList}>
          {tokens.map((tokenInfo: TokenInfo) => (
            <TokenListItem
              key={tokenInfo.address}
              tokenInfo={tokenInfo}
              onClick={mint => {
                setMint(mint);
                onClose();
              }}
            />
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
}

function CommonBases({ commonBaseTokens, onClick }) {
  const styles = useStyles();

  return (
    <div className={styles.commonBaseWrap}>
      <span className={styles.commonBaseTitle}>Common bases</span>
      <div className={styles.commonBaseList}>
        {commonBaseTokens.map(tokenInfo => {
          const mint = new PublicKey(tokenInfo.address);

          return (
            <div className={styles.commonBaseToken} onClick={() => onClick(mint)}>
              <TokenIcon mint={mint} styles={styles.tokenIconSmall} />
              <TokenName
                tokenInfo={tokenInfo}
                wrapStyles={styles.commonBaseTokenNameWrap}
                tokenNameStyles={styles.commonBaseTokenName}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TokenListItem({
  tokenInfo,
  onClick,
}: {
  tokenInfo: TokenInfo;
  onClick: (mint: PublicKey) => void;
}) {
  const [errorDownloading, setErrorDownloading] = useState(false);
  const mint = new PublicKey(tokenInfo.address);
  const styles = useStyles();

  return (
    <ListItem
      button
      onClick={() => onClick(mint)}
      className={errorDownloading ? styles.displayNone : styles.dialogListItem}
    >
      <TokenIcon mint={mint} styles={styles.tokenIconBig} onError={setErrorDownloading} />
      <TokenName
        tokenInfo={tokenInfo}
        tokenNameStyles={styles.dialogListTokenName}
        wrapStyles={styles.dialogListTokenNameWrap}
      />
    </ListItem>
  );
}

function TokenName({
  tokenInfo,
  wrapStyles = '',
  tokenNameStyles = '',
}: {
  tokenInfo: TokenInfo;
  wrapStyles?: string;
  tokenNameStyles?: string;
}) {
  return (
    <div className={wrapStyles}>
      <Typography className={tokenNameStyles}>{tokenInfo?.symbol}</Typography>
    </div>
  );
}

export function TokenIcon({
  mint,
  styles,
  onError,
}: {
  mint: PublicKey;
  styles?: any;
  onError?: any;
}) {
  const tokenMap = useTokenMap();
  const tokenInfo = tokenMap.get(mint.toString());

  if (!tokenInfo?.logoURI) {
    onError(true);

    return null;
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      <img
        alt="Logo"
        src={tokenInfo?.logoURI}
        className={styles}
        onError={() => {
          if (onError) {
            onError(true);
          }
        }}
      />
    </div>
  );
}
