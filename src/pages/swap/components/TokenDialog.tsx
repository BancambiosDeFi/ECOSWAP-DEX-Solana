import React, { useState, useEffect } from 'react';
import { PublicKey } from '@solana/web3.js';
import { TokenInfo } from '@solana/spl-token-registry';
import {
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  Typography,
  Tabs,
  Tab,
} from '@mui/material';
import { makeStyles } from '@mui/styles';

import { useSwappableTokens } from '@serum/swap-ui';
import { ReactComponent as SearchIcon } from '../../../assets/icons/search.svg';
import { TokenIcon } from './SwapCard';

const useStyles = makeStyles(theme => ({
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
    backgroundColor: '#35363A',
    borderRadius: '20px',
    width: '390px',
    height: '660px',
    padding: '40px',
  },
  dialogContent: {
    padding: 0,
    border: 0,
    overflowX: 'hidden',
  },
  dialogList: {
    display: 'flex',
    flexWrap: 'wrap',
    width: '100%',
    boxSizing: 'border-box',
    padding: '0',
    marginTop: '-10px',
  },
  dialogListItem: {
    'display': 'flex',
    'width': '48%',
    'padding': '10px 2% 10px 0',
    'color': '#fff',

    '&:hover': {
      backgroundColor: 'rgb(189,193,198, 0.1)',
    },
  },
  dialogListTokenNameWrap: {
    marginLeft: '16px',
    overflow: 'hidden',
  },
  dialogListTokenName: {
    fontSize: '20px',
    lineHeight: '40px',
    fontWeight: 700,
    fontFamily: '"Saira", sans-serif',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
  dialogTitle: {
    position: 'relative',
    padding: 0,
    marginBottom: '15px',
    height: '50px',
  },
  dialogTitleTextField: {
    'height': '100%',
    'boxSizing': 'border-box',
    '& .MuiTextField-root': {
      height: '100%',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      border: 0,
    },
  },
  dialogTitleInput: {
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
  dialogTitleSearchIcon: {
    position: 'absolute',
    width: '25px',
    height: '25px',
    top: '50%',
    left: '25px',
    transform: 'translate(0, -50%)',
  },
  tab: {
    minWidth: '134px',
  },
  tabSelected: {
    color: theme.palette.primary.contrastText,
    fontWeight: 700,
    backgroundColor: theme.palette.primary.main,
    borderRadius: '10px',
  },
  tabIndicator: {
    opacity: 0,
  },
  tokenIconSmall: { width: '25px', height: '25px', borderRadius: '15px' },
  tokenIconBig: { width: '40px', height: '40px', borderRadius: '15px' },
  dialogActions: {
    marginBottom: '30px',
    padding: 0,
  },
  commonBasesWrap: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  commonBasesList: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  commonBasesTitle: {
    color: '#fff',
    fontSize: '14px',
    fontWeight: 800,
    marginBottom: '10px',
  },
  commonBasesToken: {
    display: 'flex',
    alignItems: 'center',
    borderRadius: '20px',
    background: '#707070',
    padding: '7px 12px',
    cursor: 'pointer',
  },
  commonBasesTokenNameWrap: {
    marginLeft: '5px',
  },
  commonBasesTokenName: {
    fontSize: '16px',
    lineHeight: '16px',
    fontWeight: 700,
    fontFamily: '"Saira", sans-serif',
    color: '#fff',
  },
}));

const COMMON_BASES_TOKENS: string[] = ['Native SOL', 'USDT', 'USD Coin'];

export default function TokenDialog({
  open,
  onClose,
  setMint,
}: {
  open: boolean;
  onClose: () => void;
  setMint: (mint: PublicKey) => void;
}) {
  const [tabSelection, setTabSelection] = useState(0);
  const [tokenFilter, setTokenFilter] = useState('');
  const [commonBasesTokens, setCommonBasesTokens] = useState<TokenInfo[]>([]);
  const filter = tokenFilter.toLowerCase();
  const styles = useStyles();
  const { swappableTokens, swappableTokensSollet, swappableTokensWormhole } = useSwappableTokens();
  const displayTabs = !useMediaQuery('(max-width:450px)');
  const selectedTokens =
    tabSelection === 0
      ? swappableTokens
      : tabSelection === 1
      ? swappableTokensWormhole
      : swappableTokensSollet;
  const tokens =
    tokenFilter === ''
      ? selectedTokens
      : selectedTokens.filter(
          t =>
            t.symbol.toLowerCase().startsWith(filter) ||
            t.name.toLowerCase().startsWith(filter) ||
            t.address.toLowerCase().startsWith(filter),
        );
  useEffect(() => {
    if (!commonBasesTokens.length) {
      setCommonBasesTokens(
        tokens.length ? tokens.filter(({ name }) => COMMON_BASES_TOKENS.includes(name)) : [],
      );
    }
  }, [tokens, commonBasesTokens]);

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
        {/* <Typography variant="h6" style={{ paddingBottom: '16px' }}>
          Select a token
        </Typography> */}
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
          commonBasesTokens={commonBasesTokens}
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

function CommonBases({ commonBasesTokens, onClick }) {
  const styles = useStyles();

  return (
    <div className={styles.commonBasesWrap}>
      <span className={styles.commonBasesTitle}>Common bases</span>
      <div className={styles.commonBasesList}>
        {commonBasesTokens.map(tokenInfo => {
          const mint = new PublicKey(tokenInfo.address);
          return (
            <div className={styles.commonBasesToken} onClick={() => onClick(mint)}>
              <TokenIcon mint={mint} className={styles.tokenIconSmall} />
              <TokenName
                tokenInfo={tokenInfo}
                wrapStyles={styles.commonBasesTokenNameWrap}
                tokenNameStyles={styles.commonBasesTokenName}
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
  const mint = new PublicKey(tokenInfo.address);
  const styles = useStyles();
  return (
    <ListItem button onClick={() => onClick(mint)} className={styles.dialogListItem}>
      <TokenIcon mint={mint} style={{ width: '40px', height: '40px', borderRadius: '15px' }} />
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
      {/* <Typography color="textSecondary" style={{ fontSize: '14px' }}>
        {tokenInfo?.symbol}
      </Typography> */}
    </div>
  );
}
