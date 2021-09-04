import React, { useState, useEffect, useContext } from "react"

import { Link as ALink } from "@material-ui/core"
import Avatar from "@material-ui/core/Avatar"
import Box from "@material-ui/core/Box"
import Button from "@material-ui/core/Button"
import Checkbox from "@material-ui/core/Checkbox"
import Container from "@material-ui/core/Container"
import CssBaseline from "@material-ui/core/CssBaseline"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Grid from "@material-ui/core/Grid"
import { makeStyles } from "@material-ui/core/styles"
import TextField from "@material-ui/core/TextField"
import Typography from "@material-ui/core/Typography"
import LockOutlinedIcon from "@material-ui/icons/LockOutlined"
import { Alert } from "@material-ui/lab"
import Head from "next/head"
import Link from "next/link"
import Router from "next/router"

// import { loginUser, getCsrf, getCartItemQty } from "../config/axios"
import customCookies from "../components/customCookies"
import { loginUser, getCartItemQty, instance } from "../config/axios"
import { getUrlQueryParams } from "../config/utils"
import AppContext from "../contexts/AppContext"

const Login = () => {
  const classes = useStyles()
  const cookies = customCookies

  // const [csrfToken, setCsrfToken] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [alert, setAlert] = useState({
    severity: "",
    message: "",
  })
  const {
    context: { login },
  } = useContext(AppContext)

  useEffect(() => {
    let isRegistered = Boolean(Router.query.register)
    let isPasswordChanged = Boolean(Router.query["password-change"])

    // getCsrf()
    //   .then((response) => {
    //     setCsrfToken(response)
    //     console.log("[CSRF]", response)
    //   })
    //   .catch((err) => console.error("[GET CSRF ERROR]", err.response))

    if (isRegistered) {
      setAlert({
        severity: "success",
        message: "Successfully registered. Please log in.",
      })
    } else if (isPasswordChanged) {
      setAlert({ severity: "success", message: "Password changed. Please log in." })
    }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()

    loginUser(username, password)
      .then((res) => {
        cookies.set("access_token", res.access)
        cookies.set("refresh_token", res.refresh)
        instance.defaults.headers["Authorization"] =
          "Bearer " + cookies.get("access_token")

        getCartItemQty()
          .then((response) => {
            login({ qty: response })
            let next = getUrlQueryParams(Router.asPath, "next")
            Router.push(next ? next : "/", undefined, { shallow: true })
          })
          .catch((err) => console.error(err))
      })
      .catch((err) => {
        console.error("[LOGIN ERROR]", err && err.response ? err.response.data : err)
        setAlert({
          severity: "error",
          message: err.response.data.error,
        })
      })
  }

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <Container component="main" maxWidth="sm">
        <CssBaseline />
        {alert && alert.message ? (
          <Box width="100%" marginBottom={2}>
            <Alert severity={alert.severity}>{alert.message}</Alert>
          </Box>
        ) : null}
        <Box display="flex" flexDirection="column" alignItems="center">
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form className={classes.form} onSubmit={handleSubmit} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign in
            </Button>
            <Grid container>
              <Grid item xs={12}>
                <Box textAlign="center">
                  <Link href="/forgot-password" passHref>
                    <ALink variant="body2" gutterBottom>
                      Forgot password?
                    </ALink>
                  </Link>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box textAlign="center">
                  <Link href="/register" passHref>
                    <ALink variant="body2" gutterBottom>
                      {"Don't have an account? Sign Up"}
                    </ALink>
                  </Link>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Container>
    </>
  )
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}))

export default Login
