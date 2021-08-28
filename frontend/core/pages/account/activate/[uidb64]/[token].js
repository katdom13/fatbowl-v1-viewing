import React, { useEffect, useState } from "react"

import {
  Container,
  Grid,
  Box,
  Typography,
  CssBaseline,
  Link as ALink,
} from "@material-ui/core"
import Head from "next/head"
import Link from "next/link"
import Router from "next/router"
import { useCookies } from "react-cookie"

import { activateUser } from "../../../../config/axios"

const Activate = () => {
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [cookies] = useCookies(["csrftoken"])
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    let query = Router.query
    let uidb64 = query.uidb64
    let token = query.token
    activateUser(uidb64, token, cookies.csrftoken)
      .then((response) => {
        setTitle(response.success && response.success)
        setBody("You may now log in")
        setIsSuccess(true)
      })
      .catch((err) => {
        setTitle(err.response && err.response.data && err.response.data.error)
        setBody("This link may now be invalid or expired. Please try again.")
        setIsSuccess(false)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Head>
        <title>Account activation</title>
      </Head>
      <Container component="main" maxWidth="sm">
        <CssBaseline />
        <Grid container>
          <Grid item xs={12}>
            <Box display="flex" flexDirection="column" justifyContent="center">
              <Typography component="h3" variant="h5" gutterBottom>
                {title}
              </Typography>

              {isSuccess ? (
                <Link href="/login" passHref>
                  <ALink color="primary" variant="body1" gutterBottom>
                    {body}
                  </ALink>
                </Link>
              ) : (
                <Typography component="p" variant="body1" gutterBottom>
                  {body}
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  )
}

// eslint-disable-next-line no-unused-vars
export async function getServerSideProps(context) {
  return {
    props: {},
  }
}

export default Activate
