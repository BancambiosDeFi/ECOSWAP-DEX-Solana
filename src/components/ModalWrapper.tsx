import * as React from 'react';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import { DialogContent, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
  modalTitleText: {
    paddingTop: '10px',
    display: 'flex',
    justifyContent: 'center',
    background: '#0D1226',
    color: '#ffffff',
    fontSize: '24px',
    fontFamily: '"Saira"',
    border: 'none',
    borderBottom: 'none',
  },
}));

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
    background: '#0D1226',
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

interface CustomizedDialogsProps {
  open: boolean;
  title: string;
  handleClose: () => void;
  children: React.ReactElement;
}

const ModalWrapper: React.FC<CustomizedDialogsProps> = ({ open, title, handleClose, children }) => {
  const classes = useStyles();

  return (
    <BootstrapDialog
      PaperProps={{
        sx: {
          height: { xs: 'none', md: '192.1px' },
          width: { xs: 'none', md: '379.51px' },
          borderRadius: '8px',
          border: '2px solid #0156FF',
        },
      }}
      fullWidth
      maxWidth="sm"
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
    >
      <Typography variant="inherit" className={classes.modalTitleText}>
        {title}
      </Typography>
      <DialogContent
        sx={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        {children}
      </DialogContent>
    </BootstrapDialog>
  );
};

export default ModalWrapper;
