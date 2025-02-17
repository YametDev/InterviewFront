import { Box } from "@mui/material"

export const PageBox = ({ children, sx }) => {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          ...sx,
        }}
      >
        { children }
      </Box>
    </>
  )
}