import React, { useCallback, useState } from 'react';
import { Theme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Tooltip from '@mui/material/Tooltip';
import logo from '../../assets/icons/banc-logo.png';
import infoIcon from '../../srm-assets/info.svg';
import BasicLayout from '../../srm-components/BasicLayout';
import Row from '../../components/Row';
import ManualDetail from './ManualDetail';
import AutoDetail from './AutoDetail';

const useStyles = makeStyles((theme: Theme) => ({
  wrapper: {
    padding: '22px 15px',
    borderRadius: '18px',
  },
  root: {
    padding: '0 235px',
    minHeight: '100vh',
  },
  title: {
    padding: theme.spacing(6, 0, 2, 2),
    fontSize: '24px',
    fontWeight: 700,
    fontFamily: 'Saira',
  },
  expiresTitle: {
    padding: theme.spacing(6, 2, 2, 0),
    color: '#AEAEAF',
    fontSize: '24px',
    fontFamily: 'Saira',
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

  const [claimValue, setClaimValue] = useState<number>(0);

  const handleChangeClaim = useCallback(
    e => {
      setClaimValue(e.target?.value);
    },
    [setClaimValue],
  );

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
          <Grid container justifyContent="space-between">
            <Typography variant="inherit" className={styles.title}>
              Manual staking BXS
            </Typography>
            <Typography variant="inherit" className={styles.expiresTitle}>
              Expires in
              <CircularProgress
                thickness={7}
                variant="determinate"
                color="primary"
                size={15}
                value={63}
                style={{ margin: '0 5px' }}
              />
              <Tooltip title="Delete aaa" placement="top-start">
                <>
                  <img src={infoIcon} alt="" />
                </>
              </Tooltip>
            </Typography>
          </Grid>
          <Grid container alignItems="center" direction="row" className={styles.wrapper}>
            <Row
              options={options}
              checkedOption={checkedOption}
              setPeriod={setPeriod}
              claimValue={claimValue}
              imgSrc={logo}
              reward={11}
              staked={22}
              arp={33}
              liquidity={44}
              detailTitle="Harvest"
              detailValue={15}
              detailMenu={
                <ManualDetail
                  detailTitle="PENDING REWARD"
                  detailValue={0}
                  handleChangeClaim={handleChangeClaim}
                  claimValue={claimValue}
                />
              }
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
              claimValue={claimValue}
              imgSrc={logo}
              reward={11}
              staked={22}
              arp={33}
              liquidity={44}
              detailTitle="Auto"
              detailValue={15}
              detailMenu={
                <AutoDetail
                  claimValue={claimValue}
                  handleChangeClaim={handleChangeClaim}
                  detailTitle="Auto-Compound"
                  detailValue={0}
                  checkedOption={checkedOption}
                  setPeriod={setPeriod}
                  options={options}
                />
              }
            />
          </Grid>
        </Grid>
      </Grid>
    </BasicLayout>
  );
}
