import React, { useEffect, useState } from 'react';
import { Connection, PublicKey, TransactionSignature } from '@solana/web3.js';
import { TokenInfo } from '@solana/spl-token-registry';
import { Card, Typography, TextField, useTheme, IconButton } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { ExpandMore } from '@mui/icons-material';
import { ASSOCIATED_TOKEN_PROGRAM_ID, Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { ReactComponent as SwitchIcon } from '../../../assets/icons/switch-icon.svg';
import { useWallet } from '../../../components/wallet/wallet';
import SwapConfirmationModal from '../../../components/SwapConfirmationModal';
import { getNetwork } from '../../../utils';
import { TokenIcon } from './TokenIcon';
// eslint-disable-next-line import/order
import {
  useSwapContext,
  useTokenMap,
  useMint,
  useOwnedTokenAccount,
  useSwappableTokens,
  useOnSwap,
  // eslint-disable-next-line import/no-unresolved
} from '@serum/swap-ui';
import TokenDialog from './TokenDialog';
import SwapSettingsContainer from './SwapSettingsContainer';
import SwapButton from './SwapButton';

const tokenExistErrorMessage =
  'Your account does not have enough USDT tokens for the specified eco-contribution.\n' +
  'You can continue the token exchange process without eco-contribution or cancel the ' +
  'exchange and replenish your USDT token balance.';

const useStyles = makeStyles(theme => ({
  card: {
    borderRadius: '0 20px 20px 0 !important',
    border: '1px solid #0156FF',
    boxShadow: '0px 0px 30px 5px rgba(0,0,0,0.075)',
    backgroundColor: '#0A0C0E !important',
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
  expires: {
    fontFamily: 'Saira !important',
    fontSize: '24px !important',
    fontWeight: '100 !important',
    color: '#FFFFFF',
  },
  flexTypography: {
    display: 'flex',
    justifyContent: 'space-between',
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
    borderRadius: '8px',
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(1),
    backgroundColor: '#202124 !important',
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

export default function SwapCard() {
  const styles = useStyles();
  // TODO: use storage/context instead of passing props to children
  const { swappableTokens: tokenList } = useSwappableTokens();
  const { setImpact, fromAmount, toAmount, fromMint } = useSwapContext();
  const { onSwap } = useOnSwap();
  const { connected, wallet } = useWallet();
  const [ecoImpactType, setEcoImpactType] = useState<string>('$');
  const [ecoImpactValue, setEcoImpactValue] = useState<string>('0.5');
  const [txSignatures, setTxSignatures] = useState<Array<TransactionSignature>>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const tokenMap = useTokenMap();
  const fromTokenInfo = tokenMap.get(fromMint.toString());
  const [connection, setConnection] = useState<Connection>();

  const handleClose = () => {
    if (!isLoading || isError) {
      setOpen(false);
      setIsError(false);
      setIsLoading(false);
    }
  };

  const checkingEcoContributionPossibility = async () => {
    if (fromTokenInfo && fromTokenInfo.symbol !== 'SOL') {
      Token.getAssociatedTokenAddress(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        new PublicKey(process.env.REACT_APP_USDT_TOKEN_ADDRESS!),
        // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        // @ts-ignore
        wallet?.publicKey,
      )
        .then(tokenAddress => {
          connection
            ?.getTokenAccountBalance(tokenAddress)
            .then(tokenBalance => {
              if (
                !tokenBalance.value.uiAmount ||
                tokenBalance.value.uiAmount <= 0 ||
                (ecoImpactType === '$' && tokenBalance.value.uiAmount < Number(ecoImpactValue))
              ) {
                setImpact(0);
                setIsError(true);
                setErrorMessage(tokenExistErrorMessage);
                setOpen(true);
              } else {
                setImpact(
                  ecoImpactType === '$'
                    ? Number(ecoImpactValue)
                    : tokenBalance.value.uiAmount * (Number(ecoImpactValue) / 100),
                );
                setOpen(true);
                setIsLoading(true);
              }
            })
            .catch(() => {
              setImpact(0);
              setErrorMessage(tokenExistErrorMessage);
              setIsError(true);
              setOpen(true);
            });
        })
        .catch(e => {
          setErrorMessage(e.message);
          setIsError(true);
          setOpen(true);
        });
    } else {
      setImpact(0);
      setIsLoading(true);
      setOpen(true);
    }
  };

  useEffect(() => {
    if (wallet?.publicKey && connected) {
      setConnection(new Connection(getNetwork()));
    }
  }, [wallet, connected]);

  const startSwapTransaction = async () => {
    setIsLoading(true);
    setIsError(false);
    setErrorMessage('');

    const transactionResponse = await onSwap();
    if (transactionResponse.length > 0) {
      setTxSignatures(transactionResponse);
      setIsLoading(false);
    } else {
      setIsError(true);
      setErrorMessage('Transaction failed');
    }
  };

  useEffect(() => {
    if (isLoading && !isError) {
      startSwapTransaction();
    }
  }, [isLoading, isError]);

  const swapSettingsContainer =
    connected && fromAmount && toAmount ? (
      <SwapSettingsContainer
        {...{
          ecoImpactType,
          setEcoImpactType,
          ecoImpactValue,
          setEcoImpactValue,
        }}
      />
    ) : null;

  return (
    <>
      <SwapConfirmationModal
        {...{
          open,
          isError,
          errorMessage,
          isLoading,
          handleClose,
          startSwapTransaction,
          txSignatures,
        }}
      />
      <Card className={styles.card}>
        <div>
          <Typography className={styles.title}>From</Typography>
          <SwapFromForm tokenList={tokenList} />
          <div className={styles.switchBlock}>
            <Typography className={styles.switchTitle}>To (Estimate)</Typography>
            <SwitchButton />
          </div>
          <SwapToForm style={{ marginBottom: '32px' }} tokenList={tokenList} />
          {swapSettingsContainer}
          <SwapButton
            {...{
              checkingEcoContributionPossibility,
              ecoImpactType,
              ecoImpactValue,
              setOpen,
              isLoading,
              setIsLoading,
              setIsError,
              setErrorMessage,
              startSwapTransaction,
            }}
          />
        </div>
      </Card>
    </>
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

export function SwapFromForm({ style, tokenList }: { style?: any; tokenList: TokenInfo[] }) {
  const { fromMint, setFromMint, fromAmount, setFromAmount } = useSwapContext();
  // eslint-disable-next-line padding-line-between-statements
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

export function SwapToForm({ style, tokenList }: { style?: any; tokenList: TokenInfo[] }) {
  const { toMint, setToMint, toAmount, setToAmount } = useSwapContext();
  // eslint-disable-next-line padding-line-between-statements
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
      ? parseFloat(
          amount
            .toLocaleString('en-IN', {
              maximumFractionDigits: mintAccount.decimals,
              useGrouping: false,
            })
            .replace(/,/, '.'),
        )
      : amount;

  return (
    <div className={styles.swapTokenFormContainer} style={style}>
      <div className={styles.swapTokenSelectorContainer}>
        <TokenButton mint={mint} onClick={() => setShowTokenDialog(true)} />
        <Typography color="textSecondary" className={styles.balanceContainer}>
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
        onChange={e => {
          if (e.target.value === '') {
            setAmount(0);
          }
          const newValue = parseFloat(e.target.value || '0');
          if (!isNaN(newValue)) {
            setAmount(newValue);
          }
        }}
        inputProps={{
          inputMode: 'numeric',
          // eslint-disable-next-line
          // prettier-ignore
          pattern: '^[0-9]*(\.[0-9]*)?$'
        }}
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

function TokenButton({ mint, onClick }: { mint: PublicKey; onClick: () => void }) {
  const styles = useStyles();
  // const theme = useTheme();

  return (
    <div onClick={onClick} className={styles.tokenButton}>
      <TokenIcon mint={mint} />
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
