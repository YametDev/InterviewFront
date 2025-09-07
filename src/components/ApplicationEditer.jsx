import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import { InputBox } from "./InputBox";

export const ApplicationEditer = (props) => {
  const { onClose, open, onChange, application, onSave, editableColumns, ...other } = props;
  
  // Default editable columns if not provided
  const defaultEditableColumns = [
    { property: "link", display: "Link" },
    { property: "company", display: "Company" },
    { property: "role", display: "Role" },
    { property: "salary", display: "Salary" },
    { property: "description", display: "Description" }
  ];
  
  const columns = editableColumns || defaultEditableColumns;

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
          <div key={column.property}>
            <p style={{ marginBottom: 2 }}><b>{column.display}</b></p>
            <InputBox
              value={application[column.property] || ""}
              onChange={(newValue) =>
                onChange({
                  ...application,
                  [column.property]: newValue,
                })
              }
              variant={column.property === "description" ? "outlined" : "standard"}
              multiline={column.property === "description" ? true : false}
              maxRows={column.property === "description" ? 7 : 1}
            />
          </div>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSave}>Save</Button>
        <Button onClick={handleClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};
