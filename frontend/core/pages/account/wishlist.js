import React, { useContext, useEffect, useState } from "react"

import {
  Box,
  Button,
  Container,
  Grid,
  makeStyles,
  Typography,
  Divider,
  Paper,
  Link as ALink,
} from "@material-ui/core"
import Head from "next/head"
import Image from "next/image"
import Link from "next/link"
import Router from "next/router"
import { useCookies } from "react-cookie"

import { getWishlist, updateWishlist } from "../../config/axios"
import AppContext from "../../contexts/AppContext"

const Wishlist = () => {
  const classes = useStyles()
  const [cookies] = useCookies(["csrftoken"])
  const {
    context: { reload },
    state,
  } = useContext(AppContext)

  const [wishlist, setWishlist] = useState([])

  useEffect(() => {
    getWishlist()
      .then((res) => {
        setWishlist(res)
      })
      .catch((err) =>
        console.error(
          "[GET WISHLIST ERROR]",
          err && err.response ? err.response : err
        )
      )
  }, [])

  const handleWishlist = (id) => {
    if (state.loggedIn === false) {
      reload({ ...state, next: Router.asPath })
    } else {
      updateWishlist(id, cookies.csrftoken)
        .then(() => {
          setWishlist(wishlist.filter((item) => item.id !== id))
        })
        .catch((err) =>
          console.error("[WISHLIST ERROR]", err && err.response ? err.response : err)
        )
    }
  }

  return (
    <>
      <Head>
        <title>Wishlist</title>
      </Head>
      <Container maxWidth="lg">
        <Grid container>
          <Grid item xs={12}>
            <Typography component="h1" variant="h4" gutterBottom>
              Your wishlist
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography component="p" gutterBottom>
              View and manage <b>wishlist items</b>
            </Typography>
          </Grid>
        </Grid>
        <Divider className={classes.divider} />
        <Grid container>
          {!wishlist || wishlist.length <= 0 ? (
            <Typography
              variant="body1"
              component="p"
              color="textSecondary"
              gutterBottom
            >
              Your wishlist is empty
            </Typography>
          ) : null}

          {wishlist &&
            wishlist.map((item) => {
              let product_image = item.product_image.find(
                (product_image) => product_image.is_feature === true
              )

              return (
                <Grid item xs={12} key={item.id}>
                  <Box marginBottom={2}>
                    <Paper variant="outlined">
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={3}>
                          <Image
                            src={product_image.short_url}
                            alt={product_image.alt_text}
                            width={400}
                            height={400}
                          />
                        </Grid>
                        <Grid item xs={12} md={9}>
                          <Box padding={1}>
                            <Link
                              href={`/product/${encodeURIComponent(item.slug)}`}
                              passHref
                            >
                              <ALink
                                component="h1"
                                variant="h5"
                                className={classes.title}
                              >
                                {item.title}
                              </ALink>
                            </Link>
                            <Typography variant="body1" component="p" gutterBottom>
                              {item.description}
                            </Typography>

                            <Box marginY={2}>
                              <Typography variant="caption" component="p">
                                ₱{item.regular_price}
                              </Typography>
                            </Box>

                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => handleWishlist(item.id)}
                            >
                              Remove from wishlist
                            </Button>
                          </Box>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Box>
                </Grid>
              )
            })}
        </Grid>
      </Container>
    </>
  )
}

const useStyles = makeStyles((theme) => ({
  divider: {
    margin: theme.spacing(2, 0, 2, 0),
  },
  title: {
    textDecoration: "none",
    color: "inherit",
    fontWeight: "bold",
    "&:hover": {
      cursor: "pointer",
      textDecoration: "none",
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: 18,
    },
  },
}))

export default Wishlist
