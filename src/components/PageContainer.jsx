import { Container } from "@mui/material";

export const PageContainer = (props) => {
  const { children, sx } = props;
  return (
    <>
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          overflow: "auto",
          padding: 0,
          ...sx,
        }}
      >
        {children}
      </Container>
    </>
  );
};
