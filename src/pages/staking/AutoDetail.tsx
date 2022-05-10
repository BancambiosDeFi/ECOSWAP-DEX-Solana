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
  checkedOption: any;
  setPeriod: (data: any) => void;
  claimValue: number;
  handleChangeClaim: (data: any) => void;
  options: Array<{ label: string; startDate: number; endDate: number }>;
}

const useStyles = makeStyles(() => ({
  subtitle: {
    'fontFamily': 'Saira',
    'fontWeight': 800,
    'fontSize': '16px',
    'lineHeight': '40px',
    'letterSpacing': '0em',
    'textAlign': 'left',
    '@media (max-width: 540px)': {
      fontWeight: 700,
      fontSize: '10px',
      lineHeight: '25px',
    },
  },
  divider: {
    background:
      'linear-gradient(232deg, rgba(236, 38, 245, 0.3) 50%, rgba(159, 90, 229, 0.3) 100%)',
    border: 'none',
    margin: '15px 0 15px',
    height: '1px',
  },
  inner: {
    height: '100%',
    padding: '1px',
    borderRadius: '8px',
    background:
      'linear-gradient(232deg, rgba(236, 38, 245, 0.3) 50%, rgba(159, 90, 229, 0.3) 100%)',
  },
  innerWrapper: {
    'height': '100%',
    'padding': '15px 15px 5px',
    'borderRadius': '8px',
    'background': '#0a0c0f',
    '@media (max-width: 540px)': {
      padding: '0 16px',
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
  },
  connectWalletWrapper: {
    'height': '100%',
    'borderRadius': '8px',
    'background': '#0a0c0f',
    '@media (max-width: 540px)': {
      padding: '0 8px',
    },
  },
  btnWrapper: {
    'marginBottom': '10px',
    'padding': '0.5px',
    'borderRadius': '8px',
    'background': 'linear-gradient(232deg, #0156FF 30%, #EC26F5 100%)',
    '@media (max-width: 540px)': {
      margin: '20px 0',
    },
  },
  btn: {
    padding: '7px 35px',
    width: '100%',
    border: 'none',
    fontSize: '16px',
    background: '#202124',
    borderRadius: '8px',
    fontFamily: 'Saira',
  },
  btnAllowed: {
    '&:hover': {
      cursor: 'pointer',
      background:
        // eslint-disable-next-line max-len
        'linear-gradient(257.52deg, #0156FF -5.37%, #9F5AE5 84.69%) padding-box, linear-gradient(257.52deg, #0156FF -5.37%, #9F5AE5 84.69%) border-box',
      boxShadow: '0px 0px 16px #9F5AE5',
    },
  },
  btnDisabled: {
    cursor: 'not-allowed',
    color: '#7C8498',
  },
}));

export default function ManualDetail({
  showDetails,
  detailTitle,
  detailValue,
  claimValue,
  handleChangeClaim,
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
                    <button className={`${styles.btn} ${styles.btnDisabled}`}>Claim</button>
                  </div>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item sm={6}>
            <Grid className={styles.inner}>
              <Grid container className={styles.innerWrapper}>
                <Grid container alignItems="flex-end" justifyContent="space-between" spacing={2}>
                  {!connected ? (
                    <Grid item xs={12}>
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
                          <button className={`${styles.btn} ${styles.btnAllowed}`}>Claim</button>
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
