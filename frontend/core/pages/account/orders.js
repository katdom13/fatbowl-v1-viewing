import React, { Fragment, useEffect, useState } from "react"

import {
  Box,
  Button,
  Container,
  Grid,
  makeStyles,
  Typography,
  Divider,
  Link as ALink,
  Hidden,
  fade,
  Menu,
  MenuItem,
} from "@material-ui/core"
import ExpandLessIcon from "@material-ui/icons/ExpandLess"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import Head from "next/head"
import Image from "next/image"
import Link from "next/link"

import { getOrders } from "../../config/axios"
import { getDateTime } from "../../config/utils"

const Orders = () => {
  const classes = useStyles()
  const [anchors, setAnchors] = useState({})

  const [orders, setOrders] = useState([])

  useEffect(() => {
    getOrders().then((res) => {
      setOrders(res)
    })
  }, [])

  const handleCloseAnchor = (orderId) => {
    setAnchors({ ...anchors, [orderId]: null })
  }

  return (
    <>
      <Head>
        <title>Orders</title>
      </Head>
      <Container maxWidth="lg">
        <Grid container>
          <Grid item xs={12}>
            <Typography component="h1" variant="h4" gutterBottom>
              Your orders
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography component="p" gutterBottom>
              View your <b>order and transaction</b> history
            </Typography>
          </Grid>
        </Grid>
        <Divider className={classes.divider} />
        <Grid container spacing={2}>
          {!orders.length ? (
            <Grid item xs={12}>
              <Typography component="p">Nothing to see here</Typography>
            </Grid>
          ) : null}
          {orders &&
            orders.map((order) => (
              <Fragment key={order.id}>
                <Grid item xs={12}>
                  <Box
                    display="flex"
                    alignItems="center"
                    className={classes.orderDetails}
                  >
                    <Hidden mdUp>
                      <Grid container>
                        <Grid item xs={12}>
                          <Box>
                            <Typography component="p" variant="body1">
                              {getDateTime(order.created_at)}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12}>
                          <Button
                            disableRipple
                            color="inherit"
                            className={classes.dispatchBtn}
                            onClick={(event) =>
                              setAnchors({
                                ...anchors,
                                [order.id]: event.currentTarget,
                              })
                            }
                          >
                            <Typography variant="body1">Dispatched to</Typography>
                            {anchors[order.id] ? (
                              <ExpandLessIcon color="action" />
                            ) : (
                              <ExpandMoreIcon color="action" />
                            )}
                          </Button>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography component="p" variant="body1">
                            Total paid: <b>₱{order.total_paid}</b>
                          </Typography>
                        </Grid>
                      </Grid>
                    </Hidden>
                    <Hidden smDown>
                      <Box display="flex" alignItems="center" flexGrow={1}>
                        <Box marginRight={2}>
                          <Typography component="p" variant="body1">
                            {getDateTime(order.created_at)}
                          </Typography>
                        </Box>

                        <Button
                          disableRipple
                          color="inherit"
                          className={classes.dispatchBtn}
                          onClick={(event) =>
                            setAnchors({
                              ...anchors,
                              [order.id]: event.currentTarget,
                            })
                          }
                        >
                          <Typography variant="body1">Dispatched to</Typography>
                          {anchors[order.id] ? (
                            <ExpandLessIcon color="action" />
                          ) : (
                            <ExpandMoreIcon color="action" />
                          )}
                        </Button>
                      </Box>
                      <Typography component="p" variant="body1">
                        Total paid: <b>₱{order.total_paid}</b>
                      </Typography>
                    </Hidden>
                  </Box>
                </Grid>
                <Menu
                  getContentAnchorEl={null}
                  anchorEl={anchors[order.id]}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  keepMounted
                  open={Boolean(anchors[order.id])}
                  onClose={() => handleCloseAnchor(order.id)}
                >
                  <MenuItem dense>
                    <Typography variant="caption">{order.full_name}</Typography>
                  </MenuItem>
                  <MenuItem dense>
                    <Typography variant="caption">{order.address_line_1}</Typography>
                  </MenuItem>
                  <MenuItem dense>
                    <Typography variant="caption">{order.address_line_2}</Typography>
                  </MenuItem>
                  <MenuItem dense>
                    <Typography variant="caption">{order.town_city}</Typography>
                  </MenuItem>
                  <MenuItem dense>
                    <Typography variant="caption">{order.postcode}</Typography>
                  </MenuItem>
                </Menu>
                <Grid item xs={12} md={9}>
                  {order.items.map((item) => {
                    let product_image = item.detail.product_image.find(
                      (product_image) => product_image.is_feature === true
                    )
                    return (
                      <Grid container spacing={2} key={item.id}>
                        <Grid item xs={12} md={3} className={classes.img}>
                          <Image
                            src={`${product_image.image}`}
                            alt={product_image.alt_text}
                            width={300}
                            height={300}
                          />
                        </Grid>
                        <Grid item xs={12} md={9}>
                          <Box marginBottom={2}>
                            <Link
                              href={`/product/${encodeURIComponent(
                                item.detail.slug
                              )}`}
                              passHref
                            >
                              <ALink>{`${item.qty}x ${item.detail.title}`}</ALink>
                            </Link>
                          </Box>

                          {item.specifications.map((spec) => (
                            <Box key={spec.id} display="flex" gridGap={10}>
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
                      </Grid>
                    )
                  })}
                </Grid>
                <Grid item xs={12} md={3}>
                  <Box display="flex" flexDirection="column" gridGap={8}>
                    <Button variant="contained" color="primary" fullWidth>
                      Problem with order
                    </Button>
                    <Button variant="contained" color="default" fullWidth>
                      Leave a review
                    </Button>
                  </Box>
                </Grid>
              </Fragment>
            ))}
        </Grid>
      </Container>
    </>
  )
}

const useStyles = makeStyles((theme) => ({
  dispatchBtn: {
    textTransform: "none",
    "&:hover": {
      background: "none",
    },
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(1, 0),
    },
  },
  divider: {
    margin: theme.spacing(2, 0, 2, 0),
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
  orderDetails: {
    padding: theme.spacing(1),
    background: fade(theme.palette.primary.main, 0.09),
    [theme.breakpoints.up("md")]: {
      padding: theme.spacing(2),
    },
  },
}))

export default Orders
