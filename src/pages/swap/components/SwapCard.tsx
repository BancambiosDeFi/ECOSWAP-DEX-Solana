import React, { useState } from 'react';
import { PublicKey } from '@solana/web3.js';
import { TokenInfo } from '@solana/spl-token-registry';
import { Card, Typography, TextField, useTheme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { ExpandMore, ImportExportRounded } from '@mui/icons-material';

import {
  useSwapContext,
  useTokenMap,
  useMint,
  useOwnedTokenAccount,
  useOnSwap,
  useSwappableTokens,
} from '@serum/swap-ui';
import WalletConnectSwap from '../../../components/wallet/WalletConnectSwap';
import ButtonComponent from '../../../srm-components/Button/Button';
import TokenDialog from './TokenDialog';
import { SettingsButton } from './Settings';
import { InfoLabel } from './Info';

const useStyles = makeStyles(theme => ({
  card: {
    borderRadius: theme.spacing(2),
    boxShadow: '0px 0px 30px 5px rgba(0,0,0,0.075)',
    backgroundColor: '#35363A !important',
    width: '435px',
    padding: '26px 16px',
  },
  title: {
    fontSize: '20px',
    color: 'white',
    marginBottom: '0px',
  },
  tab: {
    width: '50%',
  },
  settingsButton: {
    padding: 0,
  },
  swapButton: {
    width: '100%',
    borderRadius: theme.spacing(2),
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    fontSize: 16,
    fontWeight: 700,
    padding: theme.spacing(1.5),
  },
  swapToFromButton: {
    display: 'block',
    margin: '10px 0px 0px 0px',
    cursor: 'pointer',
    padding: '0px',
  },
  amountInput: {
    fontWeight: 600,
    color: 'white !important',
  },
  input: {
    textAlign: 'right',
    color: 'white',
    fontSize: '20px !important',
  },
  swapTokenFormContainer: {
    borderRadius: theme.spacing(2),
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(1),
    backgroundColor: '#202023 !important',
    color: 'white',
    textTransform: 'uppercase',
  },
  swapTokenSelectorContainer: {
    marginLeft: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    width: '50%',
  },
  balanceContainer: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '14px',
  },
  maxButton: {
    marginLeft: theme.spacing(1),
    color: theme.palette.primary.main,
    fontWeight: 700,
    fontSize: '12px',
    cursor: 'pointer',
  },
  tokenButton: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    paddingTop: '6px',
  },
  tokenIcon: {
    height: '45px',
    width: '45px !important',
  },
}));

export default function SwapCard({
  containerStyle,
  contentStyle,
  swapTokenContainerStyle,
}: {
  containerStyle?: any;
  contentStyle?: any;
  swapTokenContainerStyle?: any;
}) {
  const styles = useStyles();
  // TODO: use storage/context instead of passing props to children
  const { swappableTokens: tokenList } = useSwappableTokens();

  return (
    <Card sx={{ margin: '20px 0' }} className={styles.card} style={containerStyle}>
      {/* <SwapHeader /> */}
      <div style={contentStyle}>
        <p className={styles.title}>From</p>
        <SwapFromForm style={swapTokenContainerStyle} tokenList={tokenList} />
        <p className={styles.title}>
          To (Estimate) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <ArrowButton />
        </p>
        <SwapToForm style={swapTokenContainerStyle} tokenList={tokenList} />
        <InfoLabel />
        <SwapButton />
      </div>
    </Card>
  );
}

export function SwapHeader() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '16px',
      }}
    >
      <Typography
        style={{
          fontSize: 18,
          fontWeight: 700,
        }}
      >
        SWAP
      </Typography>
      <SettingsButton />
    </div>
  );
}

export function ArrowButton() {
  const styles = useStyles();
  const theme = useTheme();
  const { swapToFromMints } = useSwapContext();

  return (
    <ImportExportRounded
      className={styles.swapToFromButton}
      fontSize="large"
      htmlColor={theme.palette.primary.main}
      onClick={swapToFromMints}
    />
  );
}

function SwapFromForm({ style, tokenList }: { style?: any; tokenList: TokenInfo[] }) {
  const { fromMint, setFromMint, fromAmount, setFromAmount } = useSwapContext();

  return (
    <SwapTokenForm
      from
      style={style}
      mint={fromMint}
      setMint={setFromMint}
      amount={fromAmount}
      setAmount={setFromAmount}
      tokenList={tokenList}
    />
  );
}

