import { Slider, Stack } from "@mui/material";

export const SlideBar = (props) => {
  const { value, setValue, text, ...others } = props;

  const handleChange = (event, newValue) => {
    if (setValue) setValue(newValue);
  };

  return (
    <Stack spacing={0} direction="column" alignItems="center">
      {text && <span>{text}</span>}
      <Slider
        sx={{
          ".MuiSlider-valueLabel": {
            width: "30px",
            height: "30px",
            background: "none",
            padding: "4px",
            borderRadius: "50%",
            transform: "none !important",
            top: "0px",
          },
          ".MuiSlider-thumb": {
            width: "30px",
            height: "30px",
          },
          ".MuiSlider-valueLabel::before": {
            content: "none"
          }
        }}
        getAriaLabel={() => "Price range"}
        value={value}
        onChange={handleChange}
        {...others}
      />
    </Stack>
  );
};
