import * as React from 'react';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
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
    border: '1px solid #0156FF',
    borderBottom: 'none',
  },
}));

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
    background: '#0D1226',
    border: '1px solid #0156FF',
    borderTop: 'none',
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

const BootstrapDialogTitle = (props: DialogTitleProps) => {
  const { children, onClose } = props;

  return (
    <DialogTitle
      sx={{
        m: 0,
        padding: '16px 16px 16px 16px',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0D1226',
      }}
    >
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 10,
            top: 10,
            color: '#f6f6f6',
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

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
          height: { xs: '55%', md: '192.1px' },
          width: { xs: 'none', md: '379.51px' },
          borderRadius: '8px',
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
          // alignItems: "center",
        }}
      >
        {children}
      </DialogContent>
    </BootstrapDialog>
  );
};

export default ModalWrapper;
