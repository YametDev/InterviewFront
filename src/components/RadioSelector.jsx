import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";

export const RadioSelector = (props) => {
  const { title, items, defaultValue, onChange } = props;

  return (
    <FormControl>
      <FormLabel>{title}</FormLabel>
      <RadioGroup
        aria-labelledby="demo-radio-buttons-group-label"
        defaultValue={defaultValue}
        name="radio-buttons-group"
        onChange={onChange}
      >
        {items.map((radio, index) => (
          <FormControlLabel
            key={index}
            value={radio.value}
            control={<Radio />}
            label={radio.label}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};
