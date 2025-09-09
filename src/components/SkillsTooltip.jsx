import React from "react";
import { Tooltip, Box } from "@mui/material";

/**
 * SkillsTooltip
 * Reusable tooltip for listing skills in a stacked, readable format.
 * - Comfortable light theme by default.
 * - Accepts an array of items (strings or objects with `name` and optional `sid`).
 * - Supports variant switching ("light" | "dark").
 */
export const SkillsTooltip = ({
  items = [],
  children,
  placement = "top",
  variant = "light",
  slotProps: slotPropsIn,
  ...tooltipProps
}) => {
  const getKey = (item, index) => (item?.sid ?? item?.id ?? item?.name ?? index);
  const getLabel = (item) => (typeof item === "string" ? item : item?.name ?? "");

  const light = {
    tooltip: {
      bgcolor: "#fffdfa",
      color: "grey.900",
      fontSize: "1rem",
      fontWeight: 600,
      p: 1,
      borderRadius: 1,
      boxShadow: 3,
      border: "1px solid",
      borderColor: "grey.300",
      whiteSpace: "normal",
      lineHeight: 1.7,
      maxWidth: 360,
    },
    arrow: { color: "#fffdfa" },
  };

  const dark = {
    tooltip: {
      bgcolor: "grey.900",
      color: "common.white",
      fontSize: "0.95rem",
      fontWeight: 600,
      p: 1,
      borderRadius: 1,
      boxShadow: 6,
      whiteSpace: "normal",
      lineHeight: 1.6,
      maxWidth: 320,
    },
    arrow: { color: "grey.900" },
  };

  const palette = variant === "dark" ? dark : light;

  const content = (
    <Box>
      {items.map((o, idx) => (
        <div key={getKey(o, idx)}>{getLabel(o)}</div>
      ))}
    </Box>
  );

  const mergedSlotProps = {
    tooltip: { sx: { ...palette.tooltip, ...(slotPropsIn?.tooltip?.sx || {}) } },
    arrow: { sx: { color: palette.arrow.color, ...(slotPropsIn?.arrow?.sx || {}) } },
  };

  return (
    <Tooltip
      title={content}
      placement={placement}
      arrow
      slotProps={mergedSlotProps}
      {...tooltipProps}
    >
      {children}
    </Tooltip>
  );
};

export default SkillsTooltip;