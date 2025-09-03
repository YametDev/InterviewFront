import React, { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useRouter } from "next/router";
import { createUser, lookupUser, setCookie } from "@/actions";

const theme = createTheme();

export default function SignUp() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [firstNameError, setFirstNameError] = useState(false);

  const [lastName, setLastName] = useState("");
  const [lastNameError, setLastNameError] = useState(false);

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);

  const [parent, setParent] = useState("");
  const [parentError, setParentError] = useState(false);

  const handleSignUp = () => {
    if (firstName && lastName && email && email !== parent) {
      lookupUser({ email: parent }, (response) => {
        if ((response.result && response.count) || parent.length === 0) {
          lookupUser({ email }, (response) => {
            if (response.result && response.count) {
              setEmailError(true);
              alert("Email already exists!");
            } else {
              createUser(
                { name: `${firstName} ${lastName}`, email, parent },
                (response) => {
                  if (response.result) {
                    setCookie("jobseeker", email);
                    router.push("/");
                  } else {
                    alert("Registration Failed!");
                  }
                }
              );
            }
          });
        } else {
          setParentError(true);
          alert("No valid manager exists!");
        }
      });
    } else {
      if (!firstName) setFirstNameError(true);
      if (!lastName) setLastNameError(true);
      if (!email) setEmailError(true);
      if (email && email === parent) {
        setEmailError(true);
        setParentError(true);
        alert("Can't be a manager of yourself");
      }
    }
  };

  useEffect(() => setFirstNameError(false), [firstName]);
  useEffect(() => setLastNameError(false), [lastName]);
  useEffect(() => setEmailError(false), [email]);
  useEffect(() => setParentError(false), [parent]);

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item size={{ xs: 12, sm: 6 }}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  error={firstNameError}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </Grid>
              <Grid item size={{ xs: 12, sm: 6 }}>
                <TextField
                  name="lastName"
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  autoComplete="family-name"
                  error={lastNameError}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </Grid>
              <Grid item size={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  error={emailError}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Grid>
              <Grid item size={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item size={12}>
                <TextField
                  required
                  fullWidth
                  id="parentEmail"
                  label="Manager's Email Address"
                  name="parentEmail"
                  autoComplete="email"
                  error={parentError}
                  value={parent}
                  onChange={(e) => setParent(e.target.value)}
                />
              </Grid>
              <Grid item size={12}>
                <FormControlLabel
                  control={
                    <Checkbox value="allowExtraEmails" color="primary" />
                  }
                  label="I want to receive daily report email."
                />
              </Grid>
            </Grid>
            <Button
              type="button"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleSignUp}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link
                  onClick={() => router.push("/signin")}
                  href="#"
                  variant="body2"
                >
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
