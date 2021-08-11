import React, { useEffect, useState } from "react"

import {
  makeStyles,
  Box,
  Container,
  Divider,
  Grid,
  Typography,
  Card,
  CardHeader,
  CardContent,
  Link as ALink,
} from "@material-ui/core"
import AddIcon from "@material-ui/icons/Add"
import Head from "next/head"
import Link from "next/link"
import Router from "next/router"
import { useCookies } from "react-cookie"

import { deleteAddress, getAddresses, updateAddress } from "../../config/axios"

const Addresses = () => {
  const classes = useStyles()
  const [cookies] = useCookies(["csrftoken"])

  const [addresses, setAddresses] = useState([])

  useEffect(() => {
    getAddresses()
      .then((res) => setAddresses(res))
      .catch((err) =>
        console.error(
          "[GET ADDRESSES ERROR]",
          err && err.response ? err.response : err
        )
      )
  }, [])

  const handleDelete = (public_id) => {
    deleteAddress(public_id, cookies.csrftoken)
      .then(() => console.log("Address deleted"))
      .catch((err) =>
        console.error(
          "[DELETE ADDRESS ERROR]",
          err && err.response ? err.response : err
        )
      )

    // Delete from frontend list as well
    const newAddresses = addresses.filter(
      (address) => address.public_id !== public_id
    )
    setAddresses(newAddresses)
  }

  const handleSetDefault = (public_id) => {
    let old = addresses.find((address) => address.is_default === true)

    if (old) {
      updateAddress(old.public_id, { is_default: false }, cookies.csrftoken)
        .then((res) => res)
        .catch((err) =>
          console.error(
            "[UPDATE ADDRESS ERROR]",
            err && err.response ? err.response : err
          )
        )
    }

    updateAddress(public_id, { is_default: true }, cookies.csrftoken)
      .then(() => {
        getAddresses()
          .then((res) => setAddresses(res))
          .catch((err) =>
            console.error(
              "[GET ADDRESSES ERROR]",
              err && err.response ? err.response : err
            )
          )

        Router.push("")
      })
      .catch((err) =>
        console.error(
          "[UPDATE ADDRESS ERROR]",
          err && err.response ? err.response : err
        )
      )
  }

  return (
    <>
      <Head>
        <title>Edit addresses</title>
      </Head>
      <Container maxWidth="lg">
        <Grid container>
          <Grid item xs={12}>
            <Typography component="h1" variant="h4" gutterBottom>
              Your addresses
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography component="p" gutterBottom>
              Manage your <b>addresses</b> and delivery preferences
            </Typography>
          </Grid>
        </Grid>
        <Divider className={classes.divider} />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <Link href="/account/address/">
              <Card elevation={0} className={classes.add} style={{ height: "100%" }}>
                <Grid container style={{ height: "100%" }}>
                  <Grid
                    item
                    xs={12}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Box textAlign="center" padding={2}>
                      <AddIcon fontSize="large" color="disabled" />
                      <Typography variant="h6" component="h1">
                        Add address
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Card>
            </Link>
          </Grid>
          {addresses &&
            addresses.map((address, index) => (
              <Grid item xs={12} sm={6} md={4} key={address.public_id}>
                <Card variant="outlined" style={{ height: "100%" }}>
                  <CardHeader
                    title={
                      <Typography
                        variant="body1"
                        color="textSecondary"
                        style={{
                          opacity: address.is_default ? 1 : 0,
                        }}
                      >
                        Default
                      </Typography>
                    }
                    classes={{
                      root: classes.cardHeader,
                    }}
                  />
                  <CardContent>
                    <Typography variant="body1" gutterBottom>
                      <b>Address {index + 1}</b>
                    </Typography>
                    <Typography variant="body1">{address.address_line_1}</Typography>
                    <Typography variant="body1">{address.address_line_2}</Typography>
                    <Typography variant="body1">{address.town_city}</Typography>
                    <Typography variant="body1">{address.postcode}</Typography>
                    <Typography variant="body1">{address.phone_number}</Typography>
                    <Box paddingTop={4} display="flex" gridGap={3}>
                      <Link href={`/account/address/${address.public_id}`} passHref>
                        <ALink>Edit</ALink>
                      </Link>
                      |
                      <ALink onClick={() => handleDelete(address.public_id)}>
                        Delete
                      </ALink>
                      {!address.is_default ? (
                        <>
                          |
                          <ALink onClick={() => handleSetDefault(address.public_id)}>
                            Set default
                          </ALink>
                        </>
                      ) : null}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
        </Grid>
      </Container>
    </>
  )
}

const useStyles = makeStyles((theme) => ({
  add: {
    border: `2px dashed ${theme.palette.text.disabled}`,
    marginBottom: theme.spacing(2),
    cursor: "pointer",
  },
  cardHeader: {
    padding: theme.spacing(1, 2),
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  divider: {
    margin: theme.spacing(2, 0, 2, 0),
  },
}))

// export async function getStaticProps(context) {
//   const addresses = await getAddresses()
//   return {
//     props: {
//       addresses: addresses
//     }, // will be passed to the page component as props
//   }
// }

export default Addresses
