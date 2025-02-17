import { Box } from "@mui/material"

export const BoxContainer = ({ children, sx }) => {
  return(
    <>
      <Box
        noValidate
        autoComplete="off"
        width="100%"
        sx={{
          borderRadius: "15px",
          color: "black",
          ...sx,
        }}
      >
        { children }
      </Box>
    </>
  )
}