import React, { useState } from 'react';
import { makeStyles } from '@mui/styles';
import Grid from '@mui/material/Grid';

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
    padding: '25px 15px',
    background: '#0a0c0f',
    borderRadius: '18px',
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
    fontFamily: 'Saira',
    lineHeight: '16px',
  },
  value: {
    marginTop: '7px',
  },
}));

export default function Row({ imgSrc, reward, staked, arp, liquidity, detailMenu }: RowProp) {
  const styles = useStyles();
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const toggleShowDetails = () => setShowDetails(!showDetails);

  return (
    <Grid container className={styles.wrapper}>
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
        {React.cloneElement(detailMenu, { showDetails })}
      </Grid>
    </Grid>
  );
}
