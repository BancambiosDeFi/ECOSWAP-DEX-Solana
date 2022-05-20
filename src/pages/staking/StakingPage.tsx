import { useCallback, useEffect, useState } from 'react';
import { Theme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Tooltip from '@mui/material/Tooltip';
import BN from 'bn.js';
import { PublicKey } from '@solana/web3.js';
import Wallet from '@project-serum/sol-wallet-adapter';
import logo from '../../assets/icons/banc-logo.png';
import infoIcon from '../../srm-assets/info.svg';
import BasicLayout from '../../srm-components/BasicLayout';
import Row from '../../components/Row';
import { useScreenSize } from '../../utils/screenSize';
import { DEFAULT_PUBLIC_KEY } from '../../components/wallet/types';
import { useWallet } from '../../components/wallet/wallet';
import { notify } from '../../srm-utils/notifications';
import ManualDetail from './ManualDetail';
import {
  calculateApr,
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
    'padding': theme.spacing(6, 0, 2, 2),
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
  const [accumulatedReward, setAccumulatedReward] = useState<number>(0);
  const [apr, setApr] = useState<string>('0');
  const [totalStaked, setTotalStaked] = useState<number>(0);
  const { wallet } = useWallet();

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
      setTotalStaked(
        convertBnAmountToDisplayBalance(
          programState.totalStakedTokens,
          Number(process.env.REACT_APP_BX_TOKEN_DECIMALS as string),
        ),
      );
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
      setAccumulatedReward(
        convertBnAmountToDisplayBalance(
          amountUnstaked,
          Number(process.env.REACT_APP_BX_TOKEN_DECIMALS as string),
        ),
      );
    }
  }, [wallet?.publicKey]);

  useEffect(() => {
    if (totalStaked && accumulatedReward) {
      setApr(calculateApr(totalStaked, accumulatedReward));
    }
  }, [totalStaked, accumulatedReward]);

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

  const expiresInComponent = isMobile ? (
    <div className={styles.expiresTitleBlock}>
      <CircularProgress
        thickness={7}
        variant="determinate"
        color="primary"
        size={22}
        value={63}
        style={{ margin: '0 5px' }}
      />
    </div>
  ) : (
    <Typography variant="inherit" className={styles.expiresTitle}>
      Expires in
      <CircularProgress
        thickness={7}
        variant="determinate"
        color="primary"
        size={15}
        value={63}
        style={{ margin: '0 5px' }}
      />
      <Tooltip title="Delete aaa" placement="top-start">
        <>
          <img src={infoIcon} alt="" />
        </>
      </Tooltip>
    </Typography>
  );

  return (
    <BasicLayout>
      <Grid container direction="column" alignItems="center" className={styles.root}>
        <Grid container direction="column">
          <Grid container justifyContent="space-between">
            <Typography variant="inherit" className={styles.title}>
              Manual staking BXS
            </Typography>
            {expiresInComponent}
          </Grid>
          <Grid container alignItems="center" direction="row" className={styles.wrapper}>
            <Row
              options={options}
              checkedOption={checkedOption}
              setPeriod={setPeriod}
              claimValue={claimValue}
              imgSrc={logo}
              reward={accumulatedReward}
              arp={apr}
              totalStaked={totalStaked}
              detailTitle="Harvest"
              detailValue={15}
              detailMenu={
                <ManualDetail
                  userBxBalance={userBxBalance}
                  detailTitle="ACCUMULATED REWARD"
                  detailValue={accumulatedReward}
                  handleChangeClaim={handleChangeClaim}
                  claimValue={claimValue}
                  updatePendingReward={updatePendingReward}
                  accumulatedReward={accumulatedReward}
                />
              }
            />
          </Grid>
          {/*<Typography variant="inherit" className={styles.title}>*/}
          {/*  Auto staking BXS*/}
          {/*</Typography>*/}
          {/*<Grid container alignItems="center" direction="row" className={styles.wrapper}>*/}
          {/*  <Row*/}
          {/*    options={options}*/}
          {/*    checkedOption={checkedOption}*/}
          {/*    setPeriod={setPeriod}*/}
          {/*    claimValue={claimValue}*/}
          {/*    imgSrc={logo}*/}
          {/*    reward={accumulatedReward}*/}
          {/*    arp={apr}*/}
          {/*    totalStaked={totalStaked}*/}
          {/*    detailTitle="Auto"*/}
          {/*    detailValue={15}*/}
          {/*    detailMenu={*/}
          {/*      <AutoDetail*/}
          {/*        userBxBalance={userBxBalance}*/}
          {/*        claimValue={claimValue}*/}
          {/*        handleChangeClaim={handleChangeClaim}*/}
          {/*        detailTitle="Auto-Compound"*/}
          {/*        detailValue={accumulatedReward}*/}
          {/*        checkedOption={checkedOption}*/}
          {/*        setPeriod={setPeriod}*/}
          {/*        options={options}*/}
          {/*        updatePendingReward={updatePendingReward}*/}
          {/*        accumulatedReward={accumulatedReward}*/}
          {/*      />*/}
          {/*    }*/}
          {/*  />*/}
          {/*</Grid>*/}
        </Grid>
      </Grid>
    </BasicLayout>
  );
}