function SwapToForm({ style, tokenList }: { style?: any; tokenList: TokenInfo[] }) {
  const { toMint, setToMint, toAmount, setToAmount } = useSwapContext();

  return (
    <SwapTokenForm
      from={false}
      style={style}
      mint={toMint}
      setMint={setToMint}
      amount={toAmount}
      setAmount={setToAmount}
      tokenList={tokenList}
    />
  );
}

export function SwapTokenForm({
  from,
  style,
  mint,
  setMint,
  amount,
  setAmount,
  tokenList = [],
}: {
  from: boolean;
  style?: any;
  mint: PublicKey;
  setMint: (m: PublicKey) => void;
  amount: number;
  setAmount: (a: number) => void;
  tokenList: TokenInfo[];
}) {
  const styles = useStyles();

  const [showTokenDialog, setShowTokenDialog] = useState(false);
  const tokenAccount = useOwnedTokenAccount(mint);
  const mintAccount = useMint(mint);

  const balance =
    tokenAccount &&
    mintAccount &&
    tokenAccount.account.amount.toNumber() / 10 ** mintAccount.decimals;

  const formattedAmount =
    mintAccount && amount
      ? amount.toLocaleString('fullwide', {
          maximumFractionDigits: mintAccount.decimals,
          useGrouping: false,
        })
      : amount;

  return (
    <div className={styles.swapTokenFormContainer} style={style}>
      <div className={styles.swapTokenSelectorContainer}>
        <TokenButton mint={mint} onClick={() => setShowTokenDialog(true)} />
        <Typography color="textSecondary" className={styles.balanceContainer}>
          {/* {tokenAccount && mintAccount ? `Balance: ${balance?.toFixed(mintAccount.decimals)}` : `-`} */}
          {from && !!balance ? (
            <span className={styles.maxButton} onClick={() => setAmount(balance)}>
              MAX
            </span>
          ) : null}
        </Typography>
      </div>
      <TextField
        type="number"
        value={formattedAmount}
        onChange={e => setAmount(parseFloat(e.target.value))}
        InputProps={{
          // disableUnderline: true,
          classes: {
            root: styles.amountInput,
            input: styles.input,
          },
        }}
      />
      <TokenDialog
        setMint={setMint}
        open={showTokenDialog}
        onClose={() => setShowTokenDialog(false)}
        tokenList={tokenList}
      />
    </div>
  );
}

function SwapButton() {
  // const styles = useStyles();
  const { onSwap, canSwap } = useOnSwap();

  if (canSwap) {
    return <ButtonComponent type={'swap'} title={'Swap'} onClick={onSwap} isIconVisible={false} />;
  } else {
    return <WalletConnectSwap />;
  }
}

function TokenButton({ mint, onClick }: { mint: PublicKey; onClick: () => void }) {
  const styles = useStyles();
  const theme = useTheme();

  return (
    <div onClick={onClick} className={styles.tokenButton}>
      <TokenIcon mint={mint} style={{ width: theme.spacing(4) }} />
      <TokenName mint={mint} style={{ fontSize: 20, fontWeight: 700, paddingTop: 4 }} />
      <ExpandMore />
    </div>
  );
}

export function TokenIcon({
  mint,
  style,
  className = '',
  onError,
}: {
  mint: PublicKey;
  style?: any;
  className?: string;
  onError?: any;
}) {
  const tokenMap = useTokenMap();
  const tokenInfo = tokenMap.get(mint.toString());
  const styles = useStyles();

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
        style={style}
        src={tokenInfo?.logoURI}
        className={styles.tokenIcon}
        onError={() => {
          if (onError) {
            onError(true);
          }
        }}
      />
    </div>
  );
}

export function TokenName({ mint, style }: { mint: PublicKey; style: any }) {
  const tokenMap = useTokenMap();
  const theme = useTheme();
  const tokenInfo = tokenMap.get(mint.toString());

  return (
    <Typography
      style={{
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(1),
        ...style,
      }}
    >
      {tokenInfo?.symbol}
    </Typography>
  );
}
