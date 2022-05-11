import { useEffect, useMemo, useState } from 'react';
import { PublicKey } from '@solana/web3.js';
import { TokenInfo } from '@solana/spl-token-registry';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  TextField,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';

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
      'backgroundColor': '#040506',
      'position': 'absolute',
      'top': '100px',
      'width': '390px',
      'maxHeight': '660px',
      'padding': '20px',
      'border': '1px solid #0156FF',
      'borderRadius': '8px',
      '@media(max-height: 800px)': {
        maxHeight: '550px',
      },
      '@media(max-height: 700px)': {
        maxHeight: '450px',
      },
      '@media(max-height: 620px)': {
        maxHeight: '420px',
      },
      '@media(max-height: 560px)': {
        maxHeight: '350px',
      },
      'boxShadow': '0px 0px 12.0059px 12.0059px rgba(0, 0, 0, 0.5)',
    },
  },
  dialogContent: {
    '&&': { padding: 0, border: 0, overflowX: 'hidden' },
  },
  dialogList: {
    '&&': {
      padding: '0',
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      boxSizing: 'border-box',
    },
  },
  dialogListItem: {
    '&&': {
      'display': 'flex',
      'width': '100%',
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
      'fontSize': '20px',
      'lineHeight': '40px',
      'fontWeight': 700,
      'fontFamily': '"Saira", sans-serif',
      'textOverflow': 'ellipsis',
      'overflow': 'hidden',
      'whiteSpace': 'nowrap',
      '@media(max-height: 700px)': {
        fontSize: '17px',
      },
      '@media(max-height: 620px)': {
        fontSize: '14px',
      },
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
  dialogInputBlogTitleWrap: {
    '@media(max-height: 700px)': {
      maxHeight: '90px',
    },
    '@media(max-height: 620px)': {
      maxHeight: '75px',
    },
  },
  dialogInputBlogTitle: {
    'fontSize': '20px',
    'fontFamily': '"Saira", sans-serif',
    'color': '#FFFFFF',
    'fontWeight': '800',
    '@media(max-height: 700px)': {
      fontSize: '17px',
    },
    '@media(max-height: 620px)': {
      fontSize: '14px',
    },
  },
  dialogTitleInput: {
    '&&': {
      'height': '100%',
      'color': '#bdc1c6',
      'boxSizing': 'border-box',
      'padding': '16px 14px 16px 55px',
      'background': '#1e2022',
      'borderRadius': '8px',

      '&::placeholder': {
        fontFamily: '"Saira", sans-serif',
        fontSize: '18px',
        opacity: 1,
        paddingLeft: '15px',
      },
      '@media(max-height: 700px)': {
        'padding': '12px 14px 12px 42px',
        '&::placeholder': {
          fontSize: '16px',
        },
      },
      '@media(max-height: 620px)': {
        'padding': '10px 12px 10px 38px',
        '&::placeholder': {
          fontSize: '14px',
        },
      },
    },
  },
  dialogTitleSearchIcon: {
    '&&': {
      'position': 'absolute',
      'width': '25px',
      'height': '25px',
      'top': '50%',
      'left': '25px',
      'transform': 'translate(0, -50%)',
      '@media(max-height: 700px)': {
        width: '20px',
        height: '20px',
        top: '40%',
      },
      '@media(max-height: 620px)': {
        width: '16px',
        height: '16px',
        top: '40%',
      },
    },
  },
  tokenIconSmall: {
    '&&': {
      'width': '25px',
      'height': '25px',
      'borderRadius': '15px',
      '@media(max-height: 700px)': {
        width: '20px',
        height: '20px',
      },
    },
  },
  tokenIconBig: {
    '&&': {
      'width': '40px',
      'height': '40px',
      'borderRadius': '15px',
      '@media(max-height: 700px)': {
        width: '35px',
        height: '35px',
      },
      '@media(max-height: 620px)': {
        width: '30px',
        height: '30px',
      },
    },
  },
  dialogActions: {
    '&&': {
      'marginBottom': '30px',
      'padding': 0,
      '@media(max-height: 700px)': {
        marginBottom: '20px',
      },
      '@media(max-height: 620px)': {
        marginBottom: '10px',
      },
    },
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
      'fontFamily': '"Saira", sans-serif',
      'color': '#AEAEAF',
      'fontSize': '18px',
      'fontWeight': '800',
      'marginBottom': '10px',
      '@media(max-height: 700px)': {
        fontSize: '16px',
        marginBottom: '6px',
      },
      '@media(max-height: 620px)': {
        fontSize: '14px',
        marginBottom: '3px',
      },
    },
  },
  commonBaseToken: {
    '&&': {
      'display': 'flex',
      'alignItems': 'center',
      'borderRadius': '8px',
      'background': '#707070',
      'padding': '8px 20px',
      'cursor': 'pointer',
      '@media(max-height: 700px)': {
        padding: '8px 18px',
      },
      '@media(max-height: 620px)': {
        padding: '4px 14px',
      },
    },
  },
  commonBaseTokenNameWrap: {
    '&&': {
      marginLeft: '5px',
    },
  },
  commonBaseTokenName: {
    '&&': {
      'fontSize': '16px',
      'lineHeight': '16px',
      'fontWeight': 700,
      'fontFamily': '"Saira", sans-serif',
      'color': '#fff',
      '@media(max-height: 700px)': {
        fontSize: '14px',
      },
      '@media(max-height: 620px)': {
        fontSize: '12px',
      },
    },
  },
}));

const COMMON_BASE_TOKENS: string[] = ['Native SOL', 'Bancambios AX', 'USD Coin'];

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
      <div className={styles.dialogInputBlogTitleWrap}>
        <h3 className={styles.dialogInputBlogTitle}>Select a Coin</h3>
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
      </div>
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
      <span className={styles.commonBaseTitle}>Popular Coin</span>
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
    <div>
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
