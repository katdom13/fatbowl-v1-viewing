import React, { useState, useEffect } from 'react'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import Grid from '@material-ui/core/Grid'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Box from '@material-ui/core/Box'
import Link from 'next/link'
import { Link as ALink } from '@material-ui/core'
import Router from 'next/router'
import axios from 'axios'
import { loginUser } from '../config/axios'
import Head from 'next/head'

const Login = () => {

  const classes = useStyles()

  const [csrfToken, setCsrfToken] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    // Request a CSRF Token from backend
    // Define credentials to send cookies with request
    async function csrf() {
      await axios.get('http://localhost:8001/account/csrf/', {withCredentials: true})
        .then(response => {
          let csrf = response.headers['x-csrftoken']
          setCsrfToken(csrf)
          console.log(csrf)
        })
        .catch(err => console.error('[GET CSRF ERROR]', err.response))
    }

    csrf()
  }, [])

  const handleSubmit = (e) => {
    let isOk = false
    e.preventDefault()

    async function login() {
      await loginUser(username, password, csrfToken)
        .then(response => Router.push('/'))
        .catch(err => {
          console.error('[LOGIN ERROR]', err.response)
          setError(err.response.data.info)
        })
    }

    login()
  }

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Box component='p'>
            {error}
          </Box>
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
              <Grid item xs>
                <Link href=".">
                  <ALink variant="body2">
                    Forgot password?
                  </ALink>
                </Link>
              </Grid>
              <Grid item>
                <Link href=".">
                  <ALink variant="body2">
                    {"Don't have an account? Sign Up"}
                  </ALink>
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
    </>
  )
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
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