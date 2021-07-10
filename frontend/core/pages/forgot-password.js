import {
  Container,
  Grid,
  CssBaseline,
  Box,
  makeStyles,
  TextField,
  Button,
  Link as ALink,
  Typography,
  Fade,
} from '@material-ui/core'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { forgotPassword } from '../config/axios'
import { useCookies } from 'react-cookie'
import ProgressLoader from '../components/progressLoader'

const ForgotPassword = () => {
  const classes = useStyles()
  const [cookies, setCookie] = useCookies(['csrftoken'])

  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  
  const [status, setStatus] = useState('idle')

  const handleSubmit = e => {
    e.preventDefault()
    setStatus('loading')
    forgotPassword(email, cookies.csrftoken)
      .then(response => {
        setStatus('done')
      })
      .catch(err => {
        setError(err.response && err.response.data && err.response.data.error)
        setStatus('idle')
      })
  }

  return (
    <>
      <Head>
        <title>Forgot Password</title>
      </Head>
      <Container component='main' maxWidth='sm'>
        <CssBaseline />
        <Grid container>
          <Grid item xs={12}>
            <Box display='flex' alignItems='center' paddingY={3}>

              {
                status === 'idle' ? (
                  <form className={classes.form} noValidate onSubmit={handleSubmit}>
                    <Typography component='h3' variant='h5' gutterBottom>
                      Forgot your password?
                    </Typography>
                    <Typography component='p' variant='body1' gutterBottom>
                      Enter your email address to receive instructions on how to reset your password.
                    </Typography>

                    <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      id="email"
                      label="Email"
                      name="email"
                      autoComplete="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      error={Boolean(error)}
                      helperText={error}
                    />

                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      color="primary"
                      className={classes.submit}
                    >
                      Send email
                    </Button>

                    <Box marginX='auto' display='flex' justifyContent='center'>
                      <Link href="/login">
                        <ALink variant="body2">
                          {"Already have an account? Log in"}
                        </ALink>
                      </Link>
                    </Box>
                  </form>
                ) : null
              }

              {
                status === 'loading' ? (
                  <Fade in={status === 'loading'}>
                    <ProgressLoader />
                  </Fade>
                ) : null
              }

              {
                status === 'done' ? (
                  <Box display='flex' flexDirection='column' justifyContent='center' paddingY={3}>
                    <Typography component='h3' variant='h5' gutterBottom>
                      Email sent
                    </Typography>
                    <Typography component='p' variant='body1' gutterBottom>
                      Please check your inbox for instructions on how to reset your password.
                    </Typography>
                  </Box>
                ) : null
              }

            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
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

export default ForgotPassword