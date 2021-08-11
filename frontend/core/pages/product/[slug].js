/* eslint-disable react/prop-types */
import React, { useState, useEffect, useContext } from "react"

import {
  Container,
  Grid,
  Box,
  makeStyles,
  Typography,
  fade,
  InputLabel,
  FormControl,
  Button,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Divider,
  Hidden,
  Tabs,
  Tab,
  Link as ALink,
} from "@material-ui/core"
import AddCircleIcon from "@material-ui/icons/AddCircle"
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle"
import Alert from "@material-ui/lab/Alert"
import Head from "next/head"
import Image from "next/image"
import Link from "next/link"
import Router from "next/router"
import { useCookies } from "react-cookie"

import {
  addCartItem,
  getProduct,
  getProducts,
  updateWishlist,
} from "../../config/axios"
import AppContext from "../../contexts/AppContext"

const Product = ({ product }) => {
  const classes = useStyles()

  const [qty, setQty] = useState(1)
  const [cookies] = useCookies(["csrftoken"])
  const [image, setImage] = useState(0)
  const {
    context: { reload },
    state,
  } = useContext(AppContext)

  const [alert, setAlert] = useState({
    severity: "",
    message: "",
  })

  useEffect(() => {
    let imageIndex = product.product_image.findIndex(
      (image) => image.is_feature === true
    )
    setImage(imageIndex)
  }, [])

  const handleAdd = () => {
    if (state.loggedIn === false) {
      reload({ ...state, next: Router.asPath })
    } else {
      let body = {
        product_id: product.id,
        product_qty: qty,
      }

      addCartItem(body, cookies.csrftoken)
        .then((response) => {
          reload({ ...state, qty: response.total_qty })
        })
        .catch((err) =>
          console.error(
            "[ADD TO CART ERROR]",
            err && err.response ? err.response.data : err
          )
        )
    }
  }

  const handleWishlist = () => {
    if (state.loggedIn === false) {
      reload({ ...state, next: Router.asPath })
    } else {
      updateWishlist(product.id, cookies.csrftoken)
        .then((res) => setAlert({ severity: "info", message: res.success }))
        .catch((err) =>
          console.error("[WISHLIST ERROR]", err && err.response ? err.response : err)
        )
    }
  }

  return (
    <>
      <Head>
        <title>{product.title}</title>
      </Head>
      <Container maxWidth="md">
        {alert && alert.message ? (
          <Box marginBottom={3}>
            <Alert severity={alert.severity}>
              <Box display="flex" gridGap={4}>
                {alert.message} -
                <Link href="/account/wishlist" passHref>
                  <ALink variant="body2" color="inherit">
                    <b>
                      <u>Go to wishlist</u>
                    </b>
                  </ALink>
                </Link>
              </Box>
            </Alert>
          </Box>
        ) : null}
        <Grid container spacing={2}>
          <Hidden smDown>
            <Grid item xs={12} md={2}>
              <Box display="flex" flexDirection="column">
                <Tabs
                  value={image}
                  onChange={(e, val) => setImage(val)}
                  orientation="vertical"
                >
                  {product.product_image.map((product_image) => (
                    <Tab
                      key={product_image.id}
                      className={classes.image}
                      disableRipple
                      style={{
                        background: `url(${product_image.image})`,
                        position: "relative",
                        backgroundSize: "contain",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        // minWidth: 'unset',
                      }}
                      label={<span className={classes.imageLayer} />}
                    ></Tab>
                  ))}
                </Tabs>
              </Box>
            </Grid>
          </Hidden>

          <Grid item xs={12} md={6}>
            <Grid container>
              <Grid item xs={12}>
                <Typography variant="h3" component="h1" className={classes.title}>
                  {product.title}
                </Typography>
                <Typography
                  variant="body1"
                  component="p"
                  color="textSecondary"
                  gutterBottom
                >
                  {product.description}
                </Typography>

                <Box display="flex" justifyContent="center" paddingTop={2}>
                  <Image
                    src={product.product_image[image].image}
                    alt={product.product_image[image].alt_text}
                    width={400}
                    height={400}
                  />
                </Box>
              </Grid>
            </Grid>
          </Grid>

          <Hidden mdUp>
            <Grid item xs={12} md={2}>
              <Box
                display="flex"
                flexDirection="row"
                justifyContent="center"
                alignContent="center"
              >
                <Tabs value={image} onChange={(e, val) => setImage(val)}>
                  {product.product_image.map((product_image) => (
                    <Tab
                      key={product_image.id}
                      className={classes.image}
                      style={{
                        background: `url(${product_image.image})`,
                        position: "relative",
                        backgroundSize: "cover",
                        minWidth: "unset",
                      }}
                      label={<span className={classes.imageLayer} />}
                    ></Tab>
                  ))}
                </Tabs>
              </Box>
            </Grid>
          </Hidden>

          <Grid item xs={12} md={4}>
            <Box component="div" display="grid" gridGap={"0.5rem"}>
              <Box
                component="div"
                display="flex"
                justifyContent="space-between"
                gridGap={10}
              >
                <Box component="div">
                  <Typography variant="h4" component="p" style={{ fontWeight: 400 }}>
                    ₱{product.regular_price}
                  </Typography>
                  <Typography
                    variant="body1"
                    component="p"
                    color="textSecondary"
                    style={{ fontWeight: 400 }}
                  >
                    includes tax
                  </Typography>
                </Box>

                <FormControl className={classes.formControl}>
                  <InputLabel
                    htmlFor="qty"
                    classes={{
                      root: classes.label,
                    }}
                  >
                    Qty
                  </InputLabel>
                  <OutlinedInput
                    classes={{
                      root: classes.qty,
                      input: classes.qtyInput,
                    }}
                    id="qty"
                    type="number"
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                    startAdornment={
                      <InputAdornment position="start">
                        <IconButton
                          onClick={() => (qty === 0 ? setQty(0) : setQty(qty - 1))}
                          size="small"
                          color={qty === 0 ? "default" : "primary"}
                        >
                          <RemoveCircleIcon />
                        </IconButton>
                      </InputAdornment>
                    }
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setQty(qty + 1)}
                          size="small"
                          color="primary"
                        >
                          <AddCircleIcon />
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>
              </Box>

              <Divider variant="middle" component="hr" style={{ margin: "16px" }} />

              <Button variant="contained" color="primary" onClick={handleAdd}>
                Add to Cart
              </Button>

              <Button variant="contained" color="default" onClick={handleWishlist}>
                Add to wishlist
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  )
}

