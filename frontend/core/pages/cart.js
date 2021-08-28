import React, { useContext, useEffect, useState } from "react"

import {
  alpha,
  Box,
  Container,
  Grid,
  Link as ALink,
  Paper,
  Divider,
  InputLabel,
  FormControl,
  Button,
  OutlinedInput,
  InputAdornment,
  IconButton,
  makeStyles,
  Menu,
  MenuItem,
} from "@material-ui/core"
import { Hidden } from "@material-ui/core"
import { Typography } from "@material-ui/core"
import AddCircleIcon from "@material-ui/icons/AddCircle"
import ClearIcon from "@material-ui/icons/Clear"
import CreateIcon from "@material-ui/icons/Create"
import ExpandLessIcon from "@material-ui/icons/ExpandLess"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle"
import Head from "next/head"
import Image from "next/image"
import Link from "next/link"
import { useCookies } from "react-cookie"

import withAuthentication from "../components/withAuthentication"
import { deleteCartItem, getCart, updateCartItem } from "../config/axios"
import AppContext from "../contexts/AppContext"

const Cart = () => {
  const classes = useStyles()
  const [anchor, setAnchor] = useState(null)

  const [cookies] = useCookies(["csrftoken"])

  const [publicId, setPublicId] = useState("")
  const [items, setItems] = useState([])
  const [qtys, setQtys] = useState({})
  const [price, setPrice] = useState(0)

  const {
    context: { reload },
    state,
  } = useContext(AppContext)

  useEffect(() => {
    getCart()
      .then((response) => {
        setPublicId(response.public_id)
        setItems(response.items)

        // assign multiple quantities for every cart item
        // so it can be edited by the text field onChange function
        var dict = {}
        response.items.map((item) => (dict[item.id] = item.qty))
        setQtys(dict)

        setPrice(response.total_price)
        reload({ ...state, qty: response.total_qty })
      })
      .catch((err) => console.log("[CART ERROR]", err.response))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleCloseAnchor = () => {
    setAnchor(null)
  }

  const handleDelete = (id) => {
    deleteCartItem(id, cookies.csrftoken)
      .then((response) => {
        setPublicId(response.public_id)
        setItems(response.items)
        setPrice(response.total_price)
        reload({ ...state, qty: response.total_qty })
      })
      .catch((err) => console.log("[CART ERROR]", err.response))
  }

  const handleUpdate = (id) => {
    let item = items.find((item) => item.id === id)
    let qty = qtys[id]

    if (qty <= 0) {
      handleDelete(id)
    } else {
      let body = {
        product: item.product,
        qty: qty,
      }

      updateCartItem(id, body, cookies.csrftoken)
        .then((response) => {
          setPublicId(response.public_id)
          setItems(response.items)
          setPrice(response.total_price)
          reload({ ...state, qty: response.total_qty })
        })
        .catch((err) => console.log("[CART ERROR]", err.response))
    }
  }

  return (
    <>
      <Head>
        <title>Cart</title>
      </Head>
      <Container maxWidth="lg">
        <Grid container>
          <Grid item xs={12}>
            <Typography component="h1" variant="h4" gutterBottom>
              Your basket
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography component="p" gutterBottom>
              Manage your <b>items</b> in your basket
            </Typography>
          </Grid>
        </Grid>
        <Divider className={classes.divider} />
      </Container>
      <Container maxWidth="lg">
        {!items || items.length <= 0 ? (
          <>
            <Typography
              variant="body1"
              component="p"
              color="textSecondary"
              gutterBottom
            >
              Your cart is empty
            </Typography>
            <Link href="/" passHref>
              <ALink gutterBottom>Shop</ALink>
            </Link>
          </>
        ) : (
          <Grid container>
            <Grid item xs={12} className={classes.priceDetail}>
              <Box display="flex" alignItems="center">
                <Box paddingRight={2}>
                  <Typography component="p">Order</Typography>
                </Box>
                <Button
                  className={classes.shippingButton}
                  disableRipple
                  onClick={(event) => setAnchor(event.currentTarget)}
                >
                  <Typography>Shipping options</Typography>
                  {anchor ? (
                    <ExpandLessIcon color="action" />
                  ) : (
                    <ExpandMoreIcon color="action" />
                  )}
                </Button>

                <Menu
                  getContentAnchorEl={null}
                  anchorEl={anchor}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  keepMounted
                  open={Boolean(anchor)}
                  onClose={handleCloseAnchor}
                >
                  <MenuItem>Next day delivery</MenuItem>
                  <MenuItem>Premium delivery</MenuItem>
                </Menu>
              </Box>

              <Box className={classes.price}>
                <Typography gutterBottom>
                  Sub total: <b>₱{price}</b>
                </Typography>
                <Typography gutterBottom>
                  Shipping (Next day delivery): <b>₱11.50</b>
                </Typography>
                <Typography component="h6" variant="h6">
                  Total: <b>₱{(parseFloat(price) + 11.5).toFixed(2)}</b>
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={9}>
              {items &&
                items.map((item) => {
                  let product_image = item.detail.product_image.find(
                    (product_image) => product_image.is_feature === true
                  )
                  return (
                    <Paper
                      variant="outlined"
                      square
                      key={item.id}
                      className={classes.card}
                    >
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={5} lg={4} className={classes.img}>
                          <Image
                            src={`${product_image.image}`}
                            alt={product_image.alt_text}
                            width={300}
                            height={300}
                          />
                        </Grid>
                        <Grid item xs={12} md={7} lg={8}>
                          <Grid container>
                            <Grid item xs={12}>
                              <Box margin={1}>
                                <Box className={classes.titleBox}>
                                  <Link
                                    href={`/product/${encodeURIComponent(
                                      item.detail.slug
                                    )}`}
                                    passHref
                                  >
                                    <ALink
                                      component="h1"
                                      variant="h5"
                                      className={classes.title}
                                      gutterBottom
                                    >
                                      {`${item.qty}x ${item.detail.title}`}
                                    </ALink>
                                  </Link>
                                </Box>

                                <Paper variant="outlined" square>
                                  <Box
                                    component="div"
                                    display="grid"
                                    gridGap={"0.5rem"}
                                    padding={1}
                                  >
                                    <Grid container>
                                      <Grid item xs={12} md={8}>
                                        <Box
                                          display="flex"
                                          flexDirection="column"
                                          marginBottom={2}
                                        >
                                          <Typography
                                            variant="body1"
                                            component="p"
                                            color="textSecondary"
                                            gutterBottom
                                          >
                                            {item.detail.description}
                                          </Typography>
                                        </Box>
                                        {item.specifications.map((spec) => (
                                          <Box
                                            key={spec.id}
                                            display="flex"
                                            gridGap={10}
                                          >
                                            <Typography
                                              variant="body1"
                                              color="textSecondary"
                                              component="p"
                                            >
                                              {spec.specification_detail.name}
                                            </Typography>
                                            <Typography
                                              key={spec.id}
                                              variant="body1"
                                              component="span"
                                            >
                                              {spec.value_detail.value}
                                            </Typography>
                                          </Box>
                                        ))}
                                      </Grid>
                                      <Grid item xs={12} md={4}>
                                        <Box textAlign="end">
                                          <Typography variant="body1" component="p">
                                            <Box component="span" fontWeight="bold">
                                              ₱{item.price}
                                            </Box>
                                          </Typography>
                                        </Box>
                                      </Grid>
                                    </Grid>

                                    <Divider />

                                    <Box className={classes.buttonGroup}>
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
                                          value={qtys[item.id]}
                                          onChange={(e) => {
                                            e.target.value <= 0
                                              ? setQtys({ ...qtys, [item.id]: 0 })
                                              : setQtys({
                                                  ...qtys,
                                                  [item.id]: e.target.value,
                                                })
                                          }}
                                          startAdornment={
                                            <InputAdornment position="start">
                                              <IconButton
                                                onClick={() =>
                                                  qtys[item.id] <= 0
                                                    ? setQtys({
                                                        ...qtys,
                                                        [item.id]: 0,
                                                      })
                                                    : setQtys({
                                                        ...qtys,
                                                        [item.id]: qtys[item.id] - 1,
                                                      })
                                                }
                                                size="small"
                                                color={
                                                  qtys[item.id] <= 0
                                                    ? "default"
                                                    : "primary"
                                                }
                                              >
                                                <RemoveCircleIcon />
                                              </IconButton>
                                            </InputAdornment>
                                          }
                                          endAdornment={
                                            <InputAdornment position="end">
                                              <IconButton
                                                onClick={() =>
                                                  setQtys({
                                                    ...qtys,
                                                    [item.id]: qtys[item.id] + 1,
                                                  })
                                                }
                                                size="small"
                                                color="primary"
                                              >
                                                <AddCircleIcon />
                                              </IconButton>
                                            </InputAdornment>
                                          }
                                        />
                                      </FormControl>

                                      <Box display="flex">
                                        <Hidden xsDown>
                                          <Button
                                            variant="outlined"
                                            size="small"
                                            color="primary"
                                            startIcon={<CreateIcon />}
                                            className={classes.button}
                                            onClick={() => handleUpdate(item.id)}
                                          >
                                            Update
                                          </Button>

                                          <Button
                                            variant="outlined"
                                            size="small"
                                            color="default"
                                            startIcon={<ClearIcon />}
                                            className={classes.button}
                                            onClick={() => handleDelete(item.id)}
                                          >
                                            Delete
                                          </Button>
                                        </Hidden>
                                        <Hidden smUp>
                                          <Button
                                            variant="outlined"
                                            size="small"
                                            color="primary"
                                            className={classes.button}
                                            onClick={() => handleUpdate(item.id)}
                                          >
                                            <CreateIcon />
                                          </Button>

                                          <Button
                                            variant="outlined"
                                            size="small"
                                            color="default"
                                            className={classes.button}
                                            onClick={() => handleDelete(item.id)}
                                          >
                                            <ClearIcon />
                                          </Button>
                                        </Hidden>
                                      </Box>
                                    </Box>
                                  </Box>
                                </Paper>
                              </Box>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Paper>
                  )
                })}
            </Grid>
            <Grid item xs={12} md={3}>
              <Box marginY={2} paddingX={1}>
                <Box marginBottom={2}>
                  <Link href={`checkout/${encodeURIComponent(publicId)}`} passHref>
                    <Button variant="contained" color="primary" fullWidth>
                      Checkout
                    </Button>
                  </Link>
                </Box>
                <Box marginBottom={2}>
                  <Button color="primary" fullWidth>
                    Save for later
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        )}
      </Container>
    </>
  )
}

const useStyles = makeStyles((theme) => ({
  divider: {
    margin: theme.spacing(2, 0, 2, 0),
  },
  price: {
    textAlign: "start",
    padding: theme.spacing(1, 0, 1, 0),
    [theme.breakpoints.up("md")]: {
      textAlign: "end",
      padding: theme.spacing(0),
    },
  },
  priceDetail: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    background: alpha(theme.palette.primary.main, 0.09),
    padding: theme.spacing(2),
    [theme.breakpoints.down("xs")]: {
      padding: theme.spacing(1),
      flexDirection: "column",
    },
  },
  shippingButton: {
    color: "inherit",
    textTransform: "none",
  },
  button: {
    margin: theme.spacing(1),
  },
  buttonGroup: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    [theme.breakpoints.up("sm")]: {
      // marginTop: theme.spacing(2),
      flexDirection: "row",
    },
  },
  card: {
    margin: theme.spacing(2, 0, 2, 0),
  },
  description: {
    padding: theme.spacing(1),
    [theme.breakpoints.up("md")]: {
      padding: theme.spacing(2),
    },
  },

  detail: {
    padding: theme.spacing(0, 1, 0, 1),
    flexDirection: "column",
    [theme.breakpoints.up("lg")]: {
      padding: theme.spacing(0, 2, 0, 2),
    },
    [theme.breakpoints.down("xs")]: {
      marginBottom: theme.spacing(1),
    },
  },

  formControl: {
    maxWidth: 200,
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
  img: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    [theme.breakpoints.down("xs")]: {
      "& img": {
        width: "200px !important",
        height: "200px !important",
        minWidth: "unset !important",
        maxWidth: "unset !important",
        minHeight: "unset !important",
        maxHeight: "unset !important",
      },
    },
  },
  itemPrice: {
    textAlign: "end",
    fontWeight: "bold",
    [theme.breakpoints.down("xs")]: {
      paddingTop: theme.spacing(1, 0, 1, 0),
      fontSize: 16,
    },
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
  titleBox: {
    padding: theme.spacing(1, 1, 1, 1),
    [theme.breakpoints.up("sm")]: {
      padding: theme.spacing(1, 0, 1, 0),
    },
  },
}))

export default withAuthentication(Cart)
