import React, { useState, useEffect, useContext } from 'react'
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
import { loginUser, getCsrf, getCartItemQty } from '../config/axios'
import Head from 'next/head'
import AppContext from "../contexts/AppContext"
import { getUrlQueryParams } from '../config/utils'
import { Alert } from '@material-ui/lab'

const Login = () => {

  const classes = useStyles()

  const [csrfToken, setCsrfToken] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [alert, setAlert] = useState({
    severity: '',
    message: '',
  })
  const {context: {login}} = useContext(AppContext)

  useEffect(() => {
    let isRegistered = Boolean(Router.query.register)
    let isPasswordChanged = Boolean(Router.query['password-change'])
    
    getCsrf()
        .then(response => {
          setCsrfToken(response)
          console.log('[CSRF]', response)
        })
        .catch(err => console.error('[GET CSRF ERROR]', err.response))

    if (isRegistered) {
      setAlert({severity: 'success', message: 'Successfully registered. Please log in.'})
    } else if (isPasswordChanged) {
      setAlert({severity: 'success', message: 'Password changed. Please log in.'})
    }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()

    loginUser(username, password, csrfToken)
      .then(response => {
        getCartItemQty()
          .then(response => {
            login({qty: response})
            let next = getUrlQueryParams(Router.asPath, 'next')
            Router.push(Boolean(next) ? next : '/', undefined, {shallow: true})
          })
          .catch(err => console.error(err))
      })
      .catch(err => {
        console.error('[LOGIN ERROR]', err.response)
        setAlert({
          severity: 'error',
          message: err.response.data.info,
        })
      })
  }

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          {
            alert && alert.message ? (
              <Box width='100%' marginBottom={2}>
                <Alert severity={alert.severity}>
                  {alert.message}
                </Alert>
              </Box>
            ) : null
          }
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
                <Link href="/forgot-password">
                  <ALink variant="body2">
                    Forgot password?
                  </ALink>
                </Link>
              </Grid>
              <Grid item>
                <Link href="/register">
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