import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import { InputBox } from "./InputBox";

export const ApplicationEditer = (props) => {
  const { onClose, open, onChange, application, onSave, ...other } = props;
  const columns = ["Link", "Company", "Role", "Salary", "Description"];

  const handleClose = () => {
    if (onClose) onClose();
  };

  const handleSave = () => {
    if (onSave) onSave();
    handleClose();
  };

  return (
    <Dialog fullWidth open={open} onClose={handleClose} {...other}>
      <DialogTitle>Edit Application</DialogTitle>
      <DialogContent dividers>
        {columns.map((column) => (
          <>
            <p style={{ marginBottom: 2 }}><b>{column}</b></p>
            <InputBox
              value={application[column.toLowerCase()]}
              onChange={(newValue) =>
                onChange({
                  ...application,
                  [column.toLowerCase()]: newValue,
                })
              }
              variant={column === "Description" ? "outlined" : "standard"}
              multiline={column === "Description" ? true : false}
              maxRows={column === "Description" ? 7 : 1}
            ></InputBox>
          </>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSave}>Save</Button>
        <Button onClick={handleClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};
