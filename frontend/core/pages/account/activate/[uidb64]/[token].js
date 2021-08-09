import Head from 'next/head'
import {
  Container,
  Grid,
  Box,
  Typography,
  CssBaseline,
  Link as ALink,
} from '@material-ui/core'
import { useEffect, useState } from 'react'
import Router from 'next/router'
import { useCookies } from 'react-cookie'
import { activateUser } from '../../../../config/axios'
import Link from 'next/link'

const Activate = () => {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [cookies, setCookie] = useCookies(['csrftoken'])
  const [isSuccess, setIsSuccess] = useState(false)
  
  useEffect(() => {
    let query = Router.query
    let uidb64 = query.uidb64
    let token = query.token
    activateUser(uidb64, token, cookies.csrftoken)
      .then(response => {
<<<<<<< HEAD
        setTitle(response.success && response.success)
=======
        setTitle(response.info && response.info)
>>>>>>> 93a85b19f062b394aad5ed712ef70136fa7d269f
        setBody('You may now log in')
        setIsSuccess(true)
      })
      .catch(err => {
<<<<<<< HEAD
=======
        console.error('AAAAAAAAAA', err.response)
>>>>>>> 93a85b19f062b394aad5ed712ef70136fa7d269f
        setTitle(err.response && err.response.data && err.response.data.error)
        setBody('This link may now be invalid or expired. Please try again.')
        setIsSuccess(false)
      })
  }, [])

  return (
    <>
      <Head>
        <title>Account activation</title>
      </Head>
      <Container component='main' maxWidth='sm'>
        <CssBaseline />
        <Grid container>
          <Grid item xs={12}>
            <Box display='flex' flexDirection='column' justifyContent='center'>
              <Typography component='h3' variant='h5' gutterBottom>
                {title}
              </Typography>

              {
                isSuccess ? (
                  <Link href='/login' passHref>
                    <ALink color='primary' variant='body1' gutterBottom>
                      {body}
                    </ALink>
                  </Link>
                ) : (
                  <Typography component='p' variant='body1' gutterBottom>
                    {body}
                  </Typography>
                )
              }

            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  )
}

export async function getServerSideProps(context) {
  return {
      props: {},
  };
}

export default Activate