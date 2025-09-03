import React, { useEffect, useState } from "react";

import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Link from "@mui/material/Link";

import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";

import { createTheme, ThemeProvider } from "@mui/material/styles";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

import { useRouter } from "next/router";
import { lookupUser, setCookie } from "@/actions";

const theme = createTheme();

const SignInPage = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);

  const handleSignIn = () => {
    lookupUser({ email }, (response) => {
      if (response.result && response.data.length) {
        setCookie("jobseeker", response.data[0].email);
        router.push("/");
      } else {
        setEmailError(true);
        console.log(response);
      }
    });
  };

  useEffect(() => {
    setEmailError(false);
  }, [email]);

  return (
    <ThemeProvider theme={theme}>
      <Grid container height="100vh">
        <CssBaseline />
        {/* Left image section */}
        <Grid
          size={{ xs: 0, sm: 4, md: 7 }}
          sx={{
            backgroundImage: "url(https://source.unsplash.com/random)",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        {/* Right form section */}
        <Grid size={{ xs: 12, sm: 8, md: 5 }} component={Paper} elevation={6}>
          <div
            style={{
              margin: "64px 32px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <form noValidate style={{ width: "100%", marginTop: "8px" }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                error={emailError}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button
                type="button"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={handleSignIn}
              >
                Sign In
              </Button>
              <Grid container justifyContent={"space-between"}>
                <Grid item xs>
                  <Link href="#">Forgot password?</Link>
                </Grid>
                <Grid item>
                  <Link onClick={() => router.push("/signup")} href="#">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </form>
          </div>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default SignInPage;
