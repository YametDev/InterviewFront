import LoadingButton from "@mui/lab/LoadingButton";

export const ClickButton = (props) => {
  const { onClick, loading, text, startIcon, sx, children, ...others } = props;
  return (
    <>
      <LoadingButton
        component="label"
        disableElevation
        onClick={onClick}
        loading={loading}
        startIcon={startIcon}
        variant="contained"
        sx={{
          padding: "0.6rem 1rem",
          marginTop: "8px",
          fontWeight: "500",
          borderRadius: "10px",
          transition: "null",
          ...sx,
        }}
        {...others}
      >
        {text}
        {children}
      </LoadingButton>
    </>
  );
};
