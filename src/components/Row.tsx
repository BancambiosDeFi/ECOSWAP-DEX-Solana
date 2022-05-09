import React, { cloneElement, useState } from 'react';
import { makeStyles } from '@mui/styles';
import { Grid } from '@mui/material';
import { useScreenSize } from '../utils/screenSize';

interface RowProp {
  imgSrc: any;
  reward: number;
  staked: number;
  arp: number;
  liquidity: number;
  setPeriod: (data: any) => void;
  claimValue: number;
  checkedOption: any;
  detailTitle: string;
  detailValue: number;
  detailMenu: JSX.Element;
  options: Array<{ label: string; startDate: number; endDate: number }>;
}

const useStyles = makeStyles(() => ({
  wrapper: {
    padding: '1px',
    borderRadius: '18px',
    background: 'linear-gradient(232deg, #0156FF 10%, #EC26F5 100%)',
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: '25px 15px',
    background: '#0a0c0f',
    borderRadius: '18px',
  },
  mainContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    // padding: '25px 15px',
    background: '#0a0c0f',
    borderRadius: '18px',
  },

  rowContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: '15px 26px 15px 14px',
    background: '#0a0c0f',
    borderRadius: '18px',
  },
  imgWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  img: {
    'width': '30px',
    'height': '30px',
    '@media (max-width: 785px)': {
      width: '34px',
      height: '34px',
    },
  },
  firstContentWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondContentWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'start',
    width: '100%',
    padding: '0 0 0 20px',
  },
  contentInfoBlock: {
    'display': 'flex',
    'flexDirection': 'column',
    '&:first-child': {
      marginRight: '27px',
    },
  },
  arrowButtonContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrow: {
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
  rotateArrow: {
    padding: 0,
    margin: '15px',
    width: 0,
    height: 0,
    background: 'transparent',
    borderTop: '0',
    borderBottom: '10px solid #C4C4C4',
    borderLeft: '5px solid transparent',
    borderRight: '5px solid transparent',
    cursor: 'pointer',
  },
  text: {
    'fontFamily': 'Saira',
    'fontSize': '16px',
    'fontWeight': 400,
    'lineHeight': '29px',
    'letterSpacing': '0em',
    'textAlign': 'left',
    'color': 'rgba(222, 227, 243, 1)',
    '@media (max-width: 785px)': {
      fontSize: '10px',
      lineHeight: '18px',
    },
  },
  value: {
    marginTop: '7px',
  },
}));

export default function Row({ imgSrc, reward, staked, arp, liquidity, detailMenu }: RowProp) {
  const styles = useStyles();
  const { isScreenLess } = useScreenSize();
  const [showDetails, setShowDetails] = useState<boolean>(true);
  const toggleShowDetails = () => setShowDetails(!showDetails);

  const rowContent = isScreenLess ? (
    <Grid container alignItems="center" direction="row" className={styles.container}>
      <Grid container>
        <Grid item xs={4}>
          <img className={styles.img} src={imgSrc} alt="" />
        </Grid>
        <Grid container direction="column" xs={4} item>
          <span className={styles.text}>PENDING REWARD</span>
          <span className={`${styles.text} ${styles.value}`}>{reward}</span>
        </Grid>
        <Grid container direction="column" xs={3} item>
          <span className={styles.text}>APR</span>
          <span className={`${styles.text} ${styles.value}`}>{arp}</span>
        </Grid>
        <Grid container alignItems="center" xs={1} item>
          <button
            className={showDetails ? styles.rotateArrow : styles.arrow}
            onClick={toggleShowDetails}
          />
        </Grid>
      </Grid>
      {showDetails ? (
        <Grid container sx={{ paddingTop: '30px' }}>
          <Grid container direction="column" xs={4} item sx={{ paddingLeft: '6px' }}>
            <span className={styles.text}>STAKED</span>
            <span className={`${styles.text} ${styles.value}`}>{staked}</span>
          </Grid>
          <Grid container direction="column" xs={4} item>
            <span className={styles.text}>LIQUIDITY</span>
            <span className={`${styles.text} ${styles.value}`}>{liquidity}</span>
          </Grid>
        </Grid>
      ) : null}
      {cloneElement(detailMenu, { showDetails })}
    </Grid>
  ) : (
    <Grid container alignItems="center" direction="row" className={styles.container}>
      <Grid container>
        <Grid item xs={4}>
          <img className={styles.img} src={imgSrc} alt="" />
        </Grid>
        <Grid container direction="column" xs={2} item>
          <span className={styles.text}>PENDING REWARD</span>
          <span className={`${styles.text} ${styles.value}`}>{reward}</span>
        </Grid>
        <Grid container direction="column" xs={2} item>
          <span className={styles.text}>STAKED</span>
          <span className={`${styles.text} ${styles.value}`}>{staked}</span>
        </Grid>
        <Grid container direction="column" xs={2} item>
          <span className={styles.text}>APR</span>
          <span className={`${styles.text} ${styles.value}`}>{arp}</span>
        </Grid>
        <Grid container alignItems="center" xs={2} item>
          <Grid container direction="column" flexBasis="content">
            <span className={styles.text}>LIQUIDITY</span>
            <span className={`${styles.text} ${styles.value}`}>{liquidity}</span>
          </Grid>
          <button
            className={showDetails ? styles.rotateArrow : styles.arrow}
            onClick={toggleShowDetails}
          />
        </Grid>
      </Grid>
      {cloneElement(detailMenu, { showDetails })}
    </Grid>
  );

  return (
    <Grid container className={styles.wrapper}>
      {rowContent}
    </Grid>
  );
}
