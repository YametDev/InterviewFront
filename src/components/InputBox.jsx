import { Input, TextField } from "@mui/material";
import { useState } from "react";

export const InputBox = (props) => {
  const [inerror, insetError] = useState(false);
  const { onChange, regexp, sx, error, setError, maxRows, ...others } = props;
  const filterValue = (str) => {
    if(regexp){
      (setError ?? insetError)(!regexp.test(str));
    }
  }

  return (
    <>
      <TextField
        sx={{
          "& .MuiInputLabel-root": {color: 'black'},
          "& .MuiOutlinedInput-root": {
            "& > fieldset": { borderColor: "black" },
          },
          ".MuiInputBase-root": {
            borderRadius: "10px"
          },
          ...sx,
        }}
        label=""
        required={true}
        error={error ?? inerror}
        onScroll
        fullWidth
        maxRows={maxRows ?? 1}
        color="primary"
        variant="standard"
        onChange={(event) => {
          filterValue(event.target.value);
          if(onChange)
            onChange(event.target.value);
        }}
        { ...others }
        size="small"
      />
    </>
  );
};
