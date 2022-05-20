import { Theme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Collapse from '@mui/material/Collapse';
import { useWallet } from '../../components/wallet/wallet';
import { useScreenSize } from '../../utils/screenSize';
import { MemoClaimPopup } from './ClaimPopup';

interface showDetailsProps {
  showDetails?: boolean;
  detailTitle: string;
  detailValue: number;
  handleChangeClaim: (data: any) => void;
  claimValue: number;
  userBxBalance: number;
  updatePendingReward: () => Promise<void>;
  accumulatedReward: number;
}

const useStyles = makeStyles((theme: Theme) => ({
  wrapper: {
    padding: '22px 15px',
    background: '#0D1226',
    borderRadius: '18px',
  },
  title: {
    paddingBottom: theme.spacing(4),
    fontSize: '20px',
    fontWeight: 600,
  },
  subtitle: {
    'fontFamily': 'Saira',
    'fontWeight': 600,
    'fontSize': '16px',
    'lineHeight': '40px',
    'letterSpacing': '0em',
    'textAlign': 'left',
    '@media (max-width: 768px)': {
      fontWeight: 700,
      fontSize: '10px',
      lineHeight: '25px',
    },
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
    background: '#0156FF',
    border: 'none',
    margin: '15px 0 15px',
    height: '0.15px',
  },
  disabledBtn: {
    fontWeight: 400,
    fontSize: '16px',
    border: '1px solid #5145FB',
    background: '#092667',
    borderRadius: '8px',
    color: '#7C8498',
    padding: '7px 35px',
    pointerEvents: 'none',
  },
  inner: {
    width: '100%',
    height: '100%',
    padding: '1px',
    borderRadius: '8px',
    border: '0.15px solid #0156FF',
  },
  innerWrapper: {
    'height': '100%',
    'padding': '15px 15px 5px',
    'borderRadius': '8px',
    'background': '#0D1226',
    '@media (max-width: 768px)': {
      padding: '0 16px',
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
  },
  connectWalletWrapper: {
    'borderRadius': '8px',
    '@media (max-width: 768px)': {
      padding: '0 8px',
    },
  },
  btnWrapper: {
    'marginBottom': '10px',
    'padding': '0.5px',
    'borderRadius': '8px',
    '@media (max-width: 768px)': {
      margin: '20px 0',
    },
  },
  btn: {
    width: '100%',
    fontWeight: 400,
    fontSize: '16px',
    fontFamily: 'Saira',
    border: '1px solid #0156FF',
    background: '#092667',
    borderRadius: '8px',
    color: '#fff',
    padding: '7px 35px',
    cursor: 'pointer',
  },
  btnAllowed: {
    '&:hover': {
      cursor: 'pointer',
      border: '1px solid #0156FF',
    },
  },
  btnDisabled: {
    cursor: 'not-allowed',
    color: '#7C8498',
    background: '#1B2341',
    border: '1px solid transparent',
  },
}));

export default function ManualDetail({
  showDetails,
  detailTitle,
  detailValue,
  handleChangeClaim,
  claimValue,
  userBxBalance,
  updatePendingReward,
  accumulatedReward,
}: showDetailsProps) {
  const styles = useStyles();
  const { isMobile } = useScreenSize();
  const { connected, connect } = useWallet();

  return (
    <Collapse
      style={{ width: '100%', marginTop: '28px' }}
      in={showDetails}
      timeout="auto"
      unmountOnExit
    >
      {isMobile ? (
        <Grid container direction="column">
          <Grid container>
            <Grid item sx={{ width: '100%', marginBottom: '12px', padding: '0 3px' }}>
              <Grid className={styles.inner}>
                <Grid container className={styles.innerWrapper}>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <Typography variant="inherit" className={styles.subtitle}>
                      {detailTitle}
                    </Typography>
                    <Typography variant="inherit" className={styles.subtitle}>
                      {detailValue}
                    </Typography>
                  </div>
                  <div className={styles.btnWrapper}>
                    {connected ? (
                      <button className={`${styles.btn} ${styles.btnAllowed}`}>Claim</button>
                    ) : (
                      <button className={`${styles.btn} ${styles.btnDisabled}`}>Auto</button>
                    )}
                  </div>
                </Grid>
              </Grid>
            </Grid>
            <Grid item sx={{ width: '100%', padding: '0 3px' }}>
              <Grid container className={styles.connectWalletWrapper}>
                <Grid
                  container
                  alignItems="center"
                  justifyContent="space-between"
                  alignSelf="flex-end"
                  spacing={2}
                >
                  {!connected ? (
                    <Grid item sx={{ width: '100%' }}>
                      <Grid container className={styles.btnWrapper}>
                        <button onClick={connect} className={`${styles.btn} ${styles.btnAllowed}`}>
                          Connect wallet
                        </button>
                      </Grid>
                    </Grid>
                  ) : (
                    <>
                      <Grid item xs={2}>
                        <Grid container className={styles.btnWrapper}>
                          <MemoClaimPopup
                            userBxBalance={userBxBalance}
                            onChange={undefined}
                            onSubmit={undefined}
                            ifStake={false}
                            claimValue={claimValue}
                            handleChangeClaim={handleChangeClaim}
                            title="-"
                            updatePendingReward={updatePendingReward}
                            accumulatedReward={accumulatedReward}
                          />
                        </Grid>
                      </Grid>
                      <Grid item xs={10}>
                        <Grid container className={styles.btnWrapper}>
                          <MemoClaimPopup
                            userBxBalance={userBxBalance}
                            onChange={undefined}
                            onSubmit={undefined}
                            ifStake={true}
                            claimValue={claimValue}
                            handleChangeClaim={handleChangeClaim}
                            title="Stake BSX"
                            updatePendingReward={updatePendingReward}
                            accumulatedReward={accumulatedReward}
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
      ) : (
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
                        <button className={`${styles.btn} ${styles.btnAllowed}`}>Claim</button>
                      ) : (
                        <button className={`${styles.btn} ${styles.btnDisabled}`}>Auto</button>
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
                          <button
                            onClick={connect}
                            className={`${styles.btn} ${styles.btnAllowed}`}
                          >
                            Connect wallet
                          </button>
                        </Grid>
                      </Grid>
                    ) : (
                      <>
                        <Grid item xs={2}>
                          <Grid container className={styles.btnWrapper}>
                            <MemoClaimPopup
                              userBxBalance={userBxBalance}
                              onChange={undefined}
                              onSubmit={undefined}
                              ifStake={false}
                              claimValue={claimValue}
                              handleChangeClaim={handleChangeClaim}
                              title="-"
                              updatePendingReward={updatePendingReward}
                              accumulatedReward={accumulatedReward}
                            />
                          </Grid>
                        </Grid>
                        <Grid item xs={10}>
                          <Grid container className={styles.btnWrapper}>
                            <MemoClaimPopup
                              userBxBalance={userBxBalance}
                              onChange={undefined}
                              onSubmit={undefined}
                              ifStake={true}
                              claimValue={claimValue}
                              handleChangeClaim={handleChangeClaim}
                              title="Stake BSX"
                              updatePendingReward={updatePendingReward}
                              accumulatedReward={accumulatedReward}
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
      )}
    </Collapse>
  );
}
