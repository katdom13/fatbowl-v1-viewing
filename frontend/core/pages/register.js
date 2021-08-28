import React, { useEffect, useState } from "react"

import {
  Container,
  Divider,
  Grid,
  Box,
  CssBaseline,
  makeStyles,
  Typography,
  TextField,
  Button,
  Link as ALink,
} from "@material-ui/core"
import Head from "next/head"
import Link from "next/link"
import { useCookies } from "react-cookie"

import ProgressLoader from "../components/progressLoader"
import { register } from "../config/axios"

const Register = () => {
  const classes = useStyles()
  const [cookies] = useCookies(["csrftoken"])

  const initialFormdata = Object.freeze({
    username: "",
    email: "",
    password: "",
    password2: "",
  })
  const [formdata, setFormdata] = useState(initialFormdata)
  const [formErrors, setFormErrors] = useState(initialFormdata)
  const [isValid, setIsValid] = useState(false)
  const [status, setStatus] = useState("idle")

  const handleChange = (name, value) => {
    setFormdata({
      ...formdata,
      [name]: value,
    })
  }

  const handleFormValidation = () => {
    let hasRequired = Object.values(formdata).reduce((a, b) => {
      return Boolean(a) && Boolean(b)
    })

    let hasError = Object.values(formErrors).reduce((a, b) => {
      return Boolean(a) && Boolean(b)
    })

    let samePassword =
      formdata.password &&
      formdata.password2 &&
      formdata.password == formdata.password2

    if (formdata.password != formdata.password2) {
      setFormErrors({
        ...formErrors,
        password: "Passwords must be the same",
      })
    } else {
      setFormErrors({
        ...formErrors,
        password: "",
      })
    }

    return hasRequired && !hasError && samePassword
  }

  useEffect(() => {
    let _isValid = handleFormValidation()
    setIsValid(_isValid)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formdata])

  const handleSubmit = (e) => {
    e.preventDefault()
    setStatus("loading")
    setFormErrors(initialFormdata)
    if (isValid) {
      register(
        {
          username: formdata.username,
          email: formdata.email,
          password: formdata.password,
        },
        cookies.csrftoken
      )
        .then(() => setStatus("done"))
        .catch((err) => {
          console.error("[REGISTER ERROR]", err && err.response ? err.response : err)
          setStatus("idle")
          if (err.response && err.response.status === 400) {
            let errors = { ...err.response.data }

            Object.keys(errors).map((key) => {
              let value = errors[key]
              if (typeof value === "object") {
                errors = { ...errors, [key]: value[0] }
              }
            })

            setFormErrors({
              ...errors,
            })
          }
        })
    }
  }

  return (
    <>
      <Head>
        <title>Register</title>
      </Head>
      <Container component="main" maxWidth="sm">
        <CssBaseline />
        <Grid container>
          <Grid item xs={12}>
            <Box display="flex" alignItems="center">
              {status === "idle" ? (
                <form className={classes.form} noValidate onSubmit={handleSubmit}>
                  <Typography component="h3" variant="h5" gutterBottom>
                    Create an account
                  </Typography>
                  <Typography component="p" variant="body1" gutterBottom>
                    {"It's free and only takes a minute"}
                  </Typography>

                  <Divider className={classes.divider} />

                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    autoComplete="username"
                    value={formdata.username}
                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                    autoFocus
                    error={Boolean(formErrors.username)}
                    helperText={formErrors.username}
                  />
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email"
                    name="email"
                    autoComplete="email"
                    value={formdata.email}
                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                    error={Boolean(formErrors.email)}
                    helperText={formErrors.email}
                  />
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="password"
                    name="password"
                    label="Password"
                    type="password"
                    value={formdata.password}
                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                    autoComplete="current-password"
                    error={Boolean(formErrors.password)}
                    helperText={formErrors.password}
                  />
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="password2"
                    name="password2"
                    label="Repeat password"
                    type="password"
                    value={formdata.password2}
                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                    autoComplete="repeat-password"
                    error={Boolean(formErrors.password)}
                    helperText={formErrors.password}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    disabled={!isValid}
                  >
                    Register
                  </Button>

                  <Box marginX="auto" display="flex" justifyContent="center">
                    <Link href="/login" passHref>
                      <ALink variant="body2">
                        {"Already have an account? Log in"}
                      </ALink>
                    </Link>
                  </Box>
                </form>
              ) : null}

              {status === "loading" ? <ProgressLoader /> : null}

              {status === "done" ? (
                <Box display="flex" flexDirection="column" justifyContent="center">
                  <Typography component="h3" variant="h5" gutterBottom>
                    Successfully created an account for {formdata.username}!
                  </Typography>
                  <Typography component="p" variant="body1" gutterBottom>
                    Please check your inbox for the activation email
                  </Typography>
                </Box>
              ) : null}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  )
}

const useStyles = makeStyles((theme) => ({
  divider: {
    margin: theme.spacing(2, 0, 2, 0),
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(6, 0, 2),
  },
}))

export default Register
