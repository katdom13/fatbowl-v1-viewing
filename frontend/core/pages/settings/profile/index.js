import React, { useContext, useEffect, useState } from "react"

import {
  Container,
  Grid,
  Box,
  makeStyles,
  Typography,
  TextField,
  Button,
  Divider,
  withStyles,
} from "@material-ui/core"
import MuiAccordion from "@material-ui/core/Accordion"
import MuiAccordionDetails from "@material-ui/core/AccordionDetails"
import MuiAccordionSummary from "@material-ui/core/AccordionSummary"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import { Alert } from "@material-ui/lab"
import Router from "next/router"
import { useCookies } from "react-cookie"

import withAuthentication from "../../../components/withAuthentication"
import {
  getUser,
  whoami,
  updateUser,
  logoutUser,
  deleteUser,
} from "../../../config/axios"
import AppContext from "../../../contexts/AppContext"

const Profile = () => {
  const classes = useStyles()
  const [cookies] = useCookies(["csrftoken"])
  const initialFormdata = Object.freeze({
    username: "",
    email: "",
    password: "",
    password2: "",
    password3: "",
  })
  const [formdata, setFormdata] = useState(initialFormdata)
  const [formErrors, setFormErrors] = useState(initialFormdata)
  const [isValid, setIsValid] = useState(false)
  const [alert, setAlert] = useState({
    severity: "",
    message: "",
  })
  const {
    context: { logout },
  } = useContext(AppContext)
  const [isDeleted, setIsDeleted] = useState(false)

  const handleChange = (name, value) => {
    setFormdata({
      ...formdata,
      [name]: value,
    })
  }

  const handleFormValidation = () => {
    let requiredFields = [formdata.username, formdata.email]

    let hasRequired = requiredFields.reduce((a, b) => {
      return Boolean(a) && Boolean(b)
    })

    let hasError = Object.values(formErrors).reduce((a, b) => {
      return Boolean(a) && Boolean(b)
    })

    let samePassword = formdata.password2 == formdata.password3

    if (!samePassword) {
      setFormErrors({
        ...formErrors,
        password2: "Passwords must be the same",
      })
    } else {
      setFormErrors({
        ...formErrors,
        password2: "",
      })
    }

    return hasRequired && !hasError && samePassword
  }

  useEffect(() => {
    whoami()
      .then((response) => {
        getUser(response)
          .then((response) => {
            setFormdata({
              username: response.username,
              email: response.email,
            })
          })
          .catch((err) => console.error("[GET USER ERROR]", err))
      })
      .catch((err) => console.error("[WHOAMI ERROR]", err))
  }, [])

  useEffect(() => {
    let _isValid = handleFormValidation()
    setIsValid(_isValid)
  }, [formdata])

  const handleSubmit = (e) => {
    e.preventDefault()
    setFormErrors(initialFormdata)
    if (isValid) {
      whoami()
        .then((response) => {
          let data = {
            username: formdata.username,
            email: formdata.email,
            old_password: formdata.password,
            new_password: formdata.password2,
          }
          updateUser(response, data, cookies.csrftoken)
            .then((response) => {
              if (Boolean(data.old_password) && Boolean(data.new_password)) {
                logoutUser()
                  .then(() => {
                    logout()
                    Router.push("/login?password-change=success", "/login")
                  })
                  .catch((err) => {
                    console.error("[LOGOUT ERROR]", err.response)
                  })
              } else {
                console.log("RESPONSE", response)
                setAlert({
                  severity: "success",
                  message: "Successfully updated profile",
                })
              }
            })
            .catch((err) => {
              if (err.response && err.response.status !== 200) {
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
              } else {
                console.error("[UPDATE USER ERROR]", err.response)
              }
            })
        })
        .catch((err) => console.error("[WHOAMI ERROR]", err))
    }
  }

  const handleDelete = (e) => {
    e.preventDefault()
    whoami()
      .then((response) => {
        deleteUser(response, cookies.csrftoken)
          .then((response) => {
            console.log("[DELETED USER]", response)
            setIsDeleted(true)
            logout()
          })
          .catch((err) => console.error("[DELETE USER ERROR]", err.response))
      })
      .catch((err) => console.error("[WHOAMI ERROR]", err))
  }

  return (
    <Container maxWidth="sm">
      <Grid container>
        {isDeleted ? (
          <Grid item xs={12}>
            <Box display="flex" alignItems="center">
              <Box className={classes.form}>
                <Typography component="h3" variant="h5" gutterBottom>
                  Your account has been deleted
                </Typography>
                <Typography component="p" variant="body1" gutterBottom>
                  Thank you, hoping to see you again
                </Typography>
              </Box>
            </Box>
          </Grid>
        ) : (
          <>
            <Grid item xs={12}>
              <Box display="flex" alignItems="center">
                <form className={classes.form} noValidate onSubmit={handleSubmit}>
                  {alert && alert.message ? (
                    <Box width="100%" marginBottom={2}>
                      <Alert severity={alert.severity}>{alert.message}</Alert>
                    </Box>
                  ) : null}
                  <Typography component="h3" variant="h5" gutterBottom>
                    Change your details
                  </Typography>
                  <Typography component="p" variant="body1" gutterBottom>
                    You can edit your account using the following form:
                  </Typography>

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

                  <Divider variant="middle" className={classes.divider} />

                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography
                        component="p"
                        variant="body1"
                        style={{
                          fontWeight: "bold",
                        }}
                      >
                        Advanced
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography component="h3" variant="h5" gutterBottom>
                        Change password
                      </Typography>

                      <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        id="password"
                        name="password"
                        label="Current Password"
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
                        fullWidth
                        id="password2"
                        name="password2"
                        label="New password"
                        type="password"
                        value={formdata.password2}
                        onChange={(e) => handleChange(e.target.name, e.target.value)}
                        autoComplete="repeat-password"
                        error={Boolean(formErrors.password2)}
                        helperText={formErrors.password2}
                      />
                      <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        id="password3"
                        name="password3"
                        label="Repeat password"
                        type="password"
                        value={formdata.password3}
                        onChange={(e) => handleChange(e.target.name, e.target.value)}
                        autoComplete="repeat-password"
                        error={Boolean(formErrors.password2)}
                        helperText={formErrors.password2}
                      />
                    </AccordionDetails>
                  </Accordion>

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    disabled={!isValid}
                  >
                    Save changes
                  </Button>
                </form>
              </Box>

              <Divider variant="middle" className={classes.divider} />
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" alignItems="center">
                <form className={classes.form} noValidate onSubmit={handleDelete}>
                  <Typography component="h3" variant="h5" gutterBottom>
                    Delete Account
                  </Typography>
                  <Typography component="p" variant="body1" gutterBottom>
                    Are you sure you want to delete your account?
                  </Typography>

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="secondary"
                    className={classes.submit}
                    // disabled={!isValid}
                  >
                    Delete
                  </Button>
                </form>
              </Box>
            </Grid>
          </>
        )}
      </Grid>
    </Container>
  )
}

const Accordion = withStyles({
  root: {
    border: "none",
    boxShadow: "none",
    "&:not(:last-child)": {
      borderBottom: 0,
    },
    "&:before": {
      display: "none",
    },
    "&$expanded": {
      margin: "auto",
    },
  },
  expanded: {},
})(MuiAccordion)

const AccordionSummary = withStyles({
  root: {
    backgroundColor: "none",
    minHeight: 56,
    "&$expanded": {
      minHeight: 56,
    },
    padding: 0,
  },
  content: {
    "&$expanded": {
      margin: "12px 0",
    },
  },
  expanded: {},
})(MuiAccordionSummary)

const AccordionDetails = withStyles(() => ({
  root: {
    flexDirection: "column",
    padding: 0,
  },
}))(MuiAccordionDetails)

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

export default withAuthentication(Profile)
