import { Typography } from "@mui/material";

export const Label = (props) => {
  const { text, sx, children, ...others } = props;

  return (
    <Typography
      sx={{
        fontFamily: "Arial Light",
        fontWeight: 800,
        letterSpacing: 1,
        my: 3,
        ...sx,
      }}
      {...others}
    >
      {text}
      {children}
    </Typography>
  );
};
