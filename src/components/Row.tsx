import React, { useState } from 'react';
import { Theme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Collapse from '@mui/material/Collapse';
import PeriodMenu from '../pages/staking/PeriodMenu';

interface RowProp {
  imgSrc: any;
  reward: number;
  staked: number;
  arp: number;
  liquidity: number;
  setPeriod: (data: any) => void;
  checkedOption: any;
  detailTitle: string;
  detailValue: number;
  options: Array<{ label: string; startDate: number; endDate: number }>;
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
  btn: {
    fontWeight: 400,
    fontSize: '16px',
    border: '0.15px solid #5145FB',
    background: '#1E2022',
    borderRadius: '8px',
    color: '#fff',
    padding: '7px 35px',
    cursor: 'pointer',
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
  fullWidthBtn: {
    alignSelf: 'flex-end',
    fontWeight: 400,
    fontSize: '16px',
    border: '0.15px solid #5145FB',
    background: '#1E2022',
    borderRadius: '8px',
    color: '#fff',
    padding: '7px 35px',
    cursor: 'pointer',
    width: '100%',
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
    padding: '15px',
    borderRadius: '8px',
    background: '#11161d',
  },
}));

export default function Row({
  imgSrc,
  reward,
  staked,
  arp,
  liquidity,
  setPeriod,
  checkedOption,
  detailTitle,
  detailValue,
  options,
}: RowProp) {
  const styles = useStyles();
  const [showDetails, setShowDetails] = useState<boolean>(false);

  const toggleDetails = () => setShowDetails(!showDetails);

  return (
    <Grid
      container
      style={{
        padding: '1px',
        borderRadius: '18px',
        background:
          // eslint-disable-next-line max-len
          'linear-gradient(232deg, rgba(243,55,248,1) 0%, rgba(203,72,239,1) 50%, rgba(159,90,229,1) 100%)',
      }}
    >
      <Grid container alignItems="center" direction="row" className={styles.wrapper}>
        <Grid container>
          <Grid item xs={4}>
            <img className={styles.img} src={imgSrc} alt="" />
          </Grid>
          <Grid container direction="column" xs={2} item>
            <span className={styles.text}>PENDING REWARD</span>
            <span className={styles.text}>{reward}</span>
          </Grid>
          <Grid container direction="column" xs={2} item>
            <span className={styles.text}>STAKED</span>
            <span className={styles.text}>{staked}</span>
          </Grid>
          <Grid container direction="column" xs={2} item>
            <span className={styles.text}>APR</span>
            <span className={styles.text}>{arp}</span>
          </Grid>
          <Grid container alignItems="center" xs={2} item>
            <Grid container direction="column" flexBasis="content">
              <span className={styles.text}>LIQUIDITY</span>
              <span className={styles.text}>{liquidity}</span>
            </Grid>
            <button
              className={showDetails ? styles.rotateArrow : styles.arrow}
              onClick={toggleDetails}
            />
          </Grid>
        </Grid>
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
                      <PeriodMenu
                        options={options}
                        checkedOption={checkedOption}
                        setPeriod={setPeriod}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item sm={6}>
                <Grid className={styles.inner}>
                  <Grid container className={styles.innerWrapper}>
                    <Grid container alignItems="center" justifyContent="space-between">
                      <button className={styles.fullWidthBtn}>Claim</button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Collapse>
      </Grid>
    </Grid>
  );
}