const useStyles = makeStyles((theme) => ({
  cardMedia: {
    height: theme.spacing(40),
    [theme.breakpoints.up("sm")]: {
      height: theme.spacing(60),
    },
  },
  formControl: {
    maxWidth: 150,
  },
  image: {
    alignSelf: "center",
    width: theme.spacing(8),
    height: theme.spacing(8),
    padding: theme.spacing(1, 1, 1, 1),
    margin: theme.spacing(1, 0, 1, 1),
    [theme.breakpoints.up("md")]: {
      width: theme.spacing(10),
      height: theme.spacing(10),
      padding: theme.spacing(1, 0, 1, 0),
      margin: theme.spacing(1, 0, 1, 0),
    },
    position: "relative",
    backgroundSize: "cover",
  },
  imageLayer: {
    backgroundColor: "white",
    opacity: 0,
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    transition: theme.transitions.create("opacity"),

    "&:hover": {
      opacity: 0.15,
    },
  },
  label: {
    margin: theme.spacing(0.5, 0, 0, 1),
  },
  qty: {
    padding: theme.spacing(1, 0.5, 0, 0.5),
  },
  qtyInput: {
    padding: theme.spacing(2, 0, 2, 0),
  },
  select: {
    padding: theme.spacing(1),
  },
  tableCell: {
    borderBottom: `1px solid ${fade(theme.palette.common.black, 0.1)}`,
  },
  tableContainer: {
    marginTop: theme.spacing(2),
    // border: '1px solid rgba(224, 224, 224, 1)'
    border: `1px solid ${fade(theme.palette.common.black, 0.1)}`,
    overflowX: "hidden",
  },
  title: {
    fontWeight: 100,
  },
}))

export async function getStaticProps(context) {
  const product = await getProduct(context.params.slug)

  return {
    props: {
      product: product,
    },
  }
}

export async function getStaticPaths() {
  const products = await getProducts()

  const paths = products.map((product) => ({
    params: {
      slug: product.slug,
    },
  }))

  return {
    paths: paths,
    fallback: false,
  }
}

export default Product
