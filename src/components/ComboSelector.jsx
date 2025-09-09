import { FormControl, MenuItem, Select } from "@mui/material";

export const ComboSelector = (props) => {
  const { items, ...others } = props;

  return (
    <FormControl
      variant="standard"
      size="small"
      sx={{ fontSize: "12px !important" }}
      fullWidth
      {...others}
      tabIndex={-1}
    >
      <Select
        size="small"
        labelId="demo-simple-select-label"
        sx={{ fontSize: "12px !important" }}
        tabIndex={-1}
        {...others}
      >
        {items.map((item, index) => (
          <MenuItem
            key={index}
            value={item.value}
            sx={{ fontSize: "12px !important" }}
            tabIndex={-1}
          >
            {item.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
