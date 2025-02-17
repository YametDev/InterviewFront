import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
} from "@mui/material";
import { Label } from "./Label";

export const CheckSelector = (props) => {
  const { title, subtitle, items, value, onChange } = props;

  return (
    <div>
      <div>
        <Label sx={{ mb: 0 }}>{title}</Label>
        <FormLabel>{subtitle}</FormLabel>
      </div>
      {[0, 1].map((ref) => (
        <FormControl key={ref}>
          <FormGroup>
            {items
              .filter(
                (_, index) =>
                  index * 2 >= ref * items.length &&
                  index * 2 < (ref + 1) * items.length
              )
              .map((item, index) => (
                <FormControlLabel
                  key={index}
                  control={
                    <Checkbox
                      checked={value.some((v) => v === item.value)}
                      onChange={(event) => {
                        const { checked } = event.target;
                        if (checked) {
                          onChange([...value, item.value]);
                        } else {
                          onChange(value.filter((v) => v !== item.value));
                        }
                      }}
                    />
                  }
                  label={item.label}
                />
              ))}
          </FormGroup>
        </FormControl>
      ))}
    </div>
  );
};
