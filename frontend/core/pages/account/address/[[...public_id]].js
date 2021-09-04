import React, { useEffect, useState } from "react"

import {
  Button,
  Container,
  Divider,
  Grid,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core"
import Head from "next/head"
import Router from "next/router"

import customCookies from "../../../components/customCookies"
import { createAddress, getAddress, updateAddress } from "../../../config/axios"

const Address = () => {
  const classes = useStyles()
  const cookies = customCookies

  const initialFormdata = Object.freeze({
    phone_number: "",
    address_line_1: "",
    address_line_2: "",
    town_city: "",
    postcode: "",
    is_default: false,
  })

  const [formdata, setFormdata] = useState(initialFormdata)
  const [formErrors, setFormErrors] = useState(initialFormdata)
  const [publicId, setPublicId] = useState("")

  // Look if there is a public id in the url
  useEffect(() => {
    let public_id =
      Object.entries(Router.query).length > 0 ? Router.query.public_id[0] : ""

    if (public_id) {
      setPublicId(public_id)

      getAddress(public_id)
        .then((res) => {
          setFormdata({
            phone_number: res.phone_number,
            address_line_1: res.address_line_1,
            address_line_2: res.address_line_2,
            town_city: res.town_city,
            postcode: res.postcode,
          })
        })
        .catch((err) =>
          console.error(
            "[GET ADDRESS ERROR]",
            err && err.response ? err.response : err
          )
        )
    }
  }, [])

  const handleChange = (name, value) => {
    setFormdata({
      ...formdata,
      [name]: value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    let isEdit = Boolean(publicId)

    !isEdit
      ? createAddress(formdata, cookies.get("csrftoken"))
          .then(() => Router.back())
          .catch((err) => {
            if (err && err.response) {
              setFormErrors({
                ...formErrors,
                ...err.response.data,
              })
            }
            console.error(
              "[ADD ADDRESS ERROR]",
              err && err.response ? err.response.data : err
            )
          })
      : updateAddress(publicId, formdata, cookies.get("csrftoken"))
          .then(() => Router.back())
          .catch((err) => {
            if (err && err.response) {
              setFormErrors({
                ...formErrors,
                ...err.response.data,
              })
            }
            console.error(
              "[EDIT ADDRESS ERROR]",
              err && err.response ? err.response : err
            )
          })
  }

  return (
    <>
      <Head>
        <title>Address</title>
      </Head>
      <Container maxWidth="sm">
        <Grid container>
          <Grid item xs={12}>
            <form className={classes.form} noValidate onSubmit={handleSubmit}>
              <Typography component="h3" variant="h5" gutterBottom>
                Create/Edit address
              </Typography>
              <Typography component="p" variant="body1" gutterBottom>
                Add/Edit a delivery <b>address</b> and delivery preferences
              </Typography>
              <Divider className={classes.divider} />
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="phone_number"
                label="Phone number"
                name="phone_number"
                autoComplete="phone_number"
                value={formdata.phone_number}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
                autoFocus={true}
                error={Boolean(formErrors.phone_number)}
                helperText={formErrors.phone_number}
                type="tel"
              />
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="address_line_1"
                label="Address line 1"
                name="address_line_1"
                autoComplete="address_line_1"
                value={formdata.address_line_1}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
                error={Boolean(formErrors.address_line_1)}
                helperText={formErrors.address_line_1}
              />
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="address_line_2"
                label="Address line 2"
                name="address_line_2"
                autoComplete="address_line_2"
                value={formdata.address_line_2}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
                error={Boolean(formErrors.address_line_2)}
                helperText={formErrors.address_line_2}
              />
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="town_city"
                label="Town/City/State"
                name="town_city"
                autoComplete="town_city"
                value={formdata.town_city}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
                error={Boolean(formErrors.town_city)}
                helperText={formErrors.town_city}
              />
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="postcode"
                label="Postal code"
                name="postcode"
                autoComplete="postcode"
                value={formdata.postcode}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
                error={Boolean(formErrors.postcode)}
                helperText={formErrors.postcode}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Submit
              </Button>
            </form>
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

// eslint-disable-next-line no-unused-vars
export async function getServerSideProps(context) {
  return {
    props: {},
  }
}

export default Address
