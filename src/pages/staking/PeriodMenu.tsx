import React, { useMemo, useState } from 'react';
import { DateRangePicker } from 'materialui-daterange-picker';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { makeStyles } from '@mui/styles';
import CircularProgress from '@mui/material/CircularProgress';
import { useWallet } from '../../components/wallet/wallet';

const useStyles = makeStyles(() => ({
  rangePicker: {
    position: 'fixed',
    left: '50%',
    top: '50%',
    zIndex: 11,
    transform: 'translate(-50%,-50%)',
  },
  btn: {
    width: '250px',
    fontWeight: 400,
    fontSize: '16px',
    border: '0.15px solid #5145FB',
    background: '#1E2022',
    borderRadius: '8px',
    color: '#fff',
    padding: '7px 35px',
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
  pickerWrapper: {
    '& h6': {
      color: 'black !important',
    },
    '& div': {
      padding: 0,
    },
  },
}));

export default function PeriodMenu({ options, setPeriod, checkedOption }) {
  const styles = useStyles();
  const { connected } = useWallet();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showDataPicker, setShowDataPicker] = useState<boolean>(false);
  const [openRangePicker, setOpenRangePicker] = useState<boolean>(true);

  const toggleRangePicker = () => setOpenRangePicker(!openRangePicker);

  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleChangePeriod = data => {
    setAnchorEl(null);
    setPeriod(data);
    setShowDataPicker(false);
  };

  const rangeDate = useMemo(() => {
    return (
      checkedOption?.label ||
      (checkedOption?.startDate?.getDate() &&
        checkedOption?.startDate?.getDate() +
          '.' +
          checkedOption?.startDate?.getMonth() +
          '.' +
          checkedOption?.startDate?.getFullYear() +
          '-' +
          checkedOption?.endDate?.getDate() +
          '.' +
          checkedOption?.endDate?.getMonth() +
          '.' +
          checkedOption?.endDate?.getFullYear()) ||
      'please check period'
    );
  }, [checkedOption]);

  return (
    <>
      <button
        className={connected ? styles.btn : styles.disabledBtn}
        id="basic-button"
        aria-controls="basic-menu"
        aria-haspopup="true"
        aria-expanded={anchorEl ? 'true' : undefined}
        onClick={handleOpenMenu}
      >
        {rangeDate}
      </button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        PaperProps={{
          style: {
            width: '250px',
            right: 0,
            backgroundColor: '#35363A',
          },
        }}
      >
        {options.map(({ label }) => {
          return (
            <MenuItem key={label} onClick={() => handleChangePeriod(label)}>
              <CircularProgress
                variant="determinate"
                color={checkedOption?.label === label ? 'primary' : 'inherit'}
                size={15}
                value={100}
              />
              <Typography style={{ paddingLeft: '10px' }}>{label}</Typography>
            </MenuItem>
          );
        })}
        <MenuItem style={{ position: 'relative' }}>
          {showDataPicker && (
            <div className={styles.rangePicker}>
              <DateRangePicker
                wrapperClassName={styles.pickerWrapper}
                definedRanges={[]}
                open={openRangePicker}
                toggle={toggleRangePicker}
                onChange={range => handleChangePeriod(range)}
              />
            </div>
          )}
          <Button style={{ paddingLeft: '10px' }} onClick={() => setShowDataPicker(true)}>
            + Custom Data
          </Button>
        </MenuItem>
      </Menu>
    </>
  );
}
