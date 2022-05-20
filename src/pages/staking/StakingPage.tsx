import { useCallback, useEffect, useState } from 'react';
import { Theme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import BN from 'bn.js';
import { PublicKey } from '@solana/web3.js';
import Wallet from '@project-serum/sol-wallet-adapter';
import logo from '../../assets/icons/banc-logo.png';
import BasicLayout from '../../srm-components/BasicLayout';
import Row from '../../components/Row';
import { useScreenSize } from '../../utils/screenSize';
import { DEFAULT_PUBLIC_KEY } from '../../components/wallet/types';
import { useWallet } from '../../components/wallet/wallet';
import { notify } from '../../srm-utils/notifications';
import { ExpiresInBlock } from '../liquidity/ExpiresInBlock';
import { getExpiresInDescription } from '../../utils/descriptions';
import ManualDetail from './ManualDetail';
import AutoDetail from './AutoDetail';
import {
  convertBnAmountToDisplayBalance,
  getAssociatedBxTokenAddress,
  getAssociatedStakingTokenAddress,
  getAssociatedTokenAccount,
  getStaking,
  getStakingTokenMintInfo,
} from './utils';

const useStyles = makeStyles((theme: Theme) => ({
  wrapper: {
    borderRadius: '18px',
  },
  root: {
    'justifyContent': 'center',
    'padding': '0 235px',
    'minHeight': '100vh',
    'marginBottom': '24px',
    '@media (max-width: 768px)': {
      padding: '0 12px',
      justifyContent: 'start',
    },
    '@media (max-width: 1200px)': {
      padding: '0 10%',
    },
  },
  title: {
    'fontFamily': 'Saira',
    'fontWeight': 700,
    'fontSize': '24px',
    'lineHeight': '60px',
    'color': '#FFFFFF',
    '@media (max-width: 768px)': {
      padding: '15px 0 15px 0',
      fontFamily: 'Saira',
      fontWeight: 600,
      fontSize: '16px',
      lineHeight: '40px',
    },
  },
  expiresTitle: {
    'padding': theme.spacing(6, 2, 2, 0),
    'color': '#AEAEAF',
    'fontSize': '24px',
    'fontFamily': 'Saira',
    'lineHeight': '60px',
    '@media (max-width: 768px)': {
      padding: '15px 6px 15px 0',
      lineHeight: '24px',
    },
  },
  expiresTitleBlock: {
    display: 'flex',
    alignItems: 'center',
    padding: '15px 6px 15px 0',
  },
}));

const options = [
  {
    label: 'Week auto compound',
    startDate: new Date().getTime(),
    endDate: new Date().getTime() - 7 * 24 * 60 * 60,
  },
  {
    label: 'Month auto compound',
    startDate: new Date().getTime(),
    endDate: new Date().getTime() - 30 * 24 * 60 * 60,
  },
  {
    label: 'Year auto compound',
    startDate: new Date().getTime(),
    endDate: new Date().getTime() - 365 * 24 * 60 * 60,
  },
];

export default function StakingPage() {
  const styles = useStyles();
  const { isMobile } = useScreenSize();
  const [checkedOption, setCheckedOption] = useState({});
  const [claimValue, setClaimValue] = useState<number>(0);
  const [userBxBalance, setUserBxBalance] = useState<number>(0);
  const [pendingReward, setPendingReward] = useState<number>(0);
  const { wallet } = useWallet();
  const [seconds, setSeconds] = useState<number>(0);
  const [infoText, setInfoText] = useState<string>(getExpiresInDescription(seconds));
  const handleChangeClaim = useCallback(
    e => {
      setClaimValue(e.target?.value);
    },
    [setClaimValue],
  );

  const setPeriod = useCallback(
    data => {
      if (typeof data !== 'string') {
        return setCheckedOption(data);
      }
      const checkedOption = options.filter(item => item.label === data)[0];
      setCheckedOption(checkedOption);
    },
    [setCheckedOption],
  );

  const updatePendingReward = useCallback(async () => {
    if (wallet?.publicKey && wallet.publicKey.toBase58() !== DEFAULT_PUBLIC_KEY.toBase58()) {
      const stakingAddress = await getAssociatedStakingTokenAddress(wallet?.publicKey);
      const staking = getStaking(wallet as Wallet);
      const programState = await staking.programState();
      const userStakeInfo = await staking.userStakeInfo(wallet?.publicKey);
      const tokenAccount = await getAssociatedTokenAccount(
        wallet?.publicKey,
        new PublicKey(process.env.REACT_APP_STAKING_TOKEN_MINT_PUBKEY as string),
        stakingAddress,
      );
      const tokenMintInfo = await getStakingTokenMintInfo(wallet?.publicKey);
      const { amountUnstaked } = programState.getPossibleUnstake(
        userStakeInfo,
        new BN(tokenAccount.amount),
        tokenMintInfo.supply,
      );
      setPendingReward(
        convertBnAmountToDisplayBalance(
          amountUnstaked,
          Number(process.env.REACT_APP_BX_TOKEN_DECIMALS as string),
        ),
      );
    }
  }, [wallet?.publicKey]);

  const updateUserBxsBalance = useCallback(async () => {
    if (wallet?.publicKey && wallet.publicKey.toBase58() !== DEFAULT_PUBLIC_KEY.toBase58()) {
      const bxAddress = await getAssociatedBxTokenAddress(wallet?.publicKey);
      try {
        const tokenAccount = await getAssociatedTokenAccount(
          wallet?.publicKey,
          new PublicKey(process.env.REACT_APP_BX_TOKEN_MINT_PUBKEY as string),
          bxAddress,
        );
        setUserBxBalance(
          convertBnAmountToDisplayBalance(
            new BN(tokenAccount.amount),
            Number(process.env.REACT_APP_BX_TOKEN_DECIMALS as string),
          ),
        );
      } catch (e) {
        notify({
          type: 'error',
          message: 'Fetch BXS balance error',
          description: e.message,
        });
      }
    }
  }, [wallet?.publicKey]);

  useEffect(() => {
    updatePendingReward();
  }, [updatePendingReward]);

  useEffect(() => {
    updateUserBxsBalance();
  }, [updateUserBxsBalance]);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(prevValue => (prevValue === 50 ? 0 : prevValue + 1));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setInfoText(getExpiresInDescription(seconds));
    if (seconds === 50) {
      setSeconds(0);
      // here we need to add a dependency other than seconds, and a function that updates the required data
    }
  }, [seconds]);

  const updateTimerAndSomeData = () => {
    setSeconds(0);
    // here we need to add a a function that updates the required data
  };

  // useEffect(() => {
  //   updatePendingReward();
  //   if (wallet?.publicKey && wallet.publicKey.toBase58() !== DEFAULT_PUBLIC_KEY.toBase58()) {
  //     const getUserBxBalance = async () => {
  //       // Getting user BXS balance
  //       const bxAddress = await getAssociatedBxTokenAddress(wallet?.publicKey);
  //       try {
  //         const tokenAccount = await getAssociatedTokenAccount(
  //           wallet?.publicKey,
  //           new PublicKey(process.env.REACT_APP_BX_TOKEN_MINT_PUBKEY as string),
  //           bxAddress,
  //         );
  //         setUserBxBalance(
  //           convertBnAmountToDisplayBalance(
  //             new BN(tokenAccount.amount),
  //             Number(process.env.REACT_APP_BX_TOKEN_DECIMALS as string),
  //           ),
  //         );
  //       } catch (e) {
  //         notify({
  //           type: 'error',
  //           message: 'Fetch BXS balance error',
  //           description: e.message,
  //         });
  //       }
  //     };
  //
  //     getUserBxBalance();
  //   }
  // }, [wallet?.publicKey]);

  return (
    <BasicLayout>
      <Grid container direction="column" alignItems="center" className={styles.root}>
        <Grid container direction="column">
          <Grid container justifyContent="space-between" alignItems="center">
            <Typography variant="inherit" className={styles.title}>
              Manual staking BXS
            </Typography>
            <ExpiresInBlock
              seconds={seconds}
              infoText={infoText}
              updateTimer={updateTimerAndSomeData}
            />
          </Grid>
          <Grid container alignItems="center" direction="row" className={styles.wrapper}>
            <Row
              options={options}
              checkedOption={checkedOption}
              setPeriod={setPeriod}
              claimValue={claimValue}
              imgSrc={logo}
              reward={pendingReward}
              staked={22}
              arp={33}
              liquidity={44}
              detailTitle="Harvest"
              detailValue={15}
              detailMenu={
                <ManualDetail
                  userBxBalance={userBxBalance}
                  detailTitle="PENDING REWARD"
                  detailValue={pendingReward}
                  handleChangeClaim={handleChangeClaim}
                  claimValue={claimValue}
                  updatePendingReward={updatePendingReward}
                  pendingReward={pendingReward}
                />
              }
            />
          </Grid>
          <Typography variant="inherit" className={styles.title}>
            Auto staking BXS
          </Typography>
          <Grid container alignItems="center" direction="row" className={styles.wrapper}>
            <Row
              options={options}
              checkedOption={checkedOption}
              setPeriod={setPeriod}
              claimValue={claimValue}
              imgSrc={logo}
              reward={pendingReward}
              staked={22}
              arp={33}
              liquidity={44}
              detailTitle="Auto"
              detailValue={15}
              detailMenu={
                <AutoDetail
                  userBxBalance={userBxBalance}
                  claimValue={claimValue}
                  handleChangeClaim={handleChangeClaim}
                  detailTitle="Auto-Compound"
                  detailValue={pendingReward}
                  checkedOption={checkedOption}
                  setPeriod={setPeriod}
                  options={options}
                  updatePendingReward={updatePendingReward}
                  pendingReward={pendingReward}
                />
              }
            />
          </Grid>
        </Grid>
      </Grid>
    </BasicLayout>
  );
}
