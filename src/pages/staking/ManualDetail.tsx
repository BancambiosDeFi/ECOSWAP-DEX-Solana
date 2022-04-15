import React from 'react';
import { Theme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Collapse from '@mui/material/Collapse';
import { useWallet } from '../../components/wallet/wallet';
import { MemoClaimPopup } from './ClaimPopup';

interface showDetailsProps {
  showDetails?: boolean;
  detailTitle: string;
  detailValue: number;
  handleChangeClaim: (data: any) => void;
  claimValue: number;
}

const useStyles = makeStyles((theme: Theme) => ({
  wrapper: {
    padding: '22px 15px',
    background: '#11161d',
    borderRadius: '18px',
  },
  root: {
    minHeight: '100vh',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  title: {
    paddingBottom: theme.spacing(4),
    fontSize: '20px',
    fontWeight: 800,
  },
  subtitle: {
    fontWeight: 800,
    fontSize: '16px',
  },
  img: {
    width: '30px',
    height: '30px',
  },
  arrow: {
    padding: 0,
    margin: '15px',
    width: 0,
    height: 0,
    background: 'transparent',
    borderTop: '5px solid transparent',
    borderBottom: '5px solid transparent',
    borderLeft: '10px solid #C4C4C4',
    borderRight: '0px',
    cursor: 'pointer',
  },
  rotateArrow: {
    padding: 0,
    margin: '15px',
    width: 0,
    height: 0,
    background: 'transparent',
    borderTop: '10px solid #C4C4C4',
    borderBottom: '0',
    borderLeft: '5px solid transparent',
    borderRight: '5px solid transparent',
    cursor: 'pointer',
  },
  text: {
    fontWeight: 400,
    fontSize: '16px',
    lineHeight: '16px',
  },
  divider: {
    background:
      'linear-gradient(232deg, rgba(236, 38, 245, 0.3) 50%, rgba(159, 90, 229, 0.3) 100%)',
    border: 'none',
    margin: '10px 0 15px',
    height: '1px',
  },
  disabledBtn: {
    fontWeight: 400,
    fontSize: '16px',
    border: '0.15px solid #5145FB',
    background: '#1E2022',
    borderRadius: '8px',
    color: '#7C8498',
    padding: '7px 35px',
    pointerEvents: 'none',
  },
  inner: {
    height: '100%',
    padding: '1px',
    borderRadius: '8px',
    background:
      'linear-gradient(232deg, rgba(236, 38, 245, 0.3) 50%, rgba(159, 90, 229, 0.3) 100%)',
  },
  innerWrapper: {
    height: '100%',
    padding: '15px 15px 5px',
    borderRadius: '8px',
    background: '#0a0c0f',
  },
  btnWrapper: {
    marginBottom: '10px',
    padding: '0.5px',
    borderRadius: '8px',
    background: 'linear-gradient(232deg, #0156FF 30%, #EC26F5 100%)',
  },
  btn: {
    width: '100%',
    fontWeight: 400,
    fontSize: '16px',
    border: '0.15px solid #5145FB',
    background: '#1E2022',
    borderRadius: '8px',
    color: '#fff',
    padding: '7px 35px',
    cursor: 'pointer',
  },
}));

export default function ManualDetail({
  showDetails,
  detailTitle,
  detailValue,
  handleChangeClaim,
  claimValue,
}: showDetailsProps) {
  const styles = useStyles();
  const { connected, connect } = useWallet();

  return (
    <Collapse style={{ width: '100%' }} in={showDetails} timeout="auto" unmountOnExit>
      <Grid container direction="column">
        <hr className={styles.divider} />
        <Grid container spacing={2}>
          <Grid item sm={6}>
            <Grid className={styles.inner}>
              <Grid container className={styles.innerWrapper}>
                <Typography variant="inherit" className={styles.subtitle}>
                  {detailTitle}
                </Typography>
                <Grid container alignItems="center" justifyContent="space-between">
                  <Typography variant="inherit" className={styles.subtitle}>
                    {detailValue}
                  </Typography>
                  <div className={styles.btnWrapper}>
                    {connected ? (
                      <button className={styles.btn}>Claim</button>
                    ) : (
                      <button
                        style={{ cursor: 'not-allowed', color: '#7C8498' }}
                        className={styles.btn}
                      >
                        Auto
                      </button>
                    )}
                  </div>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item sm={6}>
            <Grid className={styles.inner}>
              <Grid container className={styles.innerWrapper}>
                <Grid
                  container
                  alignItems="center"
                  justifyContent="space-between"
                  alignSelf="flex-end"
                  spacing={2}
                >
                  {!connected ? (
                    <Grid item xs={12}>
                      <Grid container className={styles.btnWrapper}>
                        <button onClick={connect} className={styles.btn}>
                          Connect wallet
                        </button>
                      </Grid>
                    </Grid>
                  ) : (
                    <>
                      <Grid item xs={2}>
                        <Grid container className={styles.btnWrapper}>
                          <MemoClaimPopup
                            balance={1}
                            onChange={undefined}
                            onSubmit={undefined}
                            ifStake={false}
                            claimValue={claimValue}
                            handleChangeClaim={handleChangeClaim}
                            title="-"
                          />
                        </Grid>
                      </Grid>
                      <Grid item xs={10}>
                        <Grid container className={styles.btnWrapper}>
                          <MemoClaimPopup
                            balance={1}
                            onChange={undefined}
                            onSubmit={undefined}
                            ifStake={true}
                            claimValue={claimValue}
                            handleChangeClaim={handleChangeClaim}
                            title="Stake BSX"
                          />
                        </Grid>
                      </Grid>
                    </>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Collapse>
  );
}
