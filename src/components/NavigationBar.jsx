import { Stack } from "@mui/material";
import Link from "next/link";
import { Label } from "./Label";

export const NavigationBar = (props) => {
  const { navs, value } = props;

  return (
    <Stack direction="row" spacing={1}>
      {navs.map((nav, index) => (
        <>
          {index !== 0 && (
            <div>
              <Label>/</Label>
            </div>
          )}
          <Link href={nav.link} className="tab">
            <Label sx={{ fontWeight: value === index ? 800 : 400 }}>
              {value === index ? <u>{nav.title}</u> : <>{nav.title}</>}
            </Label>
          </Link>
        </>
      ))}
    </Stack>
  );
};
