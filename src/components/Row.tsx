import React, { cloneElement, useState } from 'react';
import { makeStyles } from '@mui/styles';
import { Grid } from '@mui/material';
import { useScreenSize } from '../utils/screenSize';

interface RowProp {
  imgSrc: any;
  reward: number;
  arp: string;
  totalStaked: number;
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
    background: '#0156FF',
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    width: '100%',
    padding: '25px 15px 15px 15px',
    background: '#0D1226',
    borderRadius: '18px',
  },
  mainContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    // padding: '25px 15px',
    background: '#0D1226',
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
    '@media (max-width: 768px)': {
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
    justifyContent: 'center',
    alignItems: 'center',
    background: '#092667',
    borderRadius: '4px',
    width: '26px',
    height: '26px',
    cursor: 'pointer',
  },
  arrow: {
    padding: 0,
    background: 'transparent',
    borderTop: '10px solid #C4C4C4',
    borderBottom: '0',
    borderLeft: '5px solid transparent',
    borderRight: '5px solid transparent',
    cursor: 'pointer',
  },
  rotateArrow: {
    padding: 0,
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
    '@media (max-width: 768px)': {
      fontSize: '10px',
      lineHeight: '18px',
    },
  },
  value: {
    marginTop: '7px',
  },
}));

export default function Row({ imgSrc, reward, arp, totalStaked, detailMenu }: RowProp) {
  const styles = useStyles();
  const { isMobile, isLargeDesktop } = useScreenSize();
  const [showDetails, setShowDetails] = useState<boolean>(true);
  const toggleShowDetails = () => setShowDetails(!showDetails);

  const rowContent = isMobile ? (
    <Grid container alignItems="center" direction="row" className={styles.container}>
      <Grid container>
        <Grid item xs={4}>
          <img className={styles.img} src={imgSrc} alt="" />
        </Grid>
        <Grid container direction="column" xs={4} item>
          <span className={styles.text}>ACCUMULATED REWARD</span>
          <span className={`${styles.text} ${styles.value}`}>{reward}</span>
        </Grid>
        <Grid container direction="column" xs={3} item>
          <span className={styles.text}>APR</span>
          <span className={`${styles.text} ${styles.value}`}>{arp}</span>
        </Grid>
        <Grid container alignItems="center" xs={1} item>
          <div className={styles.arrowButtonContainer} onClick={toggleShowDetails}>
            <button className={showDetails ? styles.rotateArrow : styles.arrow} />
          </div>
        </Grid>
      </Grid>
      {showDetails ? (
        <Grid container sx={{ paddingTop: '30px' }}>
          {/*<Grid container direction="column" xs={4} item sx={{ paddingLeft: '6px' }}>*/}
          {/*  <span className={styles.text}>STAKED</span>*/}
          {/*  <span className={`${styles.text} ${styles.value}`}>{staked}</span>*/}
          {/*</Grid>*/}
          <Grid container direction="column" xs={4} item>
            <span className={styles.text}>TOTAL STAKED</span>
            <span className={`${styles.text} ${styles.value}`}>{totalStaked}</span>
          </Grid>
        </Grid>
      ) : null}
      {cloneElement(detailMenu, { showDetails })}
    </Grid>
  ) : (
    <Grid container alignItems="center" direction="row" className={styles.container}>
      <Grid container>
        <Grid item xs={isLargeDesktop ? 3 : 1}>
          <img className={styles.img} src={imgSrc} alt="" />
        </Grid>
        <Grid container direction="column" xs={isLargeDesktop ? 3 : 3} item>
          <span className={styles.text}>ACCUMULATED REWARD</span>
          <span className={`${styles.text} ${styles.value}`}>{reward}</span>
        </Grid>
        {/*<Grid container direction="column" xs={isLargeDesktop ? 2 : 3} item>*/}
        {/*  <span className={styles.text}>STAKED</span>*/}
        {/*  <span className={`${styles.text} ${styles.value}`}>{staked}</span>*/}
        {/*</Grid>*/}
        <Grid container direction="column" xs={2} item>
          <span className={styles.text}>APR</span>
          <span className={`${styles.text} ${styles.value}`}>{arp}</span>
        </Grid>
        <Grid container direction="column" xs={isLargeDesktop ? 2 : 3} item>
          <span className={styles.text}>TOTAL STAKED</span>
          <span className={`${styles.text} ${styles.value}`}>{totalStaked}</span>
        </Grid>
        <Grid container alignItems="center" xs={1} item>
          <div className={styles.arrowButtonContainer} onClick={toggleShowDetails}>
            <button className={showDetails ? styles.rotateArrow : styles.arrow} />
          </div>
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
