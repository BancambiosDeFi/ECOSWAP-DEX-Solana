import React, { useCallback, useState } from 'react';
import { Theme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import logo from '../../srm-assets/logo.svg';
import BasicLayout from '../../srm-components/BasicLayout';
import Row from '../../components/Row';

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
    paddingLeft: theme.spacing(2),
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

const options = [
  {
    label: 'Week auto compound',
    startDate: new Date().getTime(),
    endDate: new Date().getTime() - 7 * 24 * 60 * 60,
  },
  {
    label: 'Month auto compound',
    startDate: new Date().getTime(),
    endDate: new Date().getTime() - 30 * 24 * 60 * 60,
  },
  {
    label: 'Year auto compound',
    startDate: new Date().getTime(),
    endDate: new Date().getTime() - 365 * 24 * 60 * 60,
  },
];

export default function StakingPage() {
  const styles = useStyles();
  const [checkedOption, setCheckedOption] = useState({});

  const setPeriod = useCallback(
    data => {
      if (typeof data !== 'string') {
        return setCheckedOption(data);
      }
      const checkedOption = options.filter(item => item.label === data)[0];
      setCheckedOption(checkedOption);
    },
    [setCheckedOption],
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
        <Grid container direction="column">
          <Typography variant="inherit" className={styles.title}>
            Auto staking BXS
          </Typography>
          <Grid container alignItems="center" direction="row" className={styles.wrapper}>
            <Row
              options={options}
              checkedOption={checkedOption}
              setPeriod={setPeriod}
              imgSrc={logo}
              reward={11}
              staked={22}
              arp={33}
              liquidity={44}
              detailTitle="Harvest"
              detailValue={15}
            />
          </Grid>
          <Typography variant="inherit" className={styles.title}>
            Auto staking BXS
          </Typography>
          <Grid container alignItems="center" direction="row" className={styles.wrapper}>
            <Row
              options={options}
              checkedOption={checkedOption}
              setPeriod={setPeriod}
              imgSrc={logo}
              reward={11}
              staked={22}
              arp={33}
              liquidity={44}
              detailTitle="Auto"
              detailValue={15}
            />
          </Grid>
        </Grid>
      </Grid>
    </BasicLayout>
  );
}
