import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";

import Cropper from "react-easy-crop";
import { useEffect, useRef, useState } from "react";
import { DialogTitle, IconButton } from "@mui/material";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import UnfoldLessIcon from "@mui/icons-material/UnfoldLess";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";

export const CropDialog = (props) => {
  const { onClose, onCrop, image, open, btnTitle, ...other } = props;

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [high, setHigh] = useState(300);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const moveOffset = (x, y) => {
    setCrop({ x: crop.x + x, y: crop.y + y });
  };

  const zoomOffset = (offset) => setZoom(zoom + offset);

  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      image.setAttribute("crossOrigin", "anonymous"); // needed to avoid cross-origin issues on CodeSandbox
      image.src = url;
    });

  const getRadianAngle = (degreeValue) => {
    return (degreeValue * Math.PI) / 180;
  };

  const rotateSize = (width, height, rotation) => {
    const rotRad = getRadianAngle(rotation);

    return {
      width:
        Math.abs(Math.cos(rotRad) * width) +
        Math.abs(Math.sin(rotRad) * height),
      height:
        Math.abs(Math.sin(rotRad) * width) +
        Math.abs(Math.cos(rotRad) * height),
    };
  };

  const getCroppedImg = async (
    imageSrc,
    pixelCrop,
    rotation = 0,
    flip = { horizontal: false, vertical: false }
  ) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      return null;
    }

    const rotRad = getRadianAngle(rotation);

    // calculate bounding box of the rotated image
    const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
      image.width,
      image.height,
      rotation
    );

    // set canvas size to match the bounding box
    canvas.width = bBoxWidth;
    canvas.height = bBoxHeight;

    // translate canvas context to a central location to allow rotating and flipping around the center
    ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
    ctx.rotate(rotRad);
    ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
    ctx.translate(-image.width / 2, -image.height / 2);

    // draw rotated image
    ctx.drawImage(image, 0, 0);

    const croppedCanvas = document.createElement("canvas");

    const croppedCtx = croppedCanvas.getContext("2d");

    if (!croppedCtx) {
      return null;
    }

    // Set the size of the cropped canvas
    croppedCanvas.width = pixelCrop.width;
    croppedCanvas.height = pixelCrop.height;

    // Draw the cropped image onto the new canvas
    croppedCtx.drawImage(
      canvas,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    // As Base64 string
    // return croppedCanvas.toDataURL('image/jpeg');

    // As a blob
    return new Promise((resolve, reject) => {
      croppedCanvas.toBlob((file) => {
        resolve(file);
      }, "image/jpeg");
    });
  };

  const handleClose = () => {
    if (onClose) onClose();
  };

  const handleCrop = async () => {
    if (onCrop) {
      console.log("Here !");
      try {
        const croppedImage = await getCroppedImg(image, croppedAreaPixels, 0);
        onCrop(croppedImage);
      } catch (e) {
        console.error(e);
      }
    }
    if (onClose) onClose();
  };

  return (
    <Dialog open={open} {...other}>
      <DialogTitle>
        Crop Image
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent
        dividers
        sx={{
          position: "relative",
          height: 360,
          width: 360,
          overflow: "hidden",
          margin: "auto",
        }}
      >
        <div className="crop-container">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            cropSize={{ width: 300, height: high }}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            objectFit="cover"
          />
        </div>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center" }}>
        <IconButton
          color="primary"
          onClick={() => zoomOffset(zoom == 3 ? 0 : 0.1)}
          size="xs"
        >
          <ZoomInIcon />
        </IconButton>
        <IconButton
          color="primary"
          onClick={() => zoomOffset(zoom == 1 ? 0 : -0.1)}
          size="xs"
        >
          <ZoomOutIcon />
        </IconButton>
        <IconButton color="primary" onClick={() => moveOffset(-5, 0)} size="xs">
          <ArrowLeftIcon />
        </IconButton>
        <IconButton color="primary" onClick={() => moveOffset(0, -5)} size="xs">
          <ArrowDropUpIcon />
        </IconButton>
        <IconButton color="primary" onClick={() => moveOffset(5, 0)} size="xs">
          <ArrowRightIcon />
        </IconButton>
        <IconButton color="primary" onClick={() => moveOffset(0, 5)} size="xs">
          <ArrowDropDownIcon />
        </IconButton>
        <IconButton
          color="primary"
          onClick={() => setHigh(high == 300 ? high : high + 10)}
          size="xs"
        >
          <UnfoldMoreIcon />
        </IconButton>
        <IconButton
          color="primary"
          onClick={() => setHigh(high == 150 ? high : high - 10)}
          size="xs"
        >
          <UnfoldLessIcon />
        </IconButton>
        <IconButton color="primary" onClick={handleCrop} size="xs">
          <SaveIcon />
        </IconButton>
      </DialogActions>
    </Dialog>
  );
};
