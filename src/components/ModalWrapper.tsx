import * as React from "react";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import {DialogContent, Typography} from "@mui/material";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
      background: "#35363A",
  },
  "& .MuiDialogActions-root": {
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
        padding: "16px 16px 16px 16px",
          alignItems: "center",
          background: "#35363A",
      }}
    >
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 10,
            top: 10,
            color: "#FFFFFF",
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

const ModalWrapper: React.FC<CustomizedDialogsProps> = ({
  open,
  title,
  handleClose,
  children,
}) => {
  return (
    <div>
      <BootstrapDialog
        PaperProps={{
          sx: { height: { xs: "55%", md: 400 }, width: { xs: "none", md: 600 } },
        }}
        fullWidth
        maxWidth="sm"
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
        >
            <div><Typography variant={"h2"} align={"center"}>{title}</Typography></div>
        </BootstrapDialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            justifyContent: "center",
            // alignItems: "center",
          }}
        >
          {children}
        </DialogContent>
      </BootstrapDialog>
    </div>
  );
};

export default ModalWrapper;
