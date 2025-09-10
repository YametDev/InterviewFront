import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import { InputBox } from "./InputBox";
import { SeekerSelector } from "./SeekerSelector";
import { StateSelector } from "./StateSelector";
import { Autocomplete, Chip, TextField, Box } from "@mui/material";

export const ApplicationEditer = (props) => {
  const { onClose, open, onChange, application, onSave, editableColumns, skills = [], createSkill, setSkills, users = [], ...other } = props;
  
  // Default editable columns if not provided
  const defaultEditableColumns = [
    { property: "userId", display: "Seeker" },
    { property: "state", display: "State" },
    { property: "link", display: "Link" },
    { property: "company", display: "Company" },
    { property: "role", display: "Role" },
    { property: "salary", display: "Salary" },
    { property: "skills", display: "Skills" },
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

  const renderEditor = (column) => {
    const prop = column.property;
    const value = application[prop];

    if (prop === "userId") {
      return (
        <SeekerSelector
          value={value}
          onChange={(newValue) => onChange({ ...application, userId: newValue })}
          items={users}
          width={130}
        />
      );
    }

    if (prop === "state") {
      return (
        <StateSelector
          value={value}
          onChange={(newValue) => onChange({ ...application, state: newValue })}
          width={70}
        />
      );
    }

    if (prop === "skills") {
      const selected = Array.isArray(value) ? value : [];
      return (
        <Autocomplete
          multiple
          freeSolo
          options={skills}
          getOptionLabel={(opt) => (typeof opt === "string" ? opt : opt.name)}
          value={selected
            .map((sid) => skills.find((s) => s.sid === sid))
            .filter(Boolean)}
          size="small"
          onChange={async (_, newSelected) => {
            const last = newSelected.at(-1);
            if (typeof last === "string") {
              const input = last.trim();
              const exact = skills.find((s) => s.name.toLowerCase() === input.toLowerCase());
              if (exact) {
                onChange({ ...application, skills: [...new Set(newSelected.map((s) => (typeof s === "string" ? exact.sid : s.sid)))] });
              } else if (createSkill) {
                createSkill({ name: input }, (resp) => {
                  if (resp.result && resp.data) {
                    const created = { sid: resp.data.sid, name: resp.data.name };
                    if (setSkills) {
                      setSkills((prev) => (prev.some((p) => p.sid === created.sid) ? prev : [...prev, created]));
                    }
                    onChange({ ...application, skills: newSelected.map((s) => (typeof s === "string" ? created.sid : s.sid)) });
                  }
                });
              }
            } else {
              onChange({ ...application, skills: newSelected.map((s) => s.sid) });
            }
          }}
          renderTags={(sel) => {
            if (!sel.length) return null;
            const [first, ...rest] = sel;
            return (
              <>
                <Chip key={first.sid} label={first.name} size="small" />
                {rest.length > 0 && <Chip key="more" label={`+${rest.length}`} size="small" />}
              </>
            );
          }}
          renderInput={(params) => (
            <TextField {...params} variant="standard" placeholder="Add skills" />
          )}
        />
      );
    }

    // Fallback to InputBox
    return (
      <InputBox
        value={value ?? ""}
        onChange={(newValue) => onChange({ ...application, [prop]: newValue })}
        variant={prop === "description" ? "outlined" : "standard"}
        multiline={prop === "description"}
        maxRows={prop === "description" ? 7 : 1}
      />
    );
  };

  return (
    <Dialog fullWidth open={open} onClose={handleClose} {...other}>
      <DialogTitle>Edit Application</DialogTitle>
      <DialogContent dividers>
        {columns.map((column) => (
          <div key={column.property}>
            <p style={{ marginBottom: 2 }}><b>{column.display}</b></p>
            {renderEditor(column)}
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
