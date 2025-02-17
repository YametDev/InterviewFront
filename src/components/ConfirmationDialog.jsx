import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";

export const ConfirmationDialog = (props) => {
  const { onClose, open, children, btnTitle, ...other } = props;

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog
      maxWidth="xs"
      open={open}
      {...other}
    >
      <DialogTitle>InterviewIO</DialogTitle>
      <DialogContent dividers>{children}</DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{btnTitle ?? "DONE"}</Button>
      </DialogActions>
    </Dialog>
  );
};
