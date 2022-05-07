import React, { ChangeEvent, useEffect, useState } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import { TokenInfo } from '@solana/spl-token-registry';
import { Card, IconButton, Popover, TextField, Typography, useTheme } from '@mui/material';
import { makeStyles, styled } from '@mui/styles';
import { ExpandMore } from '@mui/icons-material';
import { ASSOCIATED_TOKEN_PROGRAM_ID, Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import {
  useMint,
  useOnSwap,
  useOwnedTokenAccount,
  useSwapContext,
  useSwapFair,
  useSwappableTokens,
  useTokenMap,
} from '@serum/swap-ui';
import { useWallet } from '../../../components/wallet/wallet';
import { getNetwork } from '../../../utils';
import { notify } from '../../../srm-utils/notifications';
import CircularProgressBar from '../../../components/CircularProgressBar';
import { ReactComponent as SwitchIcon } from '../../../assets/icons/switch-icon.svg';
import { ReactComponent as ExpiresInfoIcon } from '../../../assets/icons/expires-info-icon.svg';
import { getExpiresInDescription } from '../../../utils/descriptions';
import SwapSettingsContainer from './SwapSettingsContainer';
import EcoContributionErrorModal from './EcoContributionErrorModal';
import { TokenIcon } from './TokenIcon';
import TokenDialog from './TokenDialog';
import SwapButton from './SwapButton';
import NotificationDescriptionForCompletedSwap from './NotificationDescriptionForCompletedSwap';
import SwapProgressModal from './SwapProgressModal';

const tokenExistErrorMessage =
  'Your account does not have enough USDT tokens for the specified eco-contribution.\n' +
  'You can continue the token exchange process without eco-contribution or cancel the ' +
  'exchange and replenish your USDT token balance.';

const useStyles = makeStyles(theme => ({
  card: {
    borderRadius: '0 20px 20px 0 !important',
    border: '1px solid #0156FF',
    backgroundColor: '#0A0C0E !important',
    width: '435px',
    height: '100%',
    padding: '26px 16px',
    boxShadow: '12px 0px 12.0059px 12.0059px rgba(0, 0, 0, 0.5) !important',
  },
  fromTitleContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  expiresInContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  expiresInText: {
    color: 'rgba(174, 174, 175, 1)',
    marginRight: '4px !important',
  },
  expiresInfoButton: {
    width: 'fit-content !important',
    height: 'fit-content !important',
    padding: '0 !important',
    marginLeft: '4px !important',
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
    fontFamily: '"Saira", sans-serif !important',
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
  swapInfoText: {
    fontFamily: 'Saira !important',
    fontStyle: 'normal',
    fontWeight: '400 !important',
    fontSize: '16px !important',
    lineHeight: '29px !important',
    textAlign: 'left',
    color: '#FFFFFF',
  },
}));

const StyledPopover = styled(Popover)(() => ({
  '& .MuiPopover-paper': {
    width: 'fit-content',
    height: 'fit-content',
    maxWidth: '453px',
    padding: '8px 16px',
    backgroundColor: 'rgba(53, 54, 58, 1)',
  },
}));

export default function SwapCard() {
  const styles = useStyles();
  // TODO: use storage/context instead of passing props to children
  const { swappableTokens: tokenList } = useSwappableTokens();
  // const { tokenList } = useTokenListContext();
  const {
    setImpact,
    fromAmount,
    setFromAmount,
    toAmount,
    fromMint,
    toMint,
    fairOverride,
    setFairOverride,
  } = useSwapContext();
  const fair = useSwapFair();
  const { onSwap } = useOnSwap();
  const { connected, wallet } = useWallet();
  const [ecoImpactType, setEcoImpactType] = useState<string>('$');
  const [ecoImpactValue, setEcoImpactValue] = useState<string>('0.5');
  const [isLoadingTx, setIsLoadingTx] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const tokenMap = useTokenMap();
  const fromTokenInfo = tokenMap.get(fromMint.toString());
  const toTokenInfo = tokenMap.get(toMint.toString());
  const fromMintAccount = useMint(fromMint);
  const toMintAccount = useMint(toMint);
  const [connection, setConnection] = useState<Connection>();
  const [seconds, setSeconds] = useState<number>(0);
  const [infoText, setInfoText] = useState<string>(getExpiresInDescription(seconds));
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);
  const popoverId = open ? 'simple-popover' : undefined;

  const handleCloseEcoContributionErrorModal = () => {
    setIsError(false);
    setErrorMessage('');
  };

  const handleCloseSwapProgressModal = () => {
    setIsLoadingTx(false);
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
                setErrorMessage(tokenExistErrorMessage);
                setIsError(true);
              } else {
                setImpact(
                  ecoImpactType === '$'
                    ? Number(ecoImpactValue)
                    : tokenBalance.value.uiAmount * (Number(ecoImpactValue) / 100),
                );
                setIsLoadingTx(true);
              }
            })
            .catch(() => {
              setImpact(0);
              setErrorMessage(tokenExistErrorMessage);
              setIsError(true);
            });
        })
        .catch(e => {
          setErrorMessage(e.message);
          setIsError(true);
        });
    } else {
      setImpact(0);
      setIsLoadingTx(true);
    }
  };

  useEffect(() => {
    if (wallet?.publicKey && connected) {
      setConnection(new Connection(getNetwork()));
    }
  }, [wallet, connected]);

  const startSwapTransaction = async () => {
    handleCloseEcoContributionErrorModal();

    const transactionResponse = await onSwap();

    setIsLoadingTx(false);

    if (transactionResponse.length > 0) {
      notify({
        type: 'success',
        message: 'SWAP Completed!',
        description: (
          <NotificationDescriptionForCompletedSwap
            signature={transactionResponse[0]}
            fromAmount={fromAmount}
            toAmount={toAmount}
            fromMintAccount={fromMintAccount}
            toMintAccount={toMintAccount}
            fromTokenSymbol={fromTokenInfo?.symbol}
            toTokenSymbol={toTokenInfo?.symbol}
          />
        ),
      });
    } else {
      notify({
        type: 'error',
        message: 'Transaction failed',
        description: 'Something went wrong. Please try again later.',
      });
    }
  };

  useEffect(() => {
    if (isLoadingTx && !isError) {
      startSwapTransaction();
    }
  }, [isLoadingTx, isError]);

  const handleUpdateSwapRates = () => {
    if (fair) {
      setFairOverride(fair);
      setFromAmount(fromAmount);
      setSeconds(0);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(prevValue => (prevValue === 50 ? 0 : prevValue + 1));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setInfoText(getExpiresInDescription(seconds));
    if (seconds === 50 && fair) {
      setFairOverride(fair);
      setFromAmount(fromAmount);
    }
  }, [seconds]);

  useEffect(() => {
    if (fairOverride) {
      setFairOverride(null);
    }
  }, [fairOverride]);

  const handleInfoButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setInfoText('');
  };

  const swapSettingsContainer =
    connected && fromAmount && toAmount ? (
      <SwapSettingsContainer
        {...{
          ecoImpactType,
          setEcoImpactType,
          ecoImpactValue,
          setEcoImpactValue,
          handleUpdateSwapRates,
        }}
      />
    ) : null;

  return (
    <>
      <EcoContributionErrorModal
        open={isError}
        errorMessage={errorMessage}
        handleClose={handleCloseEcoContributionErrorModal}
        startSwapTransaction={startSwapTransaction}
      />
      <SwapProgressModal open={isLoadingTx} handleClose={handleCloseSwapProgressModal} />
      <Card className={styles.card}>
        <div>
          <div className={styles.fromTitleContainer}>
            <Typography className={styles.title}>From</Typography>
            <div className={styles.expiresInContainer}>
              <Typography className={`${styles.title} ${styles.expiresInText}`}>
                Expires in
              </Typography>
              <CircularProgressBar value={seconds * 2} />
              <IconButton
                className={styles.expiresInfoButton}
                size="small"
                aria-describedby={popoverId}
                onClick={handleInfoButtonClick}
                id="expires-in"
              >
                <ExpiresInfoIcon />
              </IconButton>
            </div>
          </div>
          <SwapFromForm tokenList={tokenList} />
          <div className={styles.switchBlock}>
            <Typography className={styles.switchTitle}>To (Estimate)</Typography>
            <SwitchButton />
          </div>
          <SwapToForm style={{ marginBottom: '32px' }} tokenList={tokenList} />
          {swapSettingsContainer}
          <SwapButton {...{ checkingEcoContributionPossibility }} />
        </div>
        <StyledPopover
          id={popoverId}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'center',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'center',
            horizontal: 'left',
          }}
        >
          <Typography className={styles.swapInfoText}>{infoText}</Typography>
        </StyledPopover>
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
          amount.toLocaleString('en-IN', {
            maximumFractionDigits: mintAccount.decimals,
            useGrouping: false,
          }),
        )
          .toString()
          .replace(/,/, '.')
      : amount.toString().replace(/,/, '.');
  const tokenMap = useTokenMap();
  const mintInfo = tokenMap.get(mint.toString());

  useEffect(() => {
    setAmount(0);
  }, [mintInfo?.symbol]);

  const handleTextFieldOnChange = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (e.target.value.match(/[^.\d]/g) !== null) {
      setAmount(0);
    } else {
      setAmount(Number(e.target.value));
    }
  };

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
        onChange={handleTextFieldOnChange}
        inputProps={{
          inputMode: 'numeric',
          pattern: '^[0-9]*(.[0-9]*)?$',
        }}
        InputProps={{
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
