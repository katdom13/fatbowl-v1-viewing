import React, { useEffect, useState } from "react"

import {
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  Hidden,
  Link as ALink,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core"
import { Alert } from "@material-ui/lab"
import Head from "next/head"
import Link from "next/link"
import Router from "next/router"
import { useCookies } from "react-cookie"

import ProgressLoader from "../../../components/progressLoader"
import { passwordReset } from "../../../config/axios"

const PasswordReset = () => {
  const classes = useStyles()
  const [cookies] = useCookies(["csrftoken"])

  const initialFormdata = Object.freeze({
    password: "",
    password2: "",
  })

  const [formdata, setFormdata] = useState(initialFormdata)
  const [formErrors, setFormErrors] = useState(initialFormdata)
  const [isValid, setIsValid] = useState(false)
  const [status, setStatus] = useState("idle")
  const [alert, setAlert] = useState({
    severity: "",
    message: "",
  })

  const handleChange = (name, value) => {
    setFormdata({
      ...formdata,
      [name]: value,
    })
  }

  const handleFormValidation = () => {
    let samePassword =
      formdata.password &&
      formdata.password2 &&
      formdata.password == formdata.password2

    if (formdata.password != formdata.password2) {
      setFormErrors({
        ...formErrors,
        password: "Password must be the same",
      })
    } else {
      setFormErrors({
        ...formErrors,
        password: "",
      })
    }

    return samePassword
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setStatus("loading")

    if (isValid) {
      let query = Router.query
      let uidb64 = query.uidb64
      let token = query.token

      passwordReset(uidb64, token, formdata.password, cookies.csrftoken)
        .then(() => setStatus("done"))
        .catch((err) => {
          console.log("[PASSWORD RESET ERROR]:", err.response ? err.response : err)
          setAlert({
            severity: "error",
            message: err.response && err.response.data && err.response.data.error,
          })
          setStatus("idle")
        })
    }
  }

  useEffect(() => {
    let _isValid = handleFormValidation()
    setIsValid(_isValid)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formdata])

  return (
    <>
      <Head>
        <title>Password reset</title>
      </Head>
      <Container component="main" maxWidth="xl" className={classes.main}>
        <CssBaseline />
        <Grid container>
          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center" minHeight="100%">
              <Container>
                <Grid container>
                  <Grid item xs={12}>
                    {status === "idle" ? (
                      <>
                        {alert && alert.message ? (
                          <Box marginBottom={3}>
                            <Alert severity={alert.severity}>{alert.message}</Alert>
                          </Box>
                        ) : null}

                        <form
                          className={classes.form}
                          noValidate
                          onSubmit={handleSubmit}
                        >
                          <Typography component="h3" variant="h5" gutterBottom>
                            Change your password
                          </Typography>
                          <Typography component="p" variant="body1" gutterBottom>
                            Use the form below to change your password
                          </Typography>

                          <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            id="password"
                            name="password"
                            label="Password"
                            type="password"
                            value={formdata.password}
                            onChange={(e) =>
                              handleChange(e.target.name, e.target.value)
                            }
                            autoComplete="current-password"
                            error={formErrors.password}
                            helperText={formErrors.password}
                          />
                          <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            id="password2"
                            name="password2"
                            label="Repeat password"
                            type="password"
                            value={formdata.password2}
                            onChange={(e) =>
                              handleChange(e.target.name, e.target.value)
                            }
                            autoComplete="repeat-password"
                            error={formErrors.password}
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
                            Submit
                          </Button>

                          <Box marginX="auto" display="flex" justifyContent="center">
                            <Link href="/login" passHref>
                              <ALink variant="body2">
                                {"Already have an account? Log in"}
                              </ALink>
                            </Link>
                          </Box>
                        </form>
                      </>
                    ) : null}

                    {status === "loading" ? <ProgressLoader /> : null}

                    {status === "done" ? (
                      <Box
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                      >
                        <Typography component="h3" variant="h5" gutterBottom>
                          Password reset success
                        </Typography>

                        <Link href="/login" passHref>
                          <ALink color="primary" variant="body1" gutterBottom>
                            You may now log in
                          </ALink>
                        </Link>
                      </Box>
                    ) : null}
                  </Grid>
                </Grid>
              </Container>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Hidden smDown>
              <Box
                display="flex"
                className={classes.bgImage}
                minHeight="100vh"
              ></Box>
            </Hidden>
          </Grid>
        </Grid>
      </Container>
    </>
  )
}

const useStyles = makeStyles((theme) => ({
  bgImage: {
    // eslint-disable-next-line quotes
    backgroundImage: 'url("/background.jpg")',
    backgroundSize: "cover",
    backgroundPosition: "center center",
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  main: {
    padding: 0,
  },
  submit: {
    margin: theme.spacing(6, 0, 2),
  },
}))

// eslint-disable-next-line no-unused-vars
export async function getServerSideProps(context) {
  return {
    props: {},
  }
}

export default PasswordReset
