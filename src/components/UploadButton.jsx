import * as React from "react";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { ClickButton } from ".";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export const UploadButton = (props) => {
  const { onChange, ...others } = props;
  return (
    <ClickButton
      startIcon={<CloudUploadIcon />}
      text="Choose Files"
      {...others}
    >
      <VisuallyHiddenInput
        type="file"
        id="files"
        accept="image/png, image/jpeg"
        onChange={onChange}
      />
    </ClickButton>
  );
};
