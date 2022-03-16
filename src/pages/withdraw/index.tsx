import React, { useEffect, useState } from 'react';
import { Theme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import BasicLayout from '../../srm-components/BasicLayout';
import { Box, Card, CircularProgress, Grid, Typography } from '@mui/material';
import { useWallet } from '../../components/wallet/wallet';
import WalletConnectSwap from '../../components/wallet/WalletConnectSwap';
import ButtonComponent from '../../srm-components/Button/Button';
import { ImpactPool } from 'impact-pool-api';
import { ImpactPoolStatistics } from 'impact-pool-api/dist/query';
import { Connection } from '@solana/web3.js';
import { converterBNtoString, getImpactPool, getNetwork } from '../../utils';
import { WithdrawFromPool } from 'impact-pool-api/dist/schema';
import ClaimWithdrawModal from '../../components/ClaimWithdrawModal';
import H3Text from '../../components/typography/H3Text';
import BN from 'bn.js';

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

export default function WithdrawPage() {
  const styles = useStyles();
  const { connected, wallet } = useWallet();
  const [withdrawValue, setWithdrawValue] = useState<string>('');
  const [connection, setConnection] = useState<Connection>();
  const [impactPool, setImpactPool] = useState<ImpactPool>();
  const [impactPoolData, setImpactPoolData] = useState<ImpactPoolStatistics>();
  const [open, setOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingStatistics, setIsLoadingStatistics] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isClaimDisable, setIsClaimDisable] = useState<boolean>(true);
  const [isClaimed, setIsClaimed] = useState<boolean>(false);

  const withdrawTransactionCall = () => {
    setOpen(true);
    setIsLoading(true);

    wallet &&
      connected &&
      connection &&
      impactPool &&
      impactPool
        .WithdrawFromPool(
          wallet.publicKey,
          new WithdrawFromPool(impactPoolData?.tokensInTokenPool!),
        )
        .then(transaction => {
          connection
            .getRecentBlockhash('confirmed')
            .then(({ blockhash }) => {
              transaction.recentBlockhash = blockhash;
              transaction.feePayer = wallet.publicKey;

              window.solana
                .signAndSendTransaction(transaction)
                .then((sign: { signature: string }) => {
                  connection
                    .confirmTransaction(sign.signature, 'finalized')
                    .then(signature => {
                      console.log('signature = ', signature);
                      setIsClaimed(true);
                      setIsLoading(false);
                      setIsError(false);
                      setErrorMessage('');
                    })
                    .catch(e => {
                      console.log('signature', e);
                      setErrorMessage(e.message);
                      setIsError(true);
                    });
                })
                .catch((e: any) => {
                  console.log('test == ', e);
                  setErrorMessage(e.message);
                  setIsError(true);
                });
            })
            .catch(e => {
              console.log('hash', e);
              setErrorMessage(e.message);
              setIsError(true);
            });
        })
        .catch(e => {
          console.log('withdrawFromPool', e);
          setErrorMessage(e.message);
          setIsError(true);
        });
  };

  const handleClose = () => {
    if (!isLoading || isError) {
      setOpen(false);
      setIsError(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (
      wallet &&
      connected &&
      connection &&
      impactPool &&
      impactPoolData &&
      Number(withdrawValue) > 0
    ) {
      setIsClaimDisable(false);
    } else {
      setIsClaimDisable(true);
    }
  }, [wallet, connected, connection, impactPool, impactPoolData, withdrawValue]);

  useEffect(() => {
    if (wallet?.publicKey && connected) {
      setConnection(new Connection(getNetwork()));
      setImpactPool(getImpactPool(wallet.publicKey, 'USDT_TESTNET_ZWEI'));
    }
  }, [wallet, connected]);

  useEffect(() => {
    if (impactPool) {
      setIsLoadingStatistics(true);

      wallet &&
        connected &&
        impactPool
          .getImpactPoolStatistics()
          .then(data => {
            setImpactPoolData(data);
            setWithdrawValue(converterBNtoString(data?.tokensInTokenPool));
            setIsLoadingStatistics(false);
          })
          .catch((error: Error) => {
            setIsLoadingStatistics(false);
            console.log('getImpactPoolStatistics error === ', error);
          });
    }
  }, [wallet, connected, impactPool, isClaimed]);

  const valueComponent =
    withdrawValue && !isLoadingStatistics ? (
      <Typography className={styles.withdrawValue}>{withdrawValue}</Typography>
    ) : (
      <>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            width: '100%',
          }}
        >
          <CircularProgress style={{ color: 'rgb(183,82,230)' }} thickness={6} size={40} />
        </Box>
      </>
    );

  const contentComponent = connected ? (
    <>
      <Box className={styles.withdrawInfo}>
        <Typography className={styles.withdrawTitle}>Funds available for withdrawal:</Typography>
        {valueComponent}
      </Box>
      <ButtonComponent
        disable={isClaimDisable || isClaimed}
        type={'swap'}
        title={'Claim all'}
        onClick={withdrawTransactionCall}
        isIconVisible={false}
      />
    </>
  ) : (
    <>
      <H3Text style={{ marginBottom: '10px' }} text={'Connect wallet to withdraw impact funds'} />
      <WalletConnectSwap />
    </>
  );

  return (
    <>
      <ClaimWithdrawModal
        {...{ open, isError, errorMessage, isLoading, handleClose }}
        wallet={wallet?.publicKey.toString()!}
      />
      <BasicLayout>
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
          className={styles.root}
        >
          <Card className={styles.withdrawWrapper}>{contentComponent}</Card>
        </Grid>
      </BasicLayout>
    </>
  );
}
