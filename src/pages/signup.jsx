import React, { useEffect, useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { useRouter } from "next/router";
import { createUser, lookupUser, setCookie } from "@/actions";

const useStyles = makeStyles(theme => ({
  "@global": {
    body: {
      backgroundColor: theme.palette.common.white
    }
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

export default function SignUp() {
  const classes = useStyles();
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [firstNameError, setFirstNameError] = useState(false);

  const [lastName, setLastName] = useState("");
  const [lastNameError, setLastNameError] = useState(false);
  
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const [parent, setParent] = useState("");
  const [parentError, setParentError] = useState(false);

  const handleSignUp = () => {
    if (firstName.length && lastName.length && email.length && email !== parent) {
      lookupUser({email: parent}, response => {
        if ((response.result && response.count) || parent.length === 0) {
          lookupUser({email}, response => {
            if (response.result && response.count) {
              setEmailError(true);
              alert("Email already exists!");
            } else {
              createUser({name: `${firstName} ${lastName}`, email, parent}, response => {
                if (response.result) {
                  setCookie("jobseeker", email);
                  router.push('/');
                } else {
                  alert("Registration Failed!");
                }
              })
            }
          })
        } else {
          setParentError(true);
          alert("No valid manager exists!");
        }
      })
    } else {
      if (!firstName.length) setFirstNameError(true);
      if (!lastName.length) setLastNameError(true);
      if (!email.length) setEmailError(true);
      if (email.length && email === parent) {
        setEmailError(true);
        setParentError(true);
        alert("Can't be a manager of yourself");
      }
    }
  }

  useEffect(() => {
    setFirstNameError(false)
  }, [firstName]);

  useEffect(() => {
    setLastNameError(false)
  }, [lastName]);

  useEffect(() => {
    setEmailError(false)
  }, [email]);

  useEffect(() => {
    setParentError(false)
  }, [parent]);

  return (
    <Container style={{ height: "100vh" }} maxWidth="xs"  >
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                name="firstName"
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
                error={firstNameError}
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="lname"
                error={lastNameError}
                value={lastName}
                onChange={e => setLastName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                error={emailError}
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Manager's Email Address"
                name="email"
                autoComplete="email"
                error={parentError}
                value={parent}
                onChange={e => setParent(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox value="allowExtraEmails" color="primary" />}
                label="I want to receive daily report email."
              />
            </Grid>
          </Grid>
          <Button
            type="button"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={handleSignUp}
          >
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link onClick={() => router.push("/signin")} href='#' variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}
