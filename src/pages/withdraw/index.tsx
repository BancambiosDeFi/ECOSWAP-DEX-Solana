import React, { useState } from 'react';
import { Theme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import BasicLayout from '../../srm-components/BasicLayout';
import { Box, Card, Grid, IconButton, Typography } from '@mui/material';
import { useWallet } from '../../components/wallet/wallet';
import WalletConnectSwap from '../../components/wallet/WalletConnectSwap';
import ButtonComponent from '../../srm-components/Button/Button';
import { ReactComponent as InfoIcon } from '../../assets/icons/info-icon.svg';
// import { getImpactPoolStatisticCommand } from '../../../../impact-contract/impact-pool-cli/src/commands';
import { ImpactPool } from 'impact-pool-api';
import { Connection, PublicKey } from '@solana/web3.js';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    minHeight: '100vh',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  withdrawWrapper: {
    borderRadius: theme.spacing(2),
    boxShadow: '0px 0px 30px 5px rgba(0,0,0,0.075)',
    backgroundColor: '#35363A !important',
    width: '435px',
    height: '100%',
    padding: '26px 16px',
  },
  withdrawInfo: {
    width: '100%',
    height: 'fit-content',
    minHeight: '132px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(65, 63, 63, 1)',
    borderRadius: '20px',
    padding: '8px 16px',
    marginBottom: '10px',
  },
  withdrawTitle: {
    fontFamily: 'Saira !important',
    fontStyle: 'normal',
    fontWeight: '700 !important',
    fontSize: '24px !important',
    lineHeight: '38px !important',
    textAlign: 'left',
    color: '#FFFFFF',
  },
  withdrawValue: {
    fontFamily: 'Saira !important',
    fontStyle: 'normal',
    fontWeight: '800 !important',
    fontSize: '16px !important',
    lineHeight: '40px !important',
    textAlign: 'left',
    color: '#FFFFFF',
  },
}));

const network = 'https://api.testnet.solana.com';
const contractAddress = '9bwnTPfjh9fVmJpe6zPEFQ1NiKyuDYyA4H5UFrzYGCVR';
const tokenAddress = '4p3pmKHnaAQnUs9MpkbXgw6E6YRT4X35YEW3W3yWGfzt';
const signer = 'FeoRru9dKQzpctSZUkqnqn8UtkkyqPkUkMXzdBNTEQh';
const importName = 'KEKPOG';

export default function WithdrawPage() {
  const styles = useStyles();
  const { connected } = useWallet();
  const [withdrawValue, setWithdrawValue] = useState<string>('500 USDC');

  const withdrawTransactionCall = async () => {
    // console.log('withdrawTransactionCall...');
    console.log(ImpactPool);

    const impactPool = new ImpactPool(
      new Connection(network),
      new PublicKey(contractAddress),
      new PublicKey(tokenAddress),
      new PublicKey(signer),
      importName,
    );
    console.log('Impact pool = ', impactPool);

    const statistics = await impactPool.getImpactPoolStatistics();
    console.log('statistics = ', statistics);
  };

  const buttonComponent = connected ? (
    <ButtonComponent
      type={'swap'}
      title={'Claim all'}
      onClick={withdrawTransactionCall}
      isIconVisible={false}
    />
  ) : (
    <WalletConnectSwap />
  );

  return (
    <BasicLayout>
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        className={styles.root}
      >
        <Card className={styles.withdrawWrapper}>
          {/*<Box className={styles.withdrawInfo}>*/}
          {/*  <Box className={styles.swapInfoLeftSide} key={index}>*/}
          {/*    <Typography className={styles.swapInfoText}>{option.label}</Typography>*/}
          {/*    <IconButton*/}
          {/*        className={infoIconStyle}*/}
          {/*        size="small"*/}
          {/*        aria-describedby={popoverId}*/}
          {/*        onClick={handleInfoButtonClick}*/}
          {/*        id={option.id}*/}
          {/*    >*/}
          {/*      <InfoIcon />*/}
          {/*    </IconButton>*/}
          {/*  </Box>*/}
          {/*</Box>*/}
          {/*<Box className={styles.swapInfoSideBlock}>*/}
          {/*  <Typography className={styles.swapInfoText}>{slippageTolerance}%</Typography>*/}
          {/*  <Typography className={styles.swapInfoText}>BX Pool</Typography>*/}
          {/*  <Typography className={styles.swapInfoText}>*/}
          {/*    {minimumReceived} {toTokenSymbol}*/}
          {/*  </Typography>*/}
          {/*  <Typography className={styles.swapInfoText}>*/}
          {/*    {priceImpact ? priceImpact + '%' : '-'}*/}
          {/*  </Typography>*/}
          {/*</Box>*/}
          <Box className={styles.withdrawInfo}>
            <Typography className={styles.withdrawTitle}>
              Funds available for withdrawal:
            </Typography>
            <Typography className={styles.withdrawValue}>{withdrawValue}</Typography>
          </Box>
          {buttonComponent}
        </Card>
      </Grid>
    </BasicLayout>
  );
}
