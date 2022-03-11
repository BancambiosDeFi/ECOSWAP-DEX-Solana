import React, { useEffect, useState } from 'react';
import { Theme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import BasicLayout from '../../srm-components/BasicLayout';
import { Box, Card, Grid, IconButton, Typography } from '@mui/material';
import { useWallet } from '../../components/wallet/wallet';
import WalletConnectSwap from '../../components/wallet/WalletConnectSwap';
import ButtonComponent from '../../srm-components/Button/Button';
import { ReactComponent as InfoIcon } from '../../assets/icons/info-icon.svg';
import { ImpactPool } from 'impact-pool-api';
import { ImpactPoolStatistics } from 'impact-pool-api/dist/query';
import { Connection, PublicKey } from '@solana/web3.js';
import { getImpactPool, getNetwork } from '../../utils';
import { WithdrawFromPool } from 'impact-pool-api/dist/schema';

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
  const [withdrawValue, setWithdrawValue] = useState<string>('?');
  const [connection, setConnection] = useState<Connection>();
  const [impactPool, setImpactPool] = useState<ImpactPool>();
  const [impactPoolData, setImpactPoolData] = useState<ImpactPoolStatistics>();
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [error, setError] = useState<boolean>(false);

  const withdrawTransactionCall = () => {
    console.log('withdrawTransactionCall');

    wallet &&
      connected &&
      connection &&
      impactPool &&
      // data &&
      // data.availableToWithdrawTokens &&
      impactPool
        .WithdrawFromPool(wallet.publicKey, new WithdrawFromPool(impactPoolData?.amount!))
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
                      // setIsClaimed(true);
                      // handleClose();
                      // handleOpen();
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

  useEffect(() => {
    console.log('impactPool =', impactPool);
  }, [impactPool]);

  // console.log(wallet);
  // console.log(wallet?.publicKey.toString());
  // console.log(connected);

  useEffect(() => {
    if (wallet && connected) {
      setConnection(new Connection(getNetwork()));
      setImpactPool(getImpactPool('USDT_TESTNET'));
    }
  }, [wallet, connected]);

  useEffect(() => {
    if (impactPool) {
      wallet &&
        connected &&
        impactPool
          .getImpactPoolStatistics()
          .then(data => {
            console.log('data =', data);
            setImpactPoolData(data);
            setWithdrawValue(data?.amount.toString());
            // setLoading(false);
            // setError(false);
            // setData(data);
            // setValues({
            //   total: converterBN(data.allTokens),
            //   released: converterBN(data.unlockedTokens),
            //   available: converterBN(data.availableToWithdrawTokens),
            //   claimed: converterBN(data.withdrawn_tokens),
            // });
          })
          .catch((error: Error) => {
            // if (error.message.includes('Impact pool statistics does not exist')) {
            // setError(true);
            // setLoading(false);
            // }
            console.log('getImpactPoolStatistics error === ', error);
          });
    }
  }, [wallet, connected, impactPool]);

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
