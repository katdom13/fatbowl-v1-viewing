import {
  Container,
  Grid,
  Box,
  CssBaseline,
  makeStyles,
  Typography,
  TextField,
  Button,
  Link as ALink,
} from "@material-ui/core"
import Link from 'next/link'
import { useEffect, useState } from "react"
import { register } from "../config/axios"
import { useCookies } from "react-cookie"
import Router from "next/router"

const Register = () => {
  const classes = useStyles()
  const [cookies, setCookie] = useCookies(['csrftoken'])

  const initialFormdata = Object.freeze({
    username: '',
    email: '',
    password: '',
    password2: '',
  })
  const [formdata, setFormdata] = useState(initialFormdata)
  const [formErrors, setFormErrors] = useState(initialFormdata)
  const [isValid, setIsValid] = useState(false)

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

    let samePassword = formdata.password && formdata.password2 && formdata.password == formdata.password2

    if (formdata.password != formdata.password2) {
      setFormErrors({
        ...formErrors,
        password: 'Passwords must be the same'
      })
    } else {
      setFormErrors({
        ...formErrors,
        password: ''
      })
    }

    return hasRequired && !hasError && samePassword
  }

  useEffect(() => {
    let _isValid = handleFormValidation()
    setIsValid(_isValid)
  }, [formdata])

  const handleSubmit = e => {
    e.preventDefault()
    setFormErrors(initialFormdata)
    if (isValid) {
      register(
        {
          username: formdata.username,
          email: formdata.email,
          password: formdata.password
        },
        cookies.csrftoken,
      )
        .then(response => {
          Router.push('/login?register=success', '/login')
        })
        .catch(err => {
          if (err.response && err.response.status === 400) {
            let errors = {...err.response.data}
            
            Object.keys(errors).map(key => {
              let value = errors[key]
              if (typeof value === 'object') {
                errors = {...errors, [key]: value[0]}
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
    <Container component='main' maxWidth='sm'>
      <CssBaseline />
      <Grid container>
        <Grid item xs={12}>
          <Box display='flex' alignItems='center' paddingY={3}>
            <form className={classes.form} noValidate onSubmit={handleSubmit}>
              <Typography component='h3' variant='h5' gutterBottom>
                Create an account
              </Typography>
              <Typography component='p' variant='body1' gutterBottom>
                It's free and only takes a minute
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
                error={formErrors.username}
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
                error={formErrors.email}
                helperText={formErrors.email}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="password"
                name='password'
                label="Password"
                type="password"
                value={formdata.password}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
                autoComplete="current-password"
                error={formErrors.password}
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
                Register
              </Button>

              <Box marginX='auto' display='flex' justifyContent='center'>
                <Link href="/login">
                  <ALink variant="body2">
                    {"Already have an account? Log in"}
                  </ALink>
                </Link>
              </Box>

            </form>
          </Box>
        </Grid>
      </Grid>
    </Container>
  )
}

const useStyles = makeStyles((theme) => ({
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(6, 0, 2),
  },
}))

export default Register