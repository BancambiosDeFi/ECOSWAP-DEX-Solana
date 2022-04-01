import React, { useMemo, useState } from 'react';
import { DateRangePicker } from 'materialui-daterange-picker';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import CircularProgress from '@mui/material/CircularProgress';
import { makeStyles } from '@mui/styles';
import { useWallet } from '../../components/wallet/wallet';

const useStyles = makeStyles(() => ({
  arrow: {
    padding: 0,
    marginLeft: '5px',
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
    marginLeft: '5px',
    padding: 0,
    width: 0,
    height: 0,
    background: 'transparent',
    borderTop: '10px solid #C4C4C4',
    borderBottom: '0',
    borderLeft: '5px solid transparent',
    borderRight: '5px solid transparent',
    cursor: 'pointer',
  },
  rangePicker: {
    position: 'fixed',
    left: '50%',
    top: '50%',
    zIndex: 11,
    transform: 'translate(-50%,-50%)',
  },
  btn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    minWidth: '250px',
    fontWeight: 400,
    fontSize: '16px',
    border: '0.15px solid #5145FB',
    background: '#1E2022',
    borderRadius: '8px',
    color: '#fff',
    padding: '6px 15px',
  },
  disabledBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontWeight: 400,
    fontSize: '16px',
    border: '0.15px solid #5145FB',
    background: '#1E2022',
    borderRadius: '8px',
    color: '#7C8498',
    padding: '6px 15px',
    pointerEvents: 'none',
    minWidth: '250px',
  },
  divider: {
    background:
      'linear-gradient(232deg, rgba(236, 38, 245, 0.3) 50%, rgba(159, 90, 229, 0.3) 100%)',
    border: 'none',
    height: '1px',
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
  const { connected } = useWallet();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const styles = useStyles();
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
        <Typography component="span">{rangeDate}</Typography>
        <div className={anchorEl ? styles.arrow : styles.rotateArrow} />
      </button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        PaperProps={{
          style: {
            border: '1px solid #0156FF',
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
        <hr className={styles.divider} />
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
          <Button
            style={{ paddingLeft: '10px', color: '#fff' }}
            onClick={() => setShowDataPicker(true)}
          >
            + Custom Data
          </Button>
        </MenuItem>
      </Menu>
    </>
  );
}
