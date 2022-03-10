import React, { useEffect, useState } from 'react';
import { PublicKey } from '@solana/web3.js';
import { TokenInfo } from '@solana/spl-token-registry';
import { Card, Typography, TextField, useTheme, IconButton } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { ExpandMore } from '@mui/icons-material';
import { ReactComponent as SwitchIcon } from '../../../assets/icons/switch-icon.svg';
import { TokenIcon } from './TokenIcon';
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
import SwapSettingsContainer from './SwapSettingsContainer';
import { useWallet } from '../../../components/wallet/wallet';

const useStyles = makeStyles(theme => ({
  card: {
    borderRadius: '0 20px 20px 0 !important',
    boxShadow: '0px 0px 30px 5px rgba(0,0,0,0.075)',
    backgroundColor: '#35363A !important',
    width: '435px',
    height: '100%',
    padding: '26px 16px',
  },
  title: {
    fontFamily: 'Saira !important',
    fontSize: '24px !important',
    fontStyle: 'normal',
    fontWeight: '400 !important',
    lineHeight: '34px !important',
    letterSpacing: '0em !important',
    textAlign: 'left',
    color: '#FFFFFF',
    marginBottom: '0px',
  },
  switchBlock: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '8px 0',
  },
  switchTitle: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    fontFamily: 'Saira !important',
    fontSize: '24px !important',
    fontStyle: 'normal',
    fontWeight: '400 !important',
    lineHeight: '34px !important',
    letterSpacing: '0em !important',
    textAlign: 'left',
    color: '#FFFFFF',
    marginBottom: '0px',
  },
  switchButton: {
    width: '43px',
    height: '43px',
    backgroundColor: 'rgba(32, 33, 36, 1) !important',
  },
  tab: {
    width: '50%',
  },
  toForm: {
    marginBottom: '32px',
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
  const { fromAmount, toAmount } = useSwapContext();
  const { connected } = useWallet();

  const swapSettingsContainer =
    connected && fromAmount && toAmount ? <SwapSettingsContainer /> : null;

  return (
    <Card className={styles.card} style={containerStyle}>
      <div style={contentStyle}>
        <Typography className={styles.title}>From</Typography>
        <SwapFromForm style={swapTokenContainerStyle} tokenList={tokenList} />
        <div className={styles.switchBlock}>
          <Typography className={styles.switchTitle}>To (Estimate)</Typography>
          <SwitchButton />
        </div>
        <SwapToForm style={{ marginBottom: '32px' }} tokenList={tokenList} />
        {swapSettingsContainer}
        <SwapButton />
      </div>
    </Card>
  );
}

export function SwitchButton() {
  const styles = useStyles();
  const { swapToFromMints } = useSwapContext();

  return (
    <IconButton className={styles.switchButton} onClick={swapToFromMints}>
      <SwitchIcon />
    </IconButton>
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
  const { connected } = useWallet();

  useEffect(() => {
    console.log('Swap button component...');
    console.log('canSwap =', canSwap);
  }, [canSwap]);

  if (connected) {
    return (
      <ButtonComponent
        type={'swap'}
        title={'Swap'}
        onClick={onSwap}
        disable={!canSwap}
        isIconVisible={false}
      />
    );
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
